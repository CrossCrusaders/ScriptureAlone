from flask import Flask

app = Flask(__name__)

@app.route("/")
def index():
    return "Index"

# TODO: Convert this into a blueprint once at a usable state