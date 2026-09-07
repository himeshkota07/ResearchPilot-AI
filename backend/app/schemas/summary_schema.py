from typing import List, Union
from pydantic import BaseModel, field_validator


class SummarySchema(BaseModel):
    title: str = "Research Paper"
    summary: str = ""
    key_points: List[str] = []
    methodology: Union[str, List[str]] = ""
    datasets: List[str] = []
    limitations: List[str] = []
    future_work: List[str] = []

    @field_validator("methodology", mode="before")
    @classmethod
    def format_methodology(cls, v):
        if isinstance(v, list):
            return "\n".join(str(item) for item in v)
        return str(v or "")