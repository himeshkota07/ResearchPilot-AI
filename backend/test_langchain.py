import os
from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI

load_dotenv()

api_key = os.getenv("MISTRAL_API_KEY")

print("API Key Loaded:", "YES" if api_key else "NO")

llm = ChatMistralAI(
    model="mistral-large-latest",
    api_key=api_key,
    temperature=0.3,
)

response = llm.invoke("Say hello in one sentence.")

print(response.content)