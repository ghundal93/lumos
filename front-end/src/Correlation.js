import React, { Component } from 'react';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Dashboard from './Dashboard';

export default class Correlation extends Component{

    constructor(props) {
        super(props);
        // this.uploadInput = React.createRef();
        this.state = {
            //summary : [],
            corr :[]
        }
      }
      componentDidMount(){
        this.getSummary()
      }

      getSummary(){
        fetch("http://127.0.0.1:5000/getSummary")
        .then(data => data.json())
        .then(res => this.setState({ summary:res.summary,corr:res.corr }));        
      }

      render(){
        
          const summary = this.state.summary
          const corr = this.state.corr
          console.log(corr)
          console.log(typeof(corr))
          var ary2D = []
          Object.keys(corr).map(function (key) {
            ary2D.push([corr[key]])
          });
          console.log(ary2D);
          console.log(typeof(ary2D));
          return(
            <div>
                <div>
              <p>Correlation Table</p>
              {
                <table>
                  <tbody>
                  {  
                    corr.map( row => <tr>{
                      row.map(elem => <td>{elem}</td>)
                    }</tr>)
                  }
                  </tbody>
                </table>
              }
            </div>
            
            </div>
          )
      }
}