import json

from flask import Flask, render_template, request, redirect, Response, jsonify, url_for, json
import operator
import ast
from itertools import islice
from flask_json import json_response
from flask_cors import CORS, cross_origin
#First of all you have to import it from the flask module:
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/main",methods=["GET"])
def main():
    return jsonify({"notes":"i am testing notes"}),200

if __name__ == "__main__":
    #####TASK 3
    app.run(debug=True)
