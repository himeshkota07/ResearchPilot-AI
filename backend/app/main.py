from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.planner import router as planner_router
from app.api.papers import router as papers_router
from app.api.upload import router as upload_router
from app.api.retriever import router as retriever_router
from app.api.chat import router as chat_router

app = FastAPI(
    title="ResearchPilot AI",
    version="1.0.0",
    description="Multi-Agent Research Assistant powered by Mistral AI + ChromaDB",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────
app.include_router(planner_router, prefix="/api", tags=["Planner"])
app.include_router(papers_router, prefix="/api", tags=["Papers"])
app.include_router(upload_router, prefix="/api", tags=["Upload"])
app.include_router(retriever_router, prefix="/api", tags=["Retriever"])
app.include_router(chat_router, prefix="/api", tags=["Chat"])


@app.get("/")
def root():
    return {
        "project": "ResearchPilot AI",
        "version": "1.0.0",
        "status": "Running",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}