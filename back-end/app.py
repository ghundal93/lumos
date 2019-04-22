import json

from flask import Flask, render_template, request, redirect, Response, jsonify, url_for, json
import operator
import ast
from itertools import islice
from flask_json import json_response
from flask_cors import CORS, cross_origin
import os
import Data

UPLOAD_FOLDER = "/Users/gags/Documents/Stony/Sme2/Visualisation/CSE564_Project/"
ALLOWED_EXTENSIONS = set(['csv'])
#First of all you have to import it from the flask module:
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/main",methods=["GET"])
def main():
    return jsonify({"notes":"i am testing notes"}),200

@app.route("/upload",methods=["POST"])
def upload():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            # filename = secure_filename(file.filename)
            filename = file.filename
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            data = Data.Data(app.config['UPLOAD_FOLDER'], filename)
            return jsonify({"message":"BLESS YOU!","summary":data.summarize_data(),"corr":data.get_corr_matrix()}),200
        else :
            return jsonify({"message":"NOT A CSV FILE"}),200
    return jsonify({"message":"SUCCESS"}),200

if __name__ == "__main__":
    data = None
    app.run(debug=True)
