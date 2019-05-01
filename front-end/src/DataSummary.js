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

      render(){
          const summary = this.state.summary
          console.log("SUMMARY:",summary)
          const col_names = this.state.cols
          console.log("COLNAMES", col_names)
          return(
            <div>
                <div style={{float:'left',width: 50 + '%',height:100 +"vh",overflow:'scroll'}}>
                    <p>Response from server:</p>
                    <p>{this.state.resMessage}</p>
                    {/* <p>Corr:{this.state.corr}</p> */}
                    {/*
                    Object.keys(summary).map(
                        function(key){
                        return (
                            <div>
                            <label>{key}</label>
                            <table>
                            <tbody>
                                {
                                Object.keys(summary[key]).map(
                                    function(k){
                                    return(
                                        <tr>
                                        <td>{k}</td>
                                        <td key = {key.toString()+"_"+k.toString()}>{summary[key][k]}</td>
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
                <div>
                    <table>
                        <tbody>
                            {
                            Object.keys(col_names).map(
                                function(key){
                                    console.log("new key",col_names[key])
                                    console.log("new object",summary[col_names[key]])
                                    const newObj = summary[col_names[key]]
                                    //console.log("new object parsed",newObj)
                                    return (
                                        <tr>
                                            {
                                                Object.keys(newObj).map(
                                                function(k){
                                                return(
                                                    <td key = {key.toString()+"_"+k.toString()}>{summary[col_names[key]][k]}</td>
                                                )
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
                {

                }
                </div>
            </div>
          )
      }
}