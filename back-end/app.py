import json
from flask import Flask, render_template, request, redirect, Response, jsonify, url_for, json
import operator
import ast
from itertools import islice
from flask_json import json_response
from flask_cors import CORS, cross_origin
import os
import Data
import pandas as pd
import numpy as np
from flask import send_file

UPLOAD_FOLDER = os.getcwd()+"/Uploaded_data/"
DOWNLOAD_FOLDER = os.getcwd()+"/Transformed_data"
UPLOADED_FILE_NAME = "data.csv"
ALLOWED_EXTENSIONS = set(['csv'])
#First of all you have to import it from the flask module:
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['FILE_NAME'] = UPLOADED_FILE_NAME
app.config['MAIN_DATA'] = UPLOAD_FOLDER+UPLOADED_FILE_NAME
app.config['PCA_DATA'] = DOWNLOAD_FOLDER+"/pca_data.csv"
app.config['MDS_DATA'] = DOWNLOAD_FOLDER+"/mds_data.csv"

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
            path = os.path.join(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] )
            if(os.path.isfile(path)):
                os.remove(path)
            file.save(path)
            data = Data.Data(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] )
            return jsonify({"message":"BLESS YOU!","summary":data.summarize_data(),"corr":data.get_corr_matrix()}),200
        else :
            return jsonify({"message":"NOT A CSV FILE"}),200
    return jsonify({"message":"SUCCESS"}),200

@app.route("/getSummary",methods=["GET"])
def getSummary():
    data = Data.Data(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] )
    return jsonify({"summary":data.summarize_data()}),200

@app.route("/getNonNumCols",methods=["GET"])
def getNonNumCols():
    data = Data.Data(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] )
    return jsonify({"non_numeric":data.getNonNumCols()}),200

@app.route("/getCorr",methods=["GET"])
def getCorr():
    data = Data.Data(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] )
    return jsonify({"corr":data.get_corr_matrix()}),200

@app.route("/getFileData", methods=["GET"])
def getFileData() :
    path = request.args['path']
    return (send_file(path))

@app.route("/getDataDf", methods=["GET"])
def getDataDf() :
    data = Data.Data(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] )
    data_df = data.get_data_df()
    #print(data_df)
    return jsonify({"data_df": data_df}),200

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
    result_dict_pca , pca_label_dict, data_transformed_euc, mds_euc_label_dict, data_transformed_corr, mds_corr_label_dict = data.performKMeans(k)
    return jsonify({"pca_data":result_dict_pca, 
                    'labels_dict':pca_label_dict, 
                    "mds_euc_data":data_transformed_euc,
                    "mds_euc_labels_dict" : mds_euc_label_dict,
                    "mds_corr_data" : data_transformed_corr,
                    "mds_corr_labels_dict" : mds_corr_label_dict}),200

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
    var_data, elbow_point, PCA_corr, loadings, comp_score = data.performPCA(nC)
    return jsonify({"var_data":var_data,"elbow_point":elbow_point, "pca_corr_data":PCA_corr, "loadings_data":loadings, "comp_score":comp_score}),200

@app.route("/reduceDataDimPCA", methods=["GET"])
def reduceDataDimPCA():
    data = Data.Data(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] )
    count  = request.args['count']
    reduced_data = data.reduceDimPCA(count)
    reduced_data.to_csv(app.config['PCA_DATA'])

    return jsonify({"reduced_data_path" : app.config['PCA_DATA']}),200

@app.route("/reduceDataDimMDS", methods=["GET"])
def reduceDataDimMDS() :
    data = Data.Data(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] )
    matrix = request.args['matrix']
    comp = request.args['count']
    reduced_data = data.reduceDimMDS(matrix, comp)
    reduced_data.to_csv(app.config['MDS_DATA'])
    return jsonify({"reduced_data_path" : app.config['MDS_DATA']}),200

@app.route("/checkNulls", methods=["GET"])
def checkNulls():
    data = Data.Data(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] )
    df = data.checkNulls()
    return jsonify({"null_data":df}),200

@app.route("/trimNulls", methods=["GET"])
def trimNulls():
    data = Data.Data(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] )
    option = request.args['option']
    colName = request.args['colName']
    custom_val = 0
    if request.args.get('customVal') is not None:
        custom_val = float(request.args['customVal'])
    mod_data = data.trimNulls(option, colName, custom_val)
    os.remove(app.config['MAIN_DATA'])
    mod_data.to_csv(app.config['MAIN_DATA'], index=False)
    return jsonify({"messgae" : "successful"}),200

@app.route("/convertCols", methods=["POST"])
def convertCols():
    r_data = request.get_json()
    print("COLS",r_data["cols"])
    data = Data.Data(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] )
    return jsonify({"message":data.removeNonNumCols(r_data["cols"],os.path.join(app.config['UPLOAD_FOLDER'], app.config['FILE_NAME'] ))}),200   

if __name__ == "__main__":
    data = None
    app.run(debug=True)
