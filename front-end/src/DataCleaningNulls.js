import React, { Component } from 'react';

export default class DataCleaningNulls extends Component{
    constructor(props) {
        super(props);
        this.state = {
            null_data : [],
            cols: [],
            trimOption : "-- Select an option --",
            customValue: 0
        };
        this.performTrim = this.performTrim.bind(this);
        this.checkNulls = this.checkNulls.bind(this);
        this.handleCustomValChange = this.handleCustomValChange.bind(this);
      }

      componentDidMount(){
        this.checkNulls();
        this.getColNames();
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

      onOptionChange(e) {
          this.setState({trimOption : e.target.value});
      }

      
      performTrim(colName) {
        var option = this.state.trimOption;
        const customValue = this.state.customValue;
        if(isNaN(parseFloat(customValue))) {
            alert("Please enter a number for custom value");
        } else {
            if(option == "-- Select an option --") {
                alert("Please select a proper option")
            } else {
                fetch("http://127.0.0.1:5000/trimNulls?option="+option+"&colName="+colName+"&customVal="+customValue)
                .then(this.checkNulls);
            }
        }
      }

      handleCustomValChange(e) {
          this.setState({customValue : e.target.value});
      }

      render(){
            console.log("null info",this.state.null_data);
            console.log("col info",this.state.cols);
            const nullData = this.state.null_data;
            const cols = this.state.cols;

            let trs = [];
            trs.push(<tr className = "header">
                    <td>Column Name</td>
                    <td>Null Count</td>
                    </tr>);
            const numRows = cols.length;
            for(var i = 0; i < numRows; i++){
                const colName = cols[i];
                const countNull = nullData[i];
                
                let selectElem;
                let buttonElem;
                let selectCustomValForm;

                /*
                if(countNull > 0 & this.state.trimOption == "CustomValue") {
                    selectCustomValForm = <form onSubmit={() => this.performTrim(colName)}>
                        <label> Enter Value :
                            <input type="text" value={this.state.customValue} onChange={this.handleCustomValChange}></input>
                        </label>
                        <button>Trim</button>
                    </form>;
                }*/

                if(countNull > 0) {
                    selectElem =<select className="select-box" id="select-nulltrim" value={this.state.trimOption}  onChange={this.onOptionChange.bind(this)}>
                        <option key="0" id="0" value="-- Select an option --" >-- Select an option --</option>
                        <option key="1" id="1" value="RemoveRows" >Remove Rows</option>
                        <option key="2" id="2" value="CustomValue" >Custom Value</option>
                        <option key="3" id="3" value="Average" >Average of other Vals</option>
                        <option key="4" id="4" value="Median" >Median of other Vals</option>
                    </select>;
                }

                if(countNull > 0 & this.state.trimOption != "-- Select an option --" & this.state.trimOption != "CustomValue") {
                    buttonElem = <button onClick= {() => this.performTrim(colName)}>Trim</button>;
                }
                var className = "even";
                if(i%2 != 0){
                    className = "odd";
                }
                trs.push(<tr className={className}>
                <td>{colName}</td>
                <td>{countNull.toString()}  {selectElem} {selectCustomValForm} {buttonElem}</td>
                </tr>);
            }
        return(
            <div>
                <table>
                    <tbody>
                        {trs}
                    </tbody>
                </table>
            </div>
        );
      }
}