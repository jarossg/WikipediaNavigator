import requests
import json

URL = "http://jarossgarrit.de:8080"


with open("articles.json", "r") as file:
    data = json.loads(file)
    #print(data)

    

    for key in data.keys():
        requests.post(URL + "/add/" + key, json=data[key])
    
    file.close()