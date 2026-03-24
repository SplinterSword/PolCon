import json
import os
import random
import re
import threading
import time
from typing import Any, Dict, List

from dotenv import load_dotenv
from openai import OpenAI
from utils.schema import CONTRADICTION_RESPONSE_SCHEMA, VALIDATION_RESPONSE_SCHEMA

load_dotenv()

# ---------------------------------------------------------------------------
# System prompts
# ---------------------------------------------------------------------------

FINDER_SYSTEM_PROMPT = """
You are a political fact-checking research assistant specialising in identifying
public contradictions made by politicians.

Your job:
1. Use web search to find well-sourced, verifiable contradictions made by the named politician.
2. Each contradiction must be grounded in real, publicly available news articles.
3. Return data that matches the provided JSON schema exactly – no markdown wrappers.

Rules:
- You MUST perform web search before producing any output.
- Return between 0 and 5 distinct contradictions.
- Each contradiction must list at least 2 source article URLs in the "articles" field.
- Prefer reputable, primary or well-established news sources.
- If no credible contradiction can be verified, return {"contradictions": []}.
- Do NOT fabricate URLs or article titles.
""".strip()

VALIDATOR_SYSTEM_PROMPT = """
You are a rigorous fact-verification assistant.

You will receive a list of political contradictions, each with article URLs that allegedly
support the claim. Your job is to verify whether those articles actually exist and support
the stated contradiction.

For EACH article URL provided:
- Perform a web search / fetch of that URL.
- Confirm the article is real, accessible, and actually discusses the stated contradiction.

Return only the contradictions whose sources you were able to verify.
If ALL sources for a contradiction are dead links, pay-walled without any preview, or
irrelevant to the stated contradiction, EXCLUDE that contradiction from your response.

Return data matching the provided JSON schema exactly – no markdown wrappers.
If nothing could be verified, return {"contradictions": []}.
""".strip()

FINDER_USER_TEMPLATE = (
    "Politician name: {politician_name}\n\n"
    "Search for public contradictions made by this politician and return the structured result."
)

VALIDATOR_USER_TEMPLATE = (
    "Below are contradictions about {politician_name} along with their source article URLs.\n"
    "Please verify each article URL using web search and return only the contradictions "
    "whose sources are real and relevant.\n\n"
    "Contradictions to verify:\n{contradictions_json}"
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_required_env(*names: str) -> str:
    for name in names:
        value = os.getenv(name, "").strip()
        if value:
            return value
    raise ValueError(f"Missing required environment variable. Set one of: {', '.join(names)}")


def _normalize_openai_base_url(raw_base_url: str) -> str:
    base_url = (raw_base_url or "").strip().rstrip("/")
    if not base_url:
        return base_url

    for suffix in (
        "/v1/chat/completions",
        "/v1/responses",
        "/chat/completions",
        "/responses",
    ):
        if base_url.endswith(suffix):
            base_url = base_url[: -len(suffix)]
            break

    if not base_url.endswith("/v1"):
        base_url = base_url + "/v1"

    return base_url


class _InProcessRateLimiter:
    def __init__(self, min_interval_seconds: float) -> None:
        self._min_interval_seconds = max(0.0, float(min_interval_seconds))
        self._lock = threading.Lock()
        self._last_ts = 0.0

    def wait_turn(self) -> None:
        if self._min_interval_seconds <= 0:
            return
        with self._lock:
            now = time.monotonic()
            next_allowed = self._last_ts + self._min_interval_seconds
            sleep_for = next_allowed - now
            if sleep_for > 0:
                time.sleep(sleep_for)
            self._last_ts = time.monotonic()


_RATE_LIMITER = _InProcessRateLimiter(
    float(os.getenv("AI_MIN_INTERVAL_SECONDS", "0.0") or "0.0")
)


def _extract_retry_after_seconds(error_text: str) -> float | None:
    if not error_text:
        return None
    match = re.search(r"try again in\s+([0-9]+(?:\.[0-9]+)?)s", error_text, re.IGNORECASE)
    if not match:
        return None
    try:
        return float(match.group(1))
    except ValueError:
        return None


def _responses_create_with_retry(client: OpenAI, **kwargs: Any) -> Any:
    max_retries = int(os.getenv("AI_MAX_RETRIES", "5") or "5")
    base_backoff = float(os.getenv("AI_RETRY_BASE_BACKOFF_SECONDS", "1.0") or "1.0")
    max_backoff = float(os.getenv("AI_RETRY_MAX_BACKOFF_SECONDS", "30.0") or "30.0")

    attempt = 0
    while True:
        _RATE_LIMITER.wait_turn()
        try:
            return client.responses.create(**kwargs)
        except Exception as e:
            status_code = getattr(e, "status_code", None)
            message = str(e)
            is_429 = status_code == 429 or "rate limit" in message.lower() or "429" in message

            if not is_429 or attempt >= max_retries:
                raise

            retry_after = _extract_retry_after_seconds(message)
            if retry_after is not None:
                sleep_for = retry_after
            else:
                sleep_for = min(max_backoff, base_backoff * (2**attempt))
                sleep_for = sleep_for * (1.0 + random.random() * 0.2)

            time.sleep(max(0.0, sleep_for))
            attempt += 1


def _recommended_retry_after_seconds(exc: Exception) -> float | None:
    return _extract_retry_after_seconds(str(exc))


def _normalize_contradictions(payload: Any) -> Dict[str, Any]:
    if isinstance(payload, list):
        return {"contradictions": payload}
    if isinstance(payload, dict) and isinstance(payload.get("contradictions"), list):
        return {"contradictions": payload["contradictions"]}
    raise ValueError("Model output did not contain a valid 'contradictions' list.")


def _call_ai(
    client: OpenAI,
    model_name: str,
    system_prompt: str,
    user_message: str,
    history: List[Dict[str, str]],
    schema: Dict[str, Any],
) -> tuple[str, List[Dict[str, str]]]:
    """
    Send a message to the AI, maintaining conversation history.

    Returns:
        (response_text, updated_history)
    """
    # Append the new user message to the working history
    new_history = history + [{"role": "user", "content": user_message}]

    # Build the full input: system prompt prepended as the first user turn
    # (Responses API uses `input` as a flat list of role-tagged messages)
    messages = [{"role": "system", "content": system_prompt}] + new_history

    # Note: Structured Outputs (JSON schema via `text.format`) cannot be combined with
    # tool/function calling on many providers/models. We run a 2-step flow:
    # 1) Use tools (web search) to gather information.
    # 2) Re-format into the required JSON schema without tools.

    tool_response = _responses_create_with_retry(
        client,
        model=model_name,
        tools=[{"type": "web_search_preview"}],
        input=messages,
    )

    tool_text = (tool_response.output_text or "").strip()

    format_messages = [
        {
            "role": "system",
            "content": "You are a formatter. Output must be valid JSON matching the provided schema exactly.",
        },
        {
            "role": "user",
            "content": tool_text or "No content was produced in the previous step.",
        },
    ]

    formatted_response = _responses_create_with_retry(
        client,
        model=model_name,
        text={"format": schema},
        input=format_messages,
    )

    response_text = (formatted_response.output_text or "").strip()

    # Record the assistant reply in history
    updated_history = new_history + [{"role": "assistant", "content": response_text}]

    return response_text, updated_history


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def get_contradiction_news(politician_name: str) -> Dict[str, Any]:
    """
    Iteratively find and validate contradictions for a politician.

    Round 1 (Finder): AI with web-search discovers contradictions.
    Round 2+ (Validator): A second AI call validates each article URL via web-search.
    The loop continues until the Validator returns an empty contradictions list
    (meaning all remaining contradictions are verified) or until no further
    refinement is possible.

    Args:
        politician_name: The name of the politician to search for contradictions.

    Returns:
        A dictionary containing a `contradictions` list and the full `conversation_history`,
        or an `error` key on failure.
    """
    try:
        model_name = _get_required_env("OPENAI_MODEL", "AI_MODEL_NAME")
        base_url = _normalize_openai_base_url(_get_required_env("AI_URL", "OPENAI_BASE_URL"))
        api_key = _get_required_env("OPENAI_API_KEY", "AI_API_KEY")

        client = OpenAI(api_key=api_key, base_url=base_url)

        # Shared conversation history across all turns
        conversation_history: List[Dict[str, str]] = []

        # ---------------------------------------------------------------
        # Phase 1 – Finder: discover contradictions with web search
        # ---------------------------------------------------------------
        finder_user_msg = FINDER_USER_TEMPLATE.format(politician_name=politician_name)

        finder_text, conversation_history = _call_ai(
            client=client,
            model_name=model_name,
            system_prompt=FINDER_SYSTEM_PROMPT,
            user_message=finder_user_msg,
            history=conversation_history,
            schema=CONTRADICTION_RESPONSE_SCHEMA,
        )

        if not finder_text:
            return {
                "error": "Finder AI returned no output.",
                "conversation_history": conversation_history,
            }

        current_contradictions = _normalize_contradictions(json.loads(finder_text))

        # If the finder already found nothing, bail early
        if not current_contradictions["contradictions"]:
            return {
                "contradictions": [],
                "conversation_history": conversation_history,
            }

        # ---------------------------------------------------------------
        # Phase 2+ – Validator loop: verify article URLs via web search
        # ---------------------------------------------------------------
        iteration = 0

        while True:
            if iteration >= 5:
                break
            iteration += 1
            contradictions_to_validate = current_contradictions["contradictions"]

            validator_user_msg = VALIDATOR_USER_TEMPLATE.format(
                politician_name=politician_name,
                contradictions_json=json.dumps(contradictions_to_validate, indent=2),
            )

            validator_text, conversation_history = _call_ai(
                client=client,
                model_name=model_name,
                system_prompt=VALIDATOR_SYSTEM_PROMPT,
                user_message=validator_user_msg,
                history=conversation_history,
                schema=VALIDATION_RESPONSE_SCHEMA,
            )

            # Loop terminates when Validator returns empty / no response
            if not validator_text:
                break

            validated = _normalize_contradictions(json.loads(validator_text))
            verified_list = validated["contradictions"]

            # If the validator returns nothing, all remaining items were verified
            # OR it couldn't verify any – either way we stop.
            if not verified_list:
                break

            # If nothing changed after validation, we're done
            if len(verified_list) == len(contradictions_to_validate):
                current_contradictions = validated
                break

            # Some contradictions were filtered out; update and loop again
            current_contradictions = validated

        return {
            "contradictions": current_contradictions["contradictions"],
            "conversation_history": conversation_history,
        }

    except ValueError as e:
        return {"error": str(e)}
    except json.JSONDecodeError as e:
        raw = locals().get("finder_text") or locals().get("validator_text")
        return {
            "error": "Failed to parse AI response as JSON.",
            "details": str(e),
            "raw_response": raw,
        }
    except Exception as e:
        retry_after = _recommended_retry_after_seconds(e)
        payload: Dict[str, Any] = {"error": "AI request failed.", "details": str(e)}
        if retry_after is not None:
            payload["retry_after_seconds"] = retry_after
        return payload
