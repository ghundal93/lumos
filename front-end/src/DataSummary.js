import React, { Component } from 'react';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Dashboard from './Dashboard';

export default class DataSummary extends Component{

    constructor(props) {
        super(props);
        // this.uploadInput = React.createRef();
        this.state = {
            summary : [],
            cols:[]
        }
        this.getColNames = this.getColNames.bind(this);
      }

      componentDidMount(){
        //this.getSummary()
        this.getColumns()
      }

      getSummary(){
        fetch("http://127.0.0.1:5000/getSummary")
        .then(data => data.json())
        .then(res => this.setState({ summary:JSON.parse(res.summary)}));        
      }

      getColumns(){
        fetch("http://127.0.0.1:5000/getColNames")
        .then(data => data.json())
        .then(res => this.setState({ cols:res.col_names}));          
      }

      getColNames(){
        const summ = this.state.summary;
        var cols = [];
        cols.push(Object.keys(JSON.parse(Object.values(summ)[0])));
        return cols;
      }

      render(){
          return (
              <div>

              </div>
          )
          }
}