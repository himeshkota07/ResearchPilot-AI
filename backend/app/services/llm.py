import os
from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI

load_dotenv()

model_name = os.getenv("LLM_MODEL", "open-mistral-7b")
api_key = os.getenv("MISTRAL_API_KEY")

# Primary LLM — open-mistral-7b is available on free tiers without 429 errors
llm = ChatMistralAI(
    model=model_name,
    api_key=api_key,
    temperature=0.3,
    max_retries=3,
)

# Fast LLM — slightly lower temperature for structured outputs
llm_fast = ChatMistralAI(
    model=model_name,
    api_key=api_key,
    temperature=0.2,
    max_retries=3,
)