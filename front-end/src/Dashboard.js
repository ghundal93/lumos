import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//import './FileUpload.js';
import DataSummary from './DataSummary.js';
import DataVisualization from './DataVisualization.js';
import PCADimReduction from './PCADimReduction.js';
import MDSDimReduction from './MDSDimReduction.js';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Correlation from './Correlation';
import DataCleaningNulls from './DataCleaningNulls';
import ClusterScreePlot from './ClusterScreePlot';
import ClusterVisualisation from './ClusterVisualisation'; 


export default class Dashboard extends Component{


    render(){
        const mainElement = (
            <div>
        <Tabs  defaultIndex={0}
        id='main_tasks'>

        <TabList>
          <Tab
          type = "button" id="data_summary">
          Data Summary
          </Tab>

          <Tab
          type = "button" id = "data_cleaning">
          Data Cleaning
          </Tab>

          <Tab
          type = "button" id="data_clustering">
          Data Clustering
          </Tab>

          <Tab
          type = "button" 
          id = "VISUALIZE"
          >
          Visualise
          </Tab>

          <Tab
          type = "button" 
          id = "dim_reduction">
          Dimension Reduction
          </Tab>
        </TabList>

          <TabPanel id="tab_panel_data_summary_titles">
            <Tabs forceRenderTabPanel>
              <TabList class="sub_tabs">
                <Tab>
                    Data Summary
                </Tab>
                <Tab>Correlations</Tab>
              </TabList>
              <TabPanel id="tab_panel_datasummary">
                <DataSummary/>
              </TabPanel>
              <TabPanel id = "tab_panel_correlations">
                <Correlation/>
              </TabPanel>
            </Tabs>
          </TabPanel>
          
          
          
          <TabPanel id="tab_panel_data_cleaning">
            <Tabs>
                <TabList>
                  <Tab>Null Vals</Tab>
                  <Tab>outLiers</Tab>
                </TabList>
                <TabPanel id="tab_panel_data_cleaning_null">
                <DataCleaningNulls />
              </TabPanel>
            </Tabs>
          </TabPanel>

          <TabPanel id="tab_panel_data_clustering">
          <Tabs forceRenderTabPanel>
            <TabList>
                    <Tab> Scree Plot </Tab>
                    <Tab> Clusterise </Tab>
            </TabList>
            <TabPanel id="tab_panel_cluster_screeplot">
            <ClusterScreePlot />
            </TabPanel>
            <TabPanel id="tab_panel_clusterise">
            <ClusterVisualisation />
            </TabPanel>
          </Tabs>
          </TabPanel>

          <TabPanel id="tab_panel_data_visualisation">
            <DataVisualization/>
          </TabPanel>


          <TabPanel id="tab_panel_dim_reduction">
          <Tabs forceRenderTabPanel>
            <TabList>
                <Tab> MDS </Tab>
                <Tab> PCA </Tab>
            </TabList>
            <TabPanel id="tab_panel_mds">
              <MDSDimReduction/>
            </TabPanel>
            <TabPanel id="tab_panel_pca">
              <PCADimReduction/>
            </TabPanel>
          </Tabs>
          </TabPanel>
        
        </Tabs>
        </div>
        );
        return mainElement;
    }
}