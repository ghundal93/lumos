import os
import json
import pandas as pd


class Data:
    df = None 
    def __init__(self, path,filename):
        self.df = pd.read_csv(os.path.join(path, filename))

    def summarize_data(self):
        return json.loads(self.df.describe().to_json())
    
    def get_corr_matrix(self):
        return self.df.corr().values.tolist()
