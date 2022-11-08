import requests
import json

target = "https://wikipedianavigator-default-rtdb.europe-west1.firebasedatabase.app/articles.json"

req = requests.get(target)

if req.status_code != 200:
    print("Http Error: " + req.status_code)
    exit()

with open("articles.json", "w", encoding="utf-8") as file:
    json.dump({"articles":req.json()}, file, ensure_ascii=False, indent=4)