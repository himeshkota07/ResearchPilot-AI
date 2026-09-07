import time
import logging
from app.agents.retriever import retriever
from app.services.llm import llm
from langchain_core.messages import SystemMessage, HumanMessage

logger = logging.getLogger(__name__)


class ChatAgent:

    def ask(self, question: str):
        docs = retriever.retrieve(question)

        context = "\n\n".join(doc.page_content for doc in docs)

        messages = [
            SystemMessage(
                content="""You are ResearchPilot AI, an expert academic research assistant.
Explain the research paper clearly and concisely in simple English.
Answer using the provided context. If the answer is not in the context, state that clearly."""
            ),
            HumanMessage(
                content=f"""Context:
{context[:6000]}

Question:
{question}"""
            ),
        ]

        for attempt in range(3):
            try:
                response = llm.invoke(messages)
                return response.content
            except Exception as e:
                err_str = str(e).lower()
                if "429" in err_str or "rate limit" in err_str:
                    logger.warning(f"Mistral 429 in ChatAgent attempt {attempt + 1}, retrying...")
                    time.sleep(2 * (attempt + 1))
                elif attempt == 2:
                    return f"Based on the retrieved excerpts from the paper:\n\n{context[:500]}..."
                else:
                    time.sleep(1)

        return "I was unable to retrieve a complete answer at this time. Please try again."


chat_agent = ChatAgent()