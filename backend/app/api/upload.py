import os
import shutil
import asyncio
from functools import partial

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.workflow.research_workflow import workflow

router = APIRouter()

UPLOAD_DIR = "app/uploads"
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    # ── Validate content type ─────────────────────────────────
    if file.content_type not in ("application/pdf", "application/octet-stream"):
        # Also allow by extension as fallback
        if not (file.filename or "").lower().endswith(".pdf"):
            raise HTTPException(
                status_code=415,
                detail="Only PDF files are accepted. Please upload a valid .pdf file.",
            )

    # ── Read and validate file size ───────────────────────────
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum allowed size is 25 MB. "
                   f"Your file is {len(content) / 1024 / 1024:.1f} MB.",
        )

    # ── Save to disk ──────────────────────────────────────────
    safe_name = os.path.basename(file.filename or "upload.pdf")
    filepath = os.path.join(UPLOAD_DIR, safe_name)
    with open(filepath, "wb") as buffer:
        buffer.write(content)

    # ── Run workflow in thread pool (non-blocking) ─────────────
    try:
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, partial(workflow.run, filepath))
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(exc)}",
        )

    return result