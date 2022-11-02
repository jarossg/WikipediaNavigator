from flask import Flask, Response, request
from loguru import logger
import json


app = Flask(__name__)

@app.route("/add/<article>", methods=["POST"])
def main(article):
    try:
        with open('/data/result.json', 'r') as f:
            articles = json.load(f)
    except FileNotFoundError:
        articles = {"articles": []}

    articles["articles"][article] = request.json
    return Response(status=200)

@app.route("/get",methods=["GET"])
def get():
    try:
        with open('/data/result.json', 'r') as f:
            articles = json.load(f)
    except FileNotFoundError:
        articles = {"articles": []}

    return Response(status=200, data=articles)

app.run(port=5000)