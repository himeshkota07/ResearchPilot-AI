from fastapi import APIRouter

from app.schemas.planner import PlannerRequest
from app.agents.paper_search import paper_search

router = APIRouter()


@router.post("/papers")
def search_papers(request: PlannerRequest):

    papers = paper_search.search(request.topic)

    return papers