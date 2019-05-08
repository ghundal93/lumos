import React, { Component } from 'react';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Dashboard from './Dashboard';

//import ReactTable from "react-table";
//import "react-table/react-table.css";

import { Series, DataFrame } from 'pandas-js';
import './App.css'

export default class DataSummary extends Component{

    constructor(props) {
        super(props);
        // this.uploadInput = React.createRef();
        this.state = {
            summary : [],
            columns :[]
        }
      }

      componentDidMount(){
        this.getSummary()
        this.getColumnNames();
      }

      getSummary(){
        fetch("http://127.0.0.1:5000/getSummary")
        .then(data => data.json())
        .then(res => this.setState({ summary:JSON.parse(res.summary)}));        
      }


      getColumnNames(){
        fetch("http://127.0.0.1:5000/getColNames")
        .then(data => data.json())
        .then(res => this.setState({ columns:res.col_names}));   
      }

      render(){
          const summary = this.state.summary;
          console.log("SUMMARY:",summary);
          const first_row = this.state.summary[this.state.columns[0]]
          console.log("First row:",first_row);
          var arr = {}
          for(var key in first_row){
            if (first_row.hasOwnProperty(key)) {
                arr[key] = "1";
            }
          }
          return(  
            <div>
                    <table>
                      <tbody>
                        <tr>
                        <th className = "even">Columns</th>
                        {
                          Object.keys(arr).map(
                              function(key,i){
                               return  ((i%2 == 0)?<th className="odd">{key}</th> : <th className="even">{key}</th>)
                              }
                            )
                        }   
                        </tr>
                    {
                    Object.keys(summary).map(
                        function(key){
                        return (
                              <tr>
                                <td className = "even">{key}</td>
                                {
                                Object.keys(summary[key]).map(
                                    function(k,i){
                                      return  ((i%2 == 0)?<td className="odd">{summary[key][k]}</td> : <td className="even">{summary[key][k]}</td>)
                                    }
                                )
                                }
                            
                            </tr>
                        )
                        }
                    )
                }
                </tbody>
                </table>
            </div>
          )
          
      }
}