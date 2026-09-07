from fastapi import APIRouter
from pydantic import BaseModel

from app.agents.chat_agent import chat_agent

router = APIRouter()


class ChatRequest(BaseModel):
    question: str


@router.post("/chat")
def chat(request: ChatRequest):

    answer = chat_agent.ask(request.question)

    return {
        "question": request.question,
        "answer": answer
    }