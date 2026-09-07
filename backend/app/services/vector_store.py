from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

embedding_model = HuggingFaceEmbeddings(
    model_name="BAAI/bge-base-en-v1.5"
)

vector_db = Chroma(
    collection_name="researchpilot",
    persist_directory="app/chroma_db",
    embedding_function=embedding_model,
)