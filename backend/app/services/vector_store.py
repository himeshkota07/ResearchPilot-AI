import os
from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_mistralai import MistralAIEmbeddings

load_dotenv()

embedding_model = MistralAIEmbeddings(
    model="mistral-embed",
    api_key=os.getenv("MISTRAL_API_KEY"),
)

vector_db = Chroma(
    collection_name="researchpilot",
    persist_directory="app/chroma_db",
    embedding_function=embedding_model,
)
