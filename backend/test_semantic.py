import requests

url = "https://api.semanticscholar.org/graph/v1/paper/search"

params = {
    "query": "AI Voice Scam Detection",
    "limit": 2,
    "fields": "title,authors,year"
}

try:
    response = requests.get(url, params=params, timeout=20)

    print("Status:", response.status_code)
    print(response.text)

except Exception as e:
    print("ERROR:")
    print(e)