import React, { Component } from 'react';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Dashboard from './Dashboard';

//import ReactTable from "react-table";
//import "react-table/react-table.css";

import { Series, DataFrame } from 'pandas-js';
import './DataSummary.css'

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
        .then(res => this.setState({ summary:res.summary}));        
      }


      getColumnNames(){
        fetch("http://127.0.0.1:5000/getColNames")
        .then(data => data.json())
        .then(res => this.setState({ columns:res.col_names}));   
      }

      render(){
          const summary = this.state.summary;
          var Series = require('pandas-js').Series;
          var DataFrame = require('pandas-js').DataFrame;
          var rowNames = this.state.columns;

          const df = new DataFrame(Object.values(summary));
          console.log(df.toString());
          var vals = df.toString().split('\n');
          var trs = [];
          for (var i = 0; i < vals.length; i++) {
              if(i != 1){
              var temp = vals[i].split("\|");
              if (i == 0)
                temp[0] = "Column Name";
              else
                temp[0] = rowNames[i-2];

              var tds = [];
              for(var j = 0; j < temp.length; j++){
                  tds.push(<td>{temp[j]}</td>);
              }
              if(i == 0)
                trs.push(<tr  className="header">{tds}</tr>);
              else if(i%2 == 0)
                trs.push(<tr className="even">{tds}</tr>);
              else
                trs.push(<tr className="odd">{tds}</tr>);
              }
          }
          
          return(
            <div>
              <table>
                <tr>
                  {trs}
                </tr>
              </table>
            </div>
          )
          /*
          return(
             
            <div>
                <div style={{float:'left',width: 50 + '%',height:100 +"vh",overflow:'scroll'}}>
                    <h2> Data Stats </h2>
                    
                    <p>{this.state.resMessage}</p>
                    <table>
                    {
                    Object.keys(summary).map(
                        function(key){
                        return (
                            <div>
                            <label>{key}</label>
                 
                              <tr>
                                {
                                Object.keys(summary[key]).map(
                                    function(k){
                                    return(
                                      <tbody>
                                        <td>{k}</td>
                                        <td key = {key.toString()+"_"+k.toString()}>{summary[key][k]}</td>
                                        </tbody>
                                        )

                                    }
                                )
                                }
                            
                            </tr>
                   
                            </div>
                        )
                        }
                    )
                }
                </table>
                </div>
            </div>
          )
          */
      }
}