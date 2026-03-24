_CONTRADICTIONS_SCHEMA_BODY = {
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
}

# Used by the Finder AI (Phase 1 – discovery)
CONTRADICTION_RESPONSE_SCHEMA = {
    "type": "json_schema",
    "name": "politician_contradictions",
    "strict": True,
    "schema": _CONTRADICTIONS_SCHEMA_BODY,
}

# Used by the Validator AI (Phase 2 – URL verification loop)
VALIDATION_RESPONSE_SCHEMA = {
    "type": "json_schema",
    "name": "validated_contradictions",
    "strict": True,
    "schema": _CONTRADICTIONS_SCHEMA_BODY,
}
