import os
import json
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
import numpy as np
from flask import jsonify
from kneed import DataGenerator, KneeLocator
from sklearn.preprocessing import MinMaxScaler

class Data:
    df = None 
    def __init__(self, path,filename):
        self.df = pd.read_csv(os.path.join(path, filename))

    def summarize_data(self):
        #return json.loads(self.df.describe().to_json())
        return self.df.describe().to_json(orient='columns')
        #return self.df.describe().values.tolist()
    
    # def get_corr_matrix(self):
    #     return self.df.corr().values.tolist()

    def get_corr_matrix(self):
        return self.df.corr().to_json(orient='records')
    
    def get_col_names(self):
        return self.df.columns.tolist()
    
    def get_selected_col_data(self,colId):
        return self.df.iloc[:,int(colId)].tolist()

    def performKMeans(self,k):
        Kmean = KMeans(n_clusters=int(k))
        Kmean.fit(self.df)
        Kmean.cluster_centers_
        return "fd"

    def checkNulls(self):
        return self.df.isna().sum().to_json(orient='records')

    '''
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
    '''
    def performPCA(self, nC=5):
        #Code generating data for scree plot
        result_dict, elbow_point = self.draw_scree_plot(self.df, int(nC))
        print("result data: ", result_dict," elbow point : ",elbow_point)
        # scree_data = json.dumps(result_dict, indent=2)

        #Code to get PC1 and PC2 correlation
        PC_data = self.PCA_2_PC_scatter(self.df)
        print("PC_data: ", PC_data)
        # o_df = pd.DataFrame()
        # for i in range(0,2):
        #     o_df["Column_"+str(i)] = PC_data[:,i]

        #Return all data
        #data = {'scree_data'  : result_dict, 'elbow_point':elbow_point, 'PC_data' : PC_data}

        return result_dict, elbow_point, PC_data

    def get_scaled_data(self, data_df):
        minmaxsc = MinMaxScaler()
        minmaxsc.fit(data_df)
        data_scaled = minmaxsc.transform(data_df)
        return data_scaled

    def PCA_2_PC_scatter(self, data_df):
        pca, task_3_a_data_pca = self.perform_PCA(data_df, 2)
        print(task_3_a_data_pca.shape)
        result_dict = {}
        PC1 = list(task_3_a_data_pca[:, 0])
        PC2 = list(task_3_a_data_pca[:, 1])
        for i in range(len(PC1)):
            result_dict[str(PC1[i])] = PC2[i]
        PC_data = json.dumps(result_dict, indent=2)
        return result_dict
        

    def draw_scree_plot(self, data_df, nC):
        data_scaled = self.get_scaled_data(data_df)
        pca_temp, data_temp = self.perform_PCA(data_scaled, nC)
        eigvals = pca_temp.singular_values_
        vals = np.arange(nC)
        """
        plt.figure()
        plt.plot(vals, eigvals, 'ro-', linewidth = 2)
        plt.title('Scree Plot')
        plt.xlabel('Principal Component')
        plt.ylabel('Eigenvalue')
        plt.savefig('scree_plot.png')
        """
        kn = KneeLocator(range(len(vals)), eigvals, curve='convex', direction='decreasing')
        print("Elbow point :  ",kn.knee)
        result_dict = {}
        for i,val in enumerate(eigvals):
            result_dict[str(vals[i])] = val
        return result_dict, kn.knee

    def perform_PCA(self, data_df, pc_count):
        pca = PCA(n_components=pc_count)
        dataset = pca.fit_transform(data_df)
        return pca, dataset



