import requests
import json

URL = "http://127.0.0.1:5000"


with open("articles.json", "r") as file:
    data = json.loads(file.read())
    #print(data)

    

    for key in data.keys():
        requests.post(URL + "/add/" + key, json=data[key])
    
    file.close()