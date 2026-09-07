from pydantic import BaseModel, field_validator


class ReportSchema(BaseModel):
    title: str = "Research Analysis Report"
    abstract: str = ""
    literature_review: str = ""
    research_gaps: str = ""
    proposed_future_work: str = ""
    conclusion: str = ""

    @field_validator("*", mode="before")
    @classmethod
    def stringify_all(cls, v):
        if isinstance(v, list):
            return "\n\n".join(str(item) for item in v)
        return str(v or "")