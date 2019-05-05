import json

from flask import Flask, render_template, request, redirect, Response, jsonify, url_for, json
import operator
import ast
from itertools import islice
from flask_json import json_response
from flask_cors import CORS, cross_origin
import os
import Data

UPLOAD_FOLDER = os.getcwd()+"/Uploaded_data/"
UPLOADED_FILE_NAME = "data.csv"
ALLOWED_EXTENSIONS = set(['csv'])
#First of all you have to import it from the flask module:
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['FILE_NAME'] = UPLOADED_FILE_NAME

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
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] ))
            data = Data.Data(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] )
            return jsonify({"message":"BLESS YOU!","summary":data.summarize_data(),"corr":data.get_corr_matrix()}),200
        else :
            return jsonify({"message":"NOT A CSV FILE"}),200
    return jsonify({"message":"SUCCESS"}),200

@app.route("/getSummary",methods=["GET"])
def getSummary():
    data = Data.Data(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] )
    return jsonify({"summary":data.summarize_data()}),200

@app.route("/getCorr",methods=["GET"])
def getCorr():
    data = Data.Data(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] )
    return jsonify({"corr":data.get_corr_matrix()}),200

@app.route("/getColNames",methods=["GET"])
def getColNames():
    data = Data.Data(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] )
    return jsonify({"col_names":data.get_col_names()}),200

@app.route("/getSelectedColumnData",methods=["GET"])
def getSelectedColumnData():
    data = Data.Data(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] )
    colId = request.args['colId']
    return jsonify({"selected_data":data.get_selected_col_data(colId)}),200

@app.route("/performKMeans", methods=["GET"])
def performKMeans():
    data = Data.Data(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] )
    k  = request.args['count']
    print("k is ",k)
    result_dict_1, result_dict_2 = data.performKMeans(k)
    return jsonify({"pca_data":result_dict_1, 'labels_dict':result_dict_2}),200

@app.route("/kmeansScreeplot", methods=["GET"])
def kmeansScreeplot():
    data = Data.Data(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] )
    result_dict, elbow_point  = data.kmeans_screePlot()
    # print("Elbow point for clustering : ",elbow_point)
    # print("clustering scree plot data : ",result_dict)
    return jsonify({'result_dict':result_dict, 'elbow_point':elbow_point}),200

@app.route("/performPCA", methods=["GET"])
def performPCA():
    data = Data.Data(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] )
    nC  = request.args['nC']
    pca_data, elbow_point, PCA_corr = data.performPCA(nC)
    return jsonify({"pca_data":pca_data,"elbow_point":elbow_point, "loading_data":PCA_corr}),200


@app.route("/checkNulls", methods=["GET"])
def checkNulls():
    data = Data.Data(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] )
    return jsonify({"null_data":data.checkNulls()}),200    

if __name__ == "__main__":
    data = None
    app.run(debug=True)
