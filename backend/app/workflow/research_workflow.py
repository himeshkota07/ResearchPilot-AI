import time
from concurrent.futures import ThreadPoolExecutor

from langchain_core.documents import Document

from app.services.pdf_reader import pdf_reader
from app.services.vector_store import vector_db
from app.services.text_splitter import splitter
from app.agents.summarizer import summarizer
from app.agents.gap_analyzer import gap_analyzer
from app.agents.report_generator import report_generator


class ResearchWorkflow:

    def run(self, pdf_path: str):

        # ── Step 1: Extract text & embed (local, no API) ────────────
        text = pdf_reader.extract_text(pdf_path)
        chunks = splitter.split_text(text)
        documents = [Document(page_content=chunk) for chunk in chunks]
        vector_db.add_documents(documents)

        # ── Step 2: Summarize ────────────────────────────────────────
        summary = summarizer.summarize(text)

        # Wait between API calls to respect free-tier rate limit (5 req/min)
        time.sleep(3)

        # ── Step 3: Gap analysis ─────────────────────────────────────
        gaps = gap_analyzer.analyze(summary)

        time.sleep(3)

        # ── Step 4: Report generation ────────────────────────────────
        report = report_generator.generate(summary, gaps)

        return {
            "summary": summary,
            "research_analysis": gaps,
            "report": report,
        }


workflow = ResearchWorkflow()