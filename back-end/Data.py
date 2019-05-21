import os
import json
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
import numpy as np
from flask import jsonify
from kneed import DataGenerator, KneeLocator
from sklearn.preprocessing import MinMaxScaler
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder
from sklearn.manifold import MDS
from sklearn.metrics import pairwise_distances

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

    def checkNulls(self):
        return self.df.isna().sum().to_json(orient='columns')
    
    def getNonNumCols(self):
        return (self.df.select_dtypes(exclude=np.number)).dtypes.to_json(orient="columns")
    
    def get_data_df(self):
        return self.df.to_json(orient = 'records')

    def reduceDimPCA(self, count=5):
        pca, reduced_data = self.perform_PCA(self.df, int(count))
        # print("shape of reduced_data : ",reduced_data.shape," and type : ",type(reduced_data))
        df_dict = {}
        for i in range(int(count)):
            df_dict['PC'+str(i+1)] = reduced_data[:, i]
        pca_df = pd.DataFrame(df_dict)
        # print(pca_df.describe())
        return pca_df

    def performPCA(self, nC=5):
        #Code generating data for scree plot
        result_dict, elbow_point, loadings = self.draw_scree_plot(self.df, int(nC))
        # print("result data: ", result_dict," elbow point : ",elbow_point)

        #Code to get PC1 and PC2 correlation
        PC_data = self.PCA_2_PC_scatter(self.df)

        #Normalizing data
        mean_df = self.df.mean()
        norm_df = self.df - mean_df

        comp_scores = pd.DataFrame(np.matmul(norm_df.values, loadings.T.values))

        # print("PC_data: ", PC_data)

        return result_dict, elbow_point, PC_data, loadings.to_json(orient='columns'), comp_scores.to_json(orient='columns')

    def get_scaled_data(self, data_df):
        minmaxsc = MinMaxScaler()
        minmaxsc.fit(data_df)
        data_scaled = minmaxsc.transform(data_df)
        return data_scaled

    def PCA_2_PC_scatter(self, data_df):
        pca, task_3_a_data_pca = self.perform_PCA(data_df, 2)
        # print(task_3_a_data_pca.shape)
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

        #Get Loadings
        loadings = pca_temp.components_.T * np.sqrt(pca_temp.explained_variance_)
        print(loadings.shape)

        loadings_dict = {}
        for i in range(loadings.shape[0]):
            loadings_dict[i] = list(map(float, loadings[i]))
        
        loadings_result = pd.DataFrame.from_dict(loadings_dict)
        #Get elbow point
        eigvals = pca_temp.singular_values_
        vals = np.arange(nC)
        kn = KneeLocator(range(len(vals)), eigvals, curve='convex', direction='decreasing')
        
        result_dict = {}
        for i,val in enumerate(eigvals):
            result_dict[str(vals[i])] = val
        
        
        return result_dict, kn.knee, loadings_result

    def perform_PCA(self, data_df, pc_count):
        pca = PCA(n_components=pc_count)
        dataset = pca.fit_transform(data_df)

        return pca, dataset

    def reduceDimMDS(self, matrix='euclidean', comp=2):
        dissimilarity = matrix
        embeddings = pd.DataFrame()
        data_df = self.df
        if matrix == 'correlation':
            corr_df = pairwise_distances(self.df, metric=matrix)
            data_df = corr_df
            dissimilarity = 'precomputed'
        embeddings = MDS(n_components=int(comp), dissimilarity=dissimilarity)
        data_transformed  = embeddings.fit_transform(data_df)
        print("shape of reduced_data : ",data_transformed.shape," and type : ",type(data_transformed))
        df_dict = {}
        for i in range(int(comp)):
            df_dict['MDS'+str(i+1)] = data_transformed[:, i]
        mds_df = pd.DataFrame(df_dict)
        print(mds_df.describe())
        return mds_df
    
    def performKMeans(self, k):
        self.df = self.df[self.df.notnull()]
        data_2D = PCA(n_components=2).fit(self.df).transform(self.df)
        kmeans = KMeans(n_clusters=int(k), random_state=111)
        kmeans.fit(self.df)
        result_dict_pca = {}
        label_list = list(map(int, kmeans.labels_))
        for i in range(data_2D.shape[0]):
            result_dict_pca[float(data_2D[i, 0])] = float(data_2D[i,1])
        pca_label_dict = {}
        for i in range(data_2D.shape[0]):
            pca_label_dict[float(data_2D[i, 0])] = label_list[i]
        
        #MDS data reduction
        embedding_euc = MDS(n_components=2, dissimilarity='euclidean')
        data_transformed_euc  = embedding_euc.fit_transform(self.df)
        #print("resultant rows in MDS reduced data", data_transformed_euc.shape[0])
        result_dict_euc = {}
        for i in range(data_transformed_euc.shape[0]):
            result_dict_euc[float(data_transformed_euc[i, 0])] = float(data_transformed_euc[i,1])
        mds_euc_label_dict = {}
        for i in range(data_transformed_euc.shape[0]):
            mds_euc_label_dict[float(data_transformed_euc[i, 0])] = label_list[i]

        corr_df = pairwise_distances(self.df, metric='correlation')
        embedding_corr = MDS(n_components=2, dissimilarity='precomputed')
        data_transformed_corr  = embedding_corr.fit_transform(corr_df)
        result_dict_corr = {}
        for i in range(data_transformed_corr.shape[0]):
            result_dict_corr[float(data_transformed_corr[i, 0])] = float(data_transformed_corr[i,1])
        mds_corr_label_dict = {}
        for i in range(data_transformed_corr.shape[0]):
            mds_corr_label_dict[float(data_transformed_corr[i, 0])] = label_list[i]
        
        return result_dict_pca , pca_label_dict, result_dict_euc, mds_euc_label_dict, result_dict_corr, mds_corr_label_dict
    
    def kmeans_screePlot(self):
        dist = []
        K = range(2, 26)
        
        for k in K:
            k_mean = KMeans(n_clusters = k).fit(self.df)
            #print("for k",k, " inertia ",k_mean.inertia_)
            dist.append(k_mean.inertia_)

        kn = KneeLocator(K, dist, curve='convex', direction='decreasing')

        result_dict = {}
        for i in K:
            result_dict[i] = dist[i-2]

        return result_dict, kn.knee
    
    def removeNonNumCols(self,cols,path):
        print("COLS,",cols)
        le = LabelEncoder()
        cols = cols.replace("\"","")
        cat_cols = cols.strip("[]").split(",")
        print("CAT_COLS",cat_cols)
        for col in cat_cols:
            self.df[col] = le.fit_transform(self.df[col])
        # self.df[cat_cols] = self.df[cat_cols].apply(lambda col: le.fit_transform(col))
        os.remove(path)
        self.df.to_csv(path)
        return "SUCCESS"
    
    def remove_rows(self, colName, custom_val):
        print("called remove rows")
        df = self.df.dropna(subset=[colName])
        return df
    
    def custom_value(self, colName, custom_val):
        print("called custom val")
        return self.df.fillna({colName : custom_val})
    
    def average(self, colName, custom_val):
        print("called average")
        return self.df.fillna({colName : self.df.mean()[colName]})

    
    def median(self, colName, custom_val):
        print("called median")
        return self.df.fillna({colName : self.df.median()[colName]})

    switcher = { "RemoveRows" : remove_rows,
                     "CustomValue" : custom_value,
                     "Average" : average,
                     "Median" : median}

    def trimNulls(self, option, colName, custom_val=0):
        func = self.switcher.get(option, lambda : "Invalid option")
        return func(self, colName, custom_val)
    
