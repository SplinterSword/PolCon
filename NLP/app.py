from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Replace with your OpenAI API Key
OPENAI_API_KEY = "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"

def analyze_contradictions(name, text_articles):
    """
    Uses OpenAI's GPT-4 Turbo to find contradictions in the given text articles and return JSON output.
    """
    contradictions = []

    for i in range(len(text_articles)):
        for j in range(i + 1, len(text_articles)):
            statement_1 = text_articles[i]
            statement_2 = text_articles[j]

            prompt = (
                f"You are a system that detects contradictions in statements.\n"
                f"Compare these two statements from {name}:\n\n"
                f"1. {statement_1}\n"
                f"2. {statement_2}\n\n"
                f"Task:\n"
                f"- Identify if there is a contradiction.\n"
                f"- If a contradiction exists, summarize it in one sentence.\n"
                f"- If no contradiction exists, return an empty list.\n"
                f"Respond in **valid JSON** format:\n\n"
                f"{{\n"
                f'    "contradictions": [\n'
                f"        {{\n"
                f'            "statement_1": "{statement_1}",\n'
                f'            "statement_2": "{statement_2}",\n'
                f'            "summary": "<Your contradiction summary here>"\n'
                f"        }}\n"
                f"    ]\n"
                f"}}\n"
                f"If no contradiction exists, return:\n"
                f'{{ "contradictions": [] }}'
            )

            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"},
                json={
                    "model": "gpt-4-turbo",
                    "messages": [{"role": "system", "content": "You are an expert contradiction detection system. Always return valid JSON."},
                                 {"role": "user", "content": prompt}],
                    "temperature": 0
                }
            )

            if response.status_code == 200:
                response_data = response.json()
                try:
                    contradiction_data = response_data["choices"][0]["message"]["content"]
                    contradiction_json = eval(contradiction_data)
                    
                    if contradiction_json["contradictions"]:  # Only add if there is a contradiction
                        contradictions.extend(contradiction_json["contradictions"])
                except Exception as e:
                    print("Error parsing response:", e)

    return contradictions


@app.route('/analyze', methods=['POST'])
def detect_contradictions():
    """
    Flask route to handle POST requests and return contradiction analysis.
    """
    data = request.get_json()

    # Validate input
    if not data or "name" not in data or "content" not in data:
        return jsonify({"error": "Invalid input format. Expecting 'name' and 'content'."}), 400

    name = data["name"]
    text_articles = data["content"]

    if not isinstance(text_articles, list) or len(text_articles) < 2:
        return jsonify({"error": "Provide at least two text articles for contradiction analysis."}), 400

    # Analyze contradictions using ChatGPT API
    contradictions = analyze_contradictions(name, text_articles)

    return jsonify({
        "subject": name,
        "contradictions": contradictions
    }), 200


if __name__ == '__main__':
    app.run(debug=True)
