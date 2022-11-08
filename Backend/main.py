from flask import Flask, Response, request, jsonify
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

    with open('/data/result.json', 'w') as f:
        json.dump(articles, f)
    return Response(status=200)

@app.route("/get",methods=["GET"])
def get():
    try:
        with open('/data/result.json', 'r') as f:
            articles = json.load(f)
    except FileNotFoundError:
        articles = {"articles": {}}

    return jsonify(articles)

app.run(port=5000, host="0.0.0.0")
