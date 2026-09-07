import json

from app.services.llm import llm

class PlannerAgent:

    def generate_plan(self, topic: str):

        prompt = f"""
You are an expert AI Research Planner.

Research Topic:
{topic}

Generate:

- 5 Research Objectives
- 10 Important Keywords
- 5 Research Questions
- 5 Expected Deliverables

Return ONLY valid JSON.

Example:

{{
    "objectives": [],
    "keywords": [],
    "research_questions": [],
    "deliverables": []
}}

Do not write markdown.

Do not explain anything.

Only JSON.
"""

        response = llm.invoke(prompt)

        content = response.content.strip()

# Remove ```json
        if content.startswith("```json"):
            content = content.replace("```json", "", 1)

# Remove ending ```
        if content.endswith("```"):
            content = content[:-3]

        content = content.strip()

        return json.loads(content)


planner = PlannerAgent()