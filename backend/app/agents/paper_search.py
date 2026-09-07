import requests


class PaperSearchAgent:

    BASE_URL = "https://api.semanticscholar.org/graph/v1/paper/search"

    def search(self, topic: str, limit: int = 5):

        params = {
            "query": topic,
            "limit": limit,
            "fields": "title,authors,year,abstract,url"
        }

        response = requests.get(self.BASE_URL, params=params)

        response.raise_for_status()

        data = response.json()

        papers = []

        for paper in data.get("data", []):

            papers.append({
                "title": paper.get("title"),
                "authors": [
                    author["name"]
                    for author in paper.get("authors", [])
                ],
                "year": paper.get("year"),
                "abstract": paper.get("abstract"),
                "url": paper.get("url")
            })

        return papers


paper_search = PaperSearchAgent()