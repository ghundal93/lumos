import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//import './FileUpload.js';
import DataSummary from './DataSummary.js';
import DataVisualization from './DataVisualization.js';
import DimReduction from './DimReduction.js';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Correlation from './Correlation';


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
          type = "button" id="data_trimming">
          Data Trimming
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
                <DataSummary />
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
            </Tabs>
          </TabPanel>

          <TabPanel id="tab_panel_data_trimming">
            <Tabs>
                <TabList>
                  <Tab>TODO</Tab>
                </TabList>
            </Tabs>
          </TabPanel>

          <TabPanel id="tab_panel_data_visualisation">
            <DataVisualization/>
          </TabPanel>
          <TabPanel id="tab_panel_data_visualisation">
            <DimReduction/>
          </TabPanel>
        </Tabs>
        </div>
        );
        return mainElement;
    }
}