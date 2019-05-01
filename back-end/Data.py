import os
import json
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
import numpy as np
from flask import jsonify

class Data:
    df = None 
    def __init__(self, path,filename):
        self.df = pd.read_csv(os.path.join(path, filename))

    def summarize_data(self):
        #return json.loads(self.df.describe().to_json())
        return self.df.describe().to_json(orient='columns')
        #return self.df.describe().values.tolist()
    
    def get_corr_matrix(self):
        return self.df.corr().values.tolist()
    
    def get_col_names(self):
        return self.df.columns.tolist()
    
    def get_selected_col_data(self,colId):
        return self.df.iloc[:,int(colId)].tolist()

    # def performKMeans(self,k):
    #     Kmean = KMeans(n_clusters=int(k))
    #     Kmean.fit(self.df)
    #     Kmean.cluster_centers_

    def performPCA(self,nC):
        dim_reduced_data = PCA(n_components=int(nC)).fit_transform(self.df)
        o_data = {}
        o_df = pd.DataFrame()
        for i in range(0,2):
            o_df["Column_"+str(i)] = dim_reduced_data[:,i]
        o_data["pca_data"] = o_df.to_json(orient='records')
        pca = PCA(n_components=int(nC)).fit(self.df)
        loadings = pca.components_.T * np.sqrt(pca.explained_variance_)
        # print(loadings.shape)
        significance = np.sum(np.square(loadings), axis=1)
        # print(significance)
        dict_data = {v : i for v,i in enumerate(significance)}
        dict_data = json.dumps(dict_data)
        o_data['loading_data'] = dict_data
        return o_df.to_json(orient='records'),dict_data



