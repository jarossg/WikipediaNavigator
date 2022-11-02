import requests
from bs4 import BeautifulSoup
from loguru import logger
import threading
from random import randrange

from article import article

start = "https://de.wikipedia.org/wiki/Deutschland"
base = "https://de.wikipedia.org"
firebase = "https://wikipedianavigator-default-rtdb.europe-west1.firebasedatabase.app/articles"

start = "https://de.wikipedia.org/wiki/KTM_Motor-Fahrzeugbau"

@logger.catch()
def create_tag(tag):
	res = {}
	res["text"] = tag.text
	res["url"] = tag["href"]
	
	res["url"] = base + res["url"]
	return res

def make_article(url):
	try:
		req = requests.get(url)
	except:
		return None
	if req.status_code != 200:
		return None

	req = req.content

	soup = BeautifulSoup(req, "html.parser")
	text = soup.body.find(id="content").find(id="bodyContent")
	
	tags = text.find_all("a")
	title = soup.body.find(id="content").find(id="firstHeading").text
	
	tag_list = []
	for tag in tags:
		if "href" in tag.attrs and "/wiki/" in tag["href"] and tag.text != "":
			tag_list.append(create_tag(tag))
	
	test = article(title,url,tag_list)
	return test

def upload(article):
    data = article.get_json()
    req = requests.put(firebase + "/" + article.title + ".json", json=data)
    if req.status_code != 200:
        logger.error("Upload failed")
    else:
        logger.info(article.title + " uploaded")

@logger.catch()
def process_article(URL):
	artikel = make_article(URL)
	if artikel != None:
		upload(artikel)
		return artikel.tags
	return []

if __name__ == "__main__":
	tags = process_article(start)
	
	while True:
		for tag in tags:
			tags = tags + process_article(tag["url"])
