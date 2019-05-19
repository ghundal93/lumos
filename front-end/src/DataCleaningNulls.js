import React, { Component } from 'react';

export default class DataCleaningNulls extends Component{
    constructor(props) {
        super(props);
        this.state = {
            null_data : [],
            cols: [],
            trimOption : [],
            customValue: [],
            optionList: ["-- Select an option --","RemoveRows","CustomValue","Average","Median"]
        };
        this.performTrim = this.performTrim.bind(this);
        this.checkNulls = this.checkNulls.bind(this);
        this.handleCustomValChange = this.handleCustomValChange.bind(this);
        this.getColNames = this.getColNames.bind(this);
        this.updateStateAfter = this.updateStateAfter.bind(this);
        this.checkNulls();
        this.getColNames();
      }

      checkNulls(){
        fetch("http://127.0.0.1:5000/checkNulls")
        .then(data => data.json())
        .then((res) => {this.updateStateAfter(res)});
      }

      updateStateAfter(res) {
          console.log("Updating state after check null")
          const null_data = JSON.parse(res.null_data);
          var arr = []
          var arr_cval = []
          Object.keys(null_data).map(function (key){
              arr.push("-- Select an option --");
              arr_cval.push(0)
          })
        this.setState({ null_data:null_data,trimOption:arr,customValue:arr_cval});

      }

      getColNames(){
        fetch("http://127.0.0.1:5000/getColNames")
        .then(data => data.json())
        .then(res => this.setState({ cols:res.col_names}));
      }

      onOptionChange(e) {
          var oldTrimOption = this.state.trimOption;
          var id = parseInt(e.target.id.split("_")[1]);
          oldTrimOption[id] = e.target.value;
          this.setState({trimOption : oldTrimOption});
      }

      
      performTrim(colName,i) {
          console.log("Callling trim on col: ,",i)
        var option = this.state.trimOption[parseInt(i)];
        console.log("Option:" ,option)
        const customValue = this.state.customValue[parseInt(i)];
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
          var oldCVal = this.state.customValue;
          var id = parseInt(e.target.id.split("_")[1]);
          oldCVal[id] = e.target.value
          this.setState({customValue : oldCVal});
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
                const id = i;
                const colName = cols[i];
                const countNull = nullData[colName];
                
                let selectElem;
                let buttonElem;
                let selectCustomValForm;
                
                if(countNull > 0) {
                    selectElem =<select className="select-box" id={"select-nulltrim_"+i} value={this.state.trimOption[id]}  onChange={this.onOptionChange.bind(this)}>
                        <option key="0" id="0" value="-- Select an option --" >-- Select an option --</option>
                        <option key="1" id="1" value="RemoveRows" >Remove Rows</option>
                        <option key="2" id="2" value="CustomValue" >Custom Value</option>
                        <option key="3" id="3" value="Average" >Average of other Vals</option>
                        <option key="4" id="4" value="Median" >Median of other Vals</option>
                    </select>;
                }

                if(countNull > 0 & this.state.trimOption[id] != "-- Select an option --") {
                    if(this.state.trimOption[id] == "CustomValue"){
                        selectCustomValForm = <label> Enter Value :
                            <input type="text" id={"custom-val-trim_"+i} value={this.state.customValue[id]} onChange={this.handleCustomValChange}></input>
                        </label>;
                    }
                    buttonElem = <button onClick= {() => this.performTrim(colName,id)}>Trim</button>;
                }
                var className = "even";
                if(i%2 != 0){
                    className = "odd";
                }
                trs.push(<tr className={className}>
                <td>{colName}</td>
                <td>{countNull}  {selectElem} {selectCustomValForm} {buttonElem}</td>
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