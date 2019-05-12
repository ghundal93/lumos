import React, { Component } from 'react';
import axios from 'axios';
import "react-tabs/style/react-tabs.css";
import './DataSummary.css'

export default class DataSummary extends Component{

    constructor(props) {
        super(props);
        this.state = {
            summary : [],
            columns :[],
            sum_nom_numeric:[],
            selected_non_num_cols:new Set([]),
            isUpdateNeeded:false
        }
        this.onCheckBoxChange = this.onCheckBoxChange.bind(this)
        this.onConvertColsClicked = this.onConvertColsClicked.bind(this)
        this.forceRender = this.forceRender.bind(this)
        this.getNonNumCols = this.getNonNumCols.bind(this)
        this.getSummary = this.getSummary.bind(this)
        this.getColumnNames = this.getColumnNames.bind(this)
        this.getSummary()
        this.getColumnNames()
        this.getNonNumCols()
      }

      // componentDidMount(){
      //   this.getSummary()
      //   this.getColumnNames()
      //   this.getNonNumCols()
      // }

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

      getNonNumCols(){
        console.log("Making network call")
        fetch("http://127.0.0.1:5000/getNonNumCols")
        .then(data => data.json())
        .then(res => this.setState({ sum_nom_numeric:JSON.parse(res.non_numeric)}));        
      }

      onCheckBoxChange(e){
        console.log("CHeckbox clicked")
        var oldState = this.state.selected_non_num_cols
        console.log("oldState",oldState)
        if(e.target.checked){
          oldState.add(e.target.value)
        }
        else{
          oldState.delete(e.target.value)
        }
        console.log("new State,",oldState)
        this.setState({selected_non_num_cols:oldState})
      }

      onConvertColsClicked(e){
        e.preventDefault();
        console.log("STATE,",this.state.selected_non_num_cols)
        if(this.state.selected_non_num_cols.size == 0){
          window.alert("Please select atleast one column to convert")
        }
        else if(window.confirm("These changes are permamnent")){
          const data = {}
          
          data["cols"] = JSON.stringify(Array.from(this.state.selected_non_num_cols))
          console.log("DATA",data)
          axios.post('http://localhost:5000/convertCols', data)
            .then(this.forceRender)
            .catch(function (error) {
              console.log(error);
            });   
        }     
      }

      forceRender(){
        console.log("Updating Non NUm Columns")
        this.getNonNumCols()
        this.getSummary()
        this.getColumnNames()
      }

      render(){
          const summary = this.state.summary;
          const sum_nom_numeric = this.state.sum_nom_numeric
          // console.log("SUMMARY:",summary);
          const first_row = this.state.summary[this.state.columns[0]]
          // console.log("First row:",first_row);
          var arr = {}
          for(var key in first_row){
            if (first_row.hasOwnProperty(key)) {
                arr[key] = "1";
            }
          }
          const func = this.onCheckBoxChange
          // console.log("NonNUM:",this.state.sum_nom_numeric)
          var nn = <div><label>No Non Numerical Column present</label></div>
          var isNonNumPresent = false
          if(Object.keys(sum_nom_numeric).length >0){
            isNonNumPresent = true
            var rows = []
            Object.keys(sum_nom_numeric).map(
              function(key){
                return(
                  rows.push(<tr>
                    <td>{key}</td>
                    <td>{sum_nom_numeric[key]["name"]}</td>
                    <td><input type ="checkbox" key={key} value={key} id={key} onClick={func}></input></td>
                  </tr>)
                )
              }
            )
           // nn.push(<table><tbody><tr><th>Columns</th><th>Type</th></tr>)
           nn = <div>
             <div><table><tbody></tbody><tr><td>Columns</td><td>Type</td><td>Choose Column to Convert</td></tr>{rows}</table></div>
             <div><button onClick={this.onConvertColsClicked}>Convert Columns</button></div>
             </div>
          }
          return(  
            <div className="display-flex">
              <div className="row-left">
                <div>
                      <table>
                        <tbody>
                          <tr className = "even">
                          <th>Columns</th>
                          {
                            Object.keys(arr).map(
                                function(key,i){
                                return  ((i%2 == 0)?<th>{key}</th> : <th>{key}</th>)
                                }
                              )
                          }   
                          </tr>
                      {
                      Object.keys(summary).map(
                          function(key,i){
                          return (
                                <tr>
                                  <td className = "even">{key}</td>
                                  {
                                  Object.keys(summary[key]).map(
                                      function(k,i){
                                        return  ((i%2 == 0)?<td>{summary[key][k]}</td> : <td>{summary[key][k]}</td>)
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
                <div>
                    {nn}
                  </div>
              </div>
            </div>
          )
          
      }
}