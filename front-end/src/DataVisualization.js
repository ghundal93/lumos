import React, { Component } from 'react';
// import './App.css';
import ColumnVisualization from './ColumnVisualization.js'
import './DataVisualization.css'
import sizeMe from 'react-sizeme'


class DataVisualization extends Component {
  constructor(){
    super()
    this.state = {showModal:false}
    this.onAddButtonClick = this.onAddButtonClick.bind(this);
  }

  onAddButtonClick = (e) => {
    // console.log("Add button clicked")
    // console.log("col_selecte",this.state.colId)
    // console.log("type_selected",this.state.shape)
    var curr_dict = this.state.selected_cols
    curr_dict[this.state.colId] = this.state.shape
    // console.log("curr_dict",curr_dict)
    this.setState({selected_cols:curr_dict})
    // console.log("State now:",this.state.selected_cols)
  }

  render() {
      // console.log("ColNames",this.state.cols)
      // console.log("selected_cols",this.state.selected_cols)
      const selected_cols = this.state.selected_cols
      const { width, height } = this.props.size
      console.log("DataVisualization, WIDTH:",width)
      console.log("DataVisualization, HEIGHT:",height)
    return (
      <div className="display-flex viz-container">
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
          <div className="item">
            <ColumnVisualization id="1" width= {width/2} h={height/2} />
          </div>
          <div className="item">
            <ColumnVisualization id="2" width= {width/2} h={height/2} />
          </div>
        </div>
        <div class="row">
          <div className="item">
            <ColumnVisualization id="3" width= {width/2} h={height/2} />
          </div>
          <div className="item">
            <ColumnVisualization id="4" width= {width/2} h={height/2} />
          </div>
        </div>
      </div>
    );
  }
}

// export default DataVisualization;
export default sizeMe({ monitorHeight: true }) (DataVisualization)
