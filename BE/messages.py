import json

data = {}

@app.route("/", methods = ["GET"])
def home():
    return "Hello World"
