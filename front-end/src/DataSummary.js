import React, { Component } from 'react';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Dashboard from './Dashboard';
import ReactTable from "react-table";
import "react-table/react-table.css";

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
        this.getSummary()
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
          const summry = this.state.summary;
          var colNames = this.getColNames();
          console.log(colNames);
          //const colNames = Object.values(summary)[0];
          /*
          
          cons rowNames = ['25%', '50%']
          const rowVals = 
          console.log(summary);

          const cols = [
            {
              Header: "Column",
              accessor: Object.keys(summary),
            }
            ];
            Object.keys(summary).map(
              function(key){
              Object.keys(summary[key]).map(
              function(k){
                cols.push({
                  Header: k.toString(),
                  accessor: d => d.k
                });
              }
              )
            })
          console.log(cols);
          return (<div>
            Hello
          </div>
          );
          
*/
         
          return(
            <div>
              <table>
                <tr>
                  <th>
                    {colNames}
                  </th>
                </tr>
              </table>
            </div>
          );
          /*
          return(
            <div>
                <div style={{float:'left',width: 50 + '%',height:100 +"vh",overflow:'scroll'}}>
                    <h2> Data Stats </h2>
                    
                    <p>{this.state.resMessage}</p>
                    {
                    Object.keys(summary).map(
                        function(key){
                        return (
                            <div>
                            <label>{key}</label>
                            <table>
                            <tr>
                              {for()}
                            </tr>
                            <tbody>
                                {
                                Object.keys(summary[key]).map(
                                    function(k){
                                    return(
                                        <tr>
                                        <td>{k}</td>
                                        <td key = {key.toString()+"_"+k.toString()}>{summary[key][k]}</td>
                                        <br></br>
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
                    )
                    */}
}