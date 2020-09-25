from flask import Flask, g, render_template, jsonify, request
from flask_restful import Resource, Api
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route("/", methods = ["GET"])
def home():
    return "Hello World"
