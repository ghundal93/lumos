import React, { Component } from 'react';
import axios from 'axios';

export default class DataSummary extends Component{

    constructor(props) {
        super(props);
        // this.uploadInput = React.createRef();
        this.state = {
            summary : [],
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
          return(
            <div>
                <div style={{float:'left',width: 50 + '%',height:100 +"vh",overflow:'scroll'}}>
                    <p>Response from server:</p>
                    <p>{this.state.resMessage}</p>
                    {/* <p>Corr:{this.state.corr}</p> */}
                    {
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
                }
                </div>
                <div style={{float:'right',width: 50 + '%',overflow:'scroll',height:100 +'vh'}}>
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