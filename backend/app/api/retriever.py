from fastapi import APIRouter

from app.agents.retriever import retriever

router = APIRouter()


@router.get("/retrieve")
def retrieve(query: str):
    context = retriever.retrieve(query)

    return {
        "query": query,
        "context": context
    }