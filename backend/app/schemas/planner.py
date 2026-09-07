from pydantic import BaseModel

# Request coming from the frontend
class PlannerRequest(BaseModel):
    topic: str

class ResearchPlan(BaseModel):
    objectives: list[str]
    keywords: list[str]
    research_questions: list[str]
    deliverables: list[str]