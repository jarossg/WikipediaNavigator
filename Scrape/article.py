class article:
    title = ""
    url = ""
    tags = []

    def __init__(self, title, url, tags):
        self.title = title
        self.url = url
        self.tags = tags
    def get_json():
        return {"title":self.title, "url":self.url,"tags":self.tags}
