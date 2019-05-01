import React, { Component } from 'react';

export default class DataCleaningNulls extends Component{
    constructor(props) {
        super(props);
        // this.uploadInput = React.createRef();
        this.state = {
            null_data : [],
            cols: []
        }
        this.checkNulls = this.checkNulls.bind(this);
      }

      componentDidMount(){
        //this.getSummary()
        this.checkNulls()
        this.getColNames()
      }

      checkNulls(){
        fetch("http://127.0.0.1:5000/checkNulls")
        .then(data => data.json())
        .then(res => this.setState({ null_data:JSON.parse(res.null_data)}));        
      }

      getColNames(){
        fetch("http://127.0.0.1:5000/getColNames")
        .then(data => data.json())
        .then(res => this.setState({ cols:res.col_names}));          
      }

      render(){
          console.log("null info",this.state.null_data)
          console.log("col info",this.state.cols)
          const data = this.state.null_data;
          const cols = this.state.cols;
          return(
              <div>
                  <table>
                      <tbody>
                          <tr className = "header">
                              <td>Column Name</td>
                              <td>Null Count</td>
                          </tr>
                          {
                              Object.keys(data).map(
                                  function(key,i){
                                      if(i%2 == 0){
                                        return (
                                        <tr className ="even">
                                            <td>{cols[key]}</td>
                                            <td>{data[key].toString()}</td>
                                        </tr>
                                        )
                                      }
                                      else{
                                        return (
                                            <tr className ="odd">
                                                <td>{cols[key]}</td>
                                                <td>{data[key].toString()}</td>
                                            </tr>
                                        )
                                      }
                                  }
                              )
                          }
                      </tbody>
                    </table>
              </div>
          )
      }
}