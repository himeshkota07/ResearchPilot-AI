from typing import List, Union
from pydantic import BaseModel, field_validator


class ResearchGap(BaseModel):
    gap: str

    @field_validator("gap", mode="before")
    @classmethod
    def parse_gap(cls, v):
        if isinstance(v, dict):
            return v.get("gap") or v.get("text") or str(v)
        return str(v)


class Improvement(BaseModel):
    improvement: str

    @field_validator("improvement", mode="before")
    @classmethod
    def parse_improvement(cls, v):
        if isinstance(v, dict):
            return v.get("improvement") or v.get("text") or str(v)
        return str(v)


class FutureDirection(BaseModel):
    direction: str

    @field_validator("direction", mode="before")
    @classmethod
    def parse_direction(cls, v):
        if isinstance(v, dict):
            return v.get("direction") or v.get("text") or str(v)
        return str(v)


class NovelIdea(BaseModel):
    idea: str
    description: str = ""

    @field_validator("description", mode="before")
    @classmethod
    def parse_desc(cls, v):
        return str(v or "")


class GapSchema(BaseModel):
    research_gaps: List[ResearchGap] = []
    possible_improvements: List[Improvement] = []
    future_research_directions: List[FutureDirection] = []
    novel_project_ideas: List[NovelIdea] = []