import json
import os
from typing import Any, Dict

from dotenv import load_dotenv
from openai import OpenAI
from utils.schema import CONTRADICTION_RESPONSE_SCHEMA

load_dotenv()

CONTRADICTION_PROMPT = """
You are a political research assistant.

Use web search to find well-sourced public contradictions made by the named politician.
Return data that matches the provided JSON schema exactly.

Rules:
- You must use web search before answering.
- Include 0 to 5 contradictions.
- Each contradiction must include at least 2 source URLs in "articles".
- Prefer reputable primary or well-established news sources.
- If you cannot verify any credible contradiction, return {"contradictions": []}.
- Do not wrap the JSON in markdown.
""".strip()


def _get_required_env(*names: str) -> str:
    for name in names:
        value = os.getenv(name, "").strip()
        if value:
            return value

    raise ValueError(f"Missing required environment variable. Set one of: {', '.join(names)}")


def _normalize_contradictions(payload: Any) -> Dict[str, Any]:
    if isinstance(payload, list):
        return {"contradictions": payload}

    if isinstance(payload, dict) and isinstance(payload.get("contradictions"), list):
        return {"contradictions": payload["contradictions"]}

    raise ValueError("Model output did not contain a valid 'contradictions' list.")


def get_contradiction_news(politician_name: str) -> Dict[str, Any]:
    """
    Fetch contradictory public statements made by a politician with the OpenAI Responses API.

    Args:
        politician_name: The name of the politician to search for contradictions.

    Returns:
        A dictionary containing a `contradictions` list or an `error`.
    """
    try:
        model_name = _get_required_env("OPENAI_MODEL", "MODEL_NAME")
        base_url = _get_required_env("AI_URL", "OPENAI_BASE_URL")
        api_key = _get_required_env("OPENAI_API_KEY", "API_KEY")

        client = OpenAI(api_key=api_key, base_url=base_url)

        response = client.responses.create(
            model=model_name,
            tools=[{"type": "web_search"}],
            text={"format": CONTRADICTION_RESPONSE_SCHEMA},
            input=(
                f"{CONTRADICTION_PROMPT}\n\n"
                f"Politician name: {politician_name}\n"
                "Find contradictions involving this politician and return the structured result."
            ),
        )

        response_text = (response.output_text or "").strip()
        if not response_text:
            return {"error": "OpenAI response did not contain any text output."}

        payload = json.loads(response_text)
        return _normalize_contradictions(payload)

    except ValueError as e:
        return {"error": str(e)}
    except json.JSONDecodeError as e:
        return {
            "error": "Failed to parse OpenAI response as JSON.",
            "details": str(e),
            "raw_response": response_text if "response_text" in locals() else None,
        }
    except Exception as e:
        return {"error": "OpenAI request failed.", "details": str(e)}
