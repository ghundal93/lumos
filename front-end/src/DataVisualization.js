import React, { Component } from 'react';
import './App.css';
import ColumnVisualization from './ColumnVisualization.js'
import './DataVisualization.css'

class DataVisualization extends Component {
  constructor(){
    super()
    this.state = {showModal:false}
    this.onAddButtonClick = this.onAddButtonClick.bind(this);
  }

  onAddButtonClick = (e) => {
    console.log("Add button clicked")
    console.log("col_selecte",this.state.colId)
    console.log("type_selected",this.state.shape)
    var curr_dict = this.state.selected_cols
    curr_dict[this.state.colId] = this.state.shape
    console.log("curr_dict",curr_dict)
    this.setState({selected_cols:curr_dict})
    console.log("State now:",this.state.selected_cols)
  }

  render() {
      console.log("ColNames",this.state.cols)
      console.log("selected_cols",this.state.selected_cols)
      const selected_cols = this.state.selected_cols
    return (
      <div className="display-flex">
        {/* <div>
          {
            Object.keys(selected_cols).map(
              function(key){
                console.log("SELECTED COL:",key)
                return (
                  <ColumnVisualization colID={key} shape={selected_cols[key]} />
                )
              }
            )
          }
        </div> */}
        <div class="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <ColumnVisualization id="1" />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <ColumnVisualization id="2"/>
          </div>
        </div>
        <div class="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <ColumnVisualization id="3"/>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <ColumnVisualization id="4"/>
          </div>
        </div>
      </div>
    );
  }
}

export default DataVisualization;
