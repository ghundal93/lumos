import React, { Component } from 'react';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Dashboard from './Dashboard';
import Container from "./Container";

export default class Correlation extends Component{

    constructor(props) {
        super(props);
        // this.uploadInput = React.createRef();
        this.state = {
            //summary : [],
            corr :[],
            columns : []
        }
      }
      componentDidMount(){
        this.getSummary()
        this.getColumnNames();
      }

      getSummary(){
        fetch("http://127.0.0.1:5000/getSummary")
        .then(data => data.json())
        .then(res => this.setState({ summary:res.summary,corr:JSON.parse(res.corr) }));        
      }

      getColumnNames(){
        fetch("http://127.0.0.1:5000/getColNames")
        .then(data => data.json())
        .then(res => this.setState({ columns:res.col_names}));   
      }

      render(){
        
          const summary = this.state.summary;
          const corr = this.state.corr;
          console.log("BAHAR:",corr)
          return(
            <div>
                <p>Correlation Table</p>
                <div className="legend"  ></div>
                <div className="canvas" >
                <Container chartType="corr" colNames={this.state.columns} varData={this.state.corr}></Container>
                </div>
            </div>

          );
      }
}