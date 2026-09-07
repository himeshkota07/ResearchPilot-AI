from fastapi import APIRouter
from fastapi import HTTPException

from app.schemas.planner import PlannerRequest
from app.agents.planner import planner

router = APIRouter()


@router.post("/plan")
def generate_plan(request: PlannerRequest):

    try:

        plan = planner.generate_plan(request.topic)

        return plan

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )