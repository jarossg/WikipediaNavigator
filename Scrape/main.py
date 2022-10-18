import requests
from bs4 import BeautifulSoup
from loguru import logger

from article import article

start = "https://de.wikipedia.org/wiki/Deutschland"
base = "https://de.wikipedia.org"
firebase = "https://wikipedianavigator-default-rtdb.europe-west1.firebasedatabase.app/articles"

@logger.catch()
def create_tag(tag):
	res = {}
	res["text"] = tag.text
	res["url"] = tag["href"]
	
	res["url"] = base + res["url"]
	return res

def make_article(url):
	req = requests.get(url).content
	soup = BeautifulSoup(req, "html.parser")
	text = soup.body.find(id="content").find(id="bodyContent")
	
	tags = text.find_all("a")
	title = soup.body.find(id="content").find(id="firstHeading").span.text
	
	tag_list = []
	for tag in tags:
		if "href" in tag.attrs and "/wiki/" in tag["href"] and tag.text != "":
			tag_list.append(create_tag(tag))
	
	test = article(title,url,tag_list)
	return test

def upload(article):
    data = article.get_json()
    requests.put(firebase + "/" + article.title + ".json", json=data)

if __name__ == "__main__":
	artikel = make_article(start)
	upload(artikel)
	print(artikel.title)
