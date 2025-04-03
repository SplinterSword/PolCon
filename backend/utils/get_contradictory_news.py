from google import genai
from dotenv import load_dotenv
import json
import os

load_dotenv()

GOOGLE_GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")

def get_contradiction_news(politician_name: str):
    client = genai.Client(api_key=GOOGLE_GEMINI_API_KEY)

    prompt = f"""
    Find all contradictions made by {politician_name}. The response must be a JSON object formatted as follows:

    {{
      "contradictions": [
        {{
          "contradiction_id": 1,
          "topic": "Example Topic",
          "statement_1": "First statement made by the politician.",
          "statement_2": "Second, contradictory statement made by the politician.",
          "summary": "Summary of how the statements contradict each other.",
          "articles": [
            "https://example.com/article1",
            "https://example.com/article2"
          ]
        }},
        ...
      ]
    }}

    Ensure that:
    - There are at least 5 contradictions.
    - The JSON output strictly follows the given structure.
    - Each contradiction has a valid topic, statements, and a summary.
    - Each contradiction includes at least one credible article as a source.
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents= prompt
    )

    cleaned_json = response.text.replace("```json", "").replace("```", "").strip()

    try:
        json_data = json.loads(cleaned_json)
        return json_data
    except json.JSONDecodeError:
        # If parsing fails, return the raw text response.
        return f"Error: Could not parse response as JSON.\nRaw response:\n{response.text}"
    except Exception as e:
        return f"An error occurred: {e}"

