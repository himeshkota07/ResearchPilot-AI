import json
import re


def parse_llm_json(content: str):
    content = content.strip()

    # Remove markdown fences
    content = re.sub(r"^```json", "", content, flags=re.IGNORECASE)
    content = re.sub(r"^```", "", content)
    content = re.sub(r"```$", "", content)

    content = content.strip()

    # Extract the JSON object
    match = re.search(r"\{.*\}", content, re.DOTALL)

    if not match:
        raise ValueError("No JSON object found in LLM response.")

    json_text = match.group(0)

    try:
        return json.loads(json_text)

    except json.JSONDecodeError:
        print("\n========== INVALID JSON ==========\n")
        print(json_text)
        print("\n=================================\n")
        raise