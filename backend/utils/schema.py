CONTRADICTION_RESPONSE_SCHEMA = {
    "type": "json_schema",
    "name": "politician_contradictions",
    "strict": True,
    "schema": {
        "type": "object",
        "properties": {
            "contradictions": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "contradiction_id": {"type": "integer"},
                        "topic": {"type": "string"},
                        "statement_1": {"type": "string"},
                        "statement_2": {"type": "string"},
                        "summary": {"type": "string"},
                        "articles": {
                            "type": "array",
                            "items": {"type": "string"},
                        },
                    },
                    "required": [
                        "contradiction_id",
                        "topic",
                        "statement_1",
                        "statement_2",
                        "summary",
                        "articles",
                    ],
                    "additionalProperties": False,
                },
            }
        },
        "required": ["contradictions"],
        "additionalProperties": False,
    },
}
