import json

app = Flask(__name__)
CORS(app)

@app.route("/", methods = ["GET"])
def home():
    return "Hello World"
