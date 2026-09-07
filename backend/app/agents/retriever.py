from app.services.vector_store import vector_db

retriever_engine = vector_db.as_retriever(
    search_type="mmr",
    search_kwargs={
        "k": 10,
        "fetch_k": 30,
    },
)


class RetrieverAgent:

    def retrieve(self, query):
        return retriever_engine.invoke(query)


retriever = RetrieverAgent()