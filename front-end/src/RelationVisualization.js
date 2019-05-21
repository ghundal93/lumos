import React, { Component } from 'react';
// import './App.css';
import RelationColumnVisualization from './RelationColumnVisualization.js'
import './DataVisualization.css'
import sizeMe from 'react-sizeme'


class RelationVisualization extends Component {
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
      // const selected_cols = this.state.selected_cols
      const { width, height } = this.props.size
      console.log("RelationVisualization, WIDTH:",width)
      console.log("RelationVisualization, HEIGHT:",height)
    return (
      <div className="display-flex viz-container">
        <div class="row">
          <div className="item">
            <RelationColumnVisualization id="1" width= {width/2} h={height/2} />
          </div>
          <div className="item">
            <RelationColumnVisualization id="2" width= {width/2} h={height/2} />
          </div>
        </div>
        <div class="row">
          <div className="item">
            <RelationColumnVisualization id="3" width= {width/2} h={height/2} />
          </div>
          <div className="item">
            <RelationColumnVisualization id="4" width= {width/2} h={height/2} />
          </div>
        </div>
      </div>
    );
  }
}

// export default DataVisualization;
export default sizeMe({ monitorHeight: true }) (RelationVisualization)
