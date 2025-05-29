from dotenv import load_dotenv
import json
import requests
from typing import Dict, Any

load_dotenv()

def get_contradiction_news(politician_name: str) -> Dict[str, Any]:
    """
    Fetches contradictory statements made by a politician from the Toolhouse AI API.
    
    Args:
        politician_name: The name of the politician to search for contradictions
        
    Returns:
        dict: A dictionary containing the API response with contradictions data
    """
    try:
        try:
            response = requests.post(
                "https://agents.toolhouse.ai/3b753125-77ee-4332-8ba0-1dca1daeca27",
                json={"vars": {"politician_name": politician_name}}
            )
            response.raise_for_status()
            
            response_text = response.text.strip()
            if '```json' in response_text:
                json_str = response_text.split('```json')[1].split('```')[0].strip()
            else:
                json_str = response_text
                
            return json.loads(json_str)
            
        except (json.JSONDecodeError, IndexError) as e:
            return {"error": "Failed to parse API response", "details": str(e), "raw_response": response_text}
        except requests.RequestException as e:
            return {"error": "API request failed", "details": str(e)}
            
    except Exception as e:
        return {"error": f"An unexpected error occurred: {str(e)}"}