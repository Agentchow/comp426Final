# Data Handling
from apikey import apikey
import json
from datetime import datetime, date
import uuid

# Webserver
from flask import Flask, g, render_template, jsonify, request
from flask_restful import Resource, Api
from flask_cors import CORS
import requests

# Sentiment Analysis
import boto3

# Simulation
import math


app = Flask(__name__)
CORS(app)


@app.route("/comment", methods=["POST"])
def comment_message():
    """Handles new comments on the message board
    Responds to a post request with comment data for a specific message. It commits
    the message to the data store for further querying.
    Returns {success: True} if successful or {success: False} if an error
    occurred.
    """
    arguments = request.json
    data = None

    with open("json_files/message.json") as json_file:
        data = json.load(json_file)

    found = False
    for i, entry in enumerate(data["messageBoard"]):
        if entry["id"] == arguments["id"]:
            data["messageBoard"][i]["comments"].append(arguments["data"])
            found = True
            break

    if not found:
        return jsonify({"success": False})

    with open("json_files/message.json", "w") as json_file:
        json_file.write(json.dumps(data))
        return jsonify({"success": "true"})


@app.route("/message", methods=["POST"])
def post_message():
    """Adds a new message to the datastore
    Takes in all message parameters as defined in message.json EXCEPT for timestamp,
    id, and comments to form a new message and save it to the datastore.
    Returns {success: True} if successful or {success: False}
    """
    arguments = request.json
    data = None
    with open("json_files/message.json") as json_file:
        data = json.load(json_file)

    # TODO: Add some checking here! It's dangerous
    arguments["timestamp"] = datetime.utcnow().isoformat()
    arguments["id"] = str(uuid.uuid4())
    arguments["comments"] = []
    data["messageBoard"].insert(0, arguments)

    with open("json_files/message.json", "w") as json_file:
        json_file.write(json.dumps(data))
        return jsonify({"success": "true"})

    return jsonify({"success": False})


@app.route("/message", methods=["GET"])
def get_message():
    """Returns all messages that populate the message board.
    When this endpoint is hit it returns all possible messages that are currently
    stored in the data store. This includes their id and comments.
    Returns a chronological list of all messages.
    """
    with open("json_files/message.json") as json_file:
        data = json.load(json_file)
        return jsonify(data["messageBoard"])


@app.route("/modules", methods=["GET"])
def get_modules():
    """Returns all educational modules to be rendered
    Parses content from the backend data store and formats it to be sent to the
    react frontend in order for it to be displayed.
    Returns a modules object containing all content and descriptors for each
    module.
    """
    arguments = request.json
    data = None
    with open("json_files/module.json") as json_file:
        data = json.load(json_file)
        return jsonify(data["modules"])
    # return "Getting Modules"

    with open("json_files/modules.json", "w") as json_file:
        json_file.write(json.dumps(data))


@app.route("/user", methods=["GET", "POST"])
def handle_user():
    """Routes all user operations to their proper area
    Given a request routes the request to where it should be processed
    Returns the result of one of its composition functions
    """
    if request.method == 'POST':
        return add_user(request)
    elif request.method == 'GET':
        return get_user(request)

    return "Handling User"


def add_user(request):
    """Adds a user to the data store
    Takes in a user representation in json as described in people.json, parses
    the data and commits it to the data store.
    returns {success: True} if it was successful or {success: False} if it was not
    """
    arguments = request.json
    data = None
    with open("json_files/people.json", "r") as json_file:
        data = json.load(json_file)
    with open("json_files/people.json", "w") as json_file:
        data["currentStudents"].append(arguments)
        json_file.write(json.dumps(data))
        return jsonify({"success": True})


def get_user(request):
    """Returns a list of all users associated with the datastore
    Reads and parses the datastore to grab current students and compose
    them into an object that can be interpreted by the frontend.
    Returns a list of all users
    """
    arguments = request.json
    with open("json_files/people.json") as json_file:
        data = json.load(json_file)
        return jsonify(data["currentStudents"])


@app.route("/match", methods=["GET", "POST"])
def match_user():
    """Runs a matching algorithm to find the best mentor for a user
    Calculates a naive match between a mentor and a current student in order
    to effectively pair people likely to get along and learn from each other
    Returns a sorted list of mentors to pair with
    """
    args = request.json
    print(args)
    if args is None:
        return {"success": False}

    people_data = None
    with open("json_files/people.json") as json_file:
        people_data = json.load(json_file)

    active_student = query_student(people_data, args)

    if active_student is None:
        active_student = args

    alumni = people_data["alumni"]
    ranked = list()
    comparison_quant_keys = ["age"]
    for a in alumni:
        stat = 0
        for key in comparison_quant_keys:
            init = a[key]
            target = active_student[key]
            if len(init) == 0:
                init = 0
            if len(target) == 0:
                target = 0
            stat += abs(float(init) - float(target))
        ranked.append((a, stat))

    ranked = sorted(ranked, key=lambda x: x[1])
    return jsonify(list(reversed(ranked)))


def query_student(people_data, args):
    """Grabs a specific student from the datastore
    Simply iterates the datastore to find the student
    """
    # TODO: Please make this querying better
    students = people_data["currentStudents"]
    for student in students:
        if student["firstName"] == args["firstName"] and student["lastName"] == args["lastName"]:
            return student


@app.route("/calculateSavings", methods=["GET", "POST"])
def calculateSavings():
    """Calculates math for the savings simulation"""
    args = request.json
    saving = float(args["saving"])
    current = float(args["current"])
    time = float(args["time"]) * 12
    rate = float(args["rate"])

    if rate == 0:
        top = saving - current
        return jsonify(top/time)

    top = saving - (current * ((1+rate)**time))
    bottom = ((1+rate)**time) - (1+rate)

    ans = top/(bottom/rate)
    ans /= 12
    return jsonify(ans)


@app.route("/sentiment", methods=["GET"])
def sentimentAnalysis():
    """Connects to AWS to analyze sentiment of messages in order to effectively present analytics"""
    data_messages = None
    with open("json_files/message.json") as json_file:
        data = json.load(json_file)
        data_messages = data["messageBoard"]

    positive = 0.0
    negative = 0.0
    neutral = 0.0
    comprehend = boto3.client(
        service_name='comprehend', region_name='us-east-1')

    for x in data_messages:
        text = x['message']
        text2 = x['title']

        res = comprehend.detect_sentiment(Text=text, LanguageCode='en')
        res2 = comprehend.detect_sentiment(Text=text2, LanguageCode='en')
        positive += res["SentimentScore"]["Positive"] + \
            res2["SentimentScore"]["Positive"]
        negative += res["SentimentScore"]["Negative"] + \
            res2["SentimentScore"]["Negative"]
        neutral += res["SentimentScore"]["Neutral"] + \
            res2["SentimentScore"]["Neutral"]

    positive /= 2 * len(data_messages)
    negative /= 2 * len(data_messages)
    neutral /= 2 * len(data_messages)
    positive = math.ceil(positive * 100)
    negative = math.ceil(negative * 100)
    neutral = (100 - positive - negative)

    positive_str = str(positive) + "%"
    negative_str = str(negative) + "%"
    neutral_str = str(neutral) + "%"

    return jsonify({
        "positive": positive,
        "negative": negative,
        "neutral": neutral,
        "positive_str": positive_str,
        "negative_str": negative_str,
        "neutral_str": neutral_str
    })


@app.route("/usersCount", methods=["GET"])
def userCount():
    """Returns the count of the number of users using the platform"""
    args = request.json
    data = None
    with open("json_files/people.json", "r") as json_file:
        data = json.load(json_file)
    currStu = data["currentStudents"]
    currAlum = data["alumni"]

    return jsonify(len(currStu) + len(currAlum))


@app.route("/messageCounts", methods=["GET"])
def messageCount():
    """Counts the number of message and returns it"""
    data_messages = None
    with open("json_files/message.json") as json_file:
        data = json.load(json_file)
        data_messages = data["messageBoard"]

    # week array indexs 0-6
    week = [0] * 7
    today = date.today()
    currdate = int(today.strftime("%d"))
    min_date = currdate - 6
    for x in data_messages:
        x_date = int(x["timestamp"][8:10])
        if x_date >= min_date and x_date <= currdate:
            week[x_date % min_date] += 1
    ret = [week, [1, 2, 1, 0, 0, 0, 2]]
    return(jsonify(ret))


@app.route("/predict", methods=["GET", "POST"])
def predict():
    """Built to predict the monetary value that the program has provided"""
    args = request.json
    # data = None
    # with open("json_files/people.json", "r") as json_file:
    #     data = json.load(json_file)
    # currStu = data["currentStudents"][0]

    zipcode = args["zipcode"]
    addr = args["address"]
    r = requests.get('https://api.datafinder.com/v2/qdf.php?k2=' + apikey +
                     '&service=scores&dcfg_scores=WealthScoreNorm,AutoFinanceScoreNorm,NewTechAdopterScoreNorm&d_zip='+zipcode+'&d_fulladdr='+addr)
    # print(r.text)
    data = r.json()["datafinder"]["results"][0]

    wealth = data["WealthScoreNorm"]
    autofinance = data["AutoFinanceScoreNorm"]
    tech = data["NewTechAdopterScoreNorm"]

    return jsonify({
        "wealth": wealth,
        "autofinance": autofinance,
        "tech": tech
    })
