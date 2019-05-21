import React, { Component } from 'react';
import logo from './logo.svg';
// import './App.css';
import Container from "./Container";
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";
import styled from 'styled-components/dist/styled-components.cjs';
import ModalChooseTwoColumns from './ModalChooseTwoColumns';
import './ColumnVisualization.css'

class RelationColumnVisualization extends Component {
  constructor(props){
    super(props)
    this.state={cols:[],selected_col_1:parseInt(props.colID),selected_data_1:[],selected_col_2:parseInt(props.colID),selected_data_2:[],shape:"SCATTERPLOT",showAddButton:true,showModal:false}
    this.getColumnNames = this.getColumnNames.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  componentWillMount() {
        this.getColumnNames()
  }

  getColumnNames(){
    fetch("http://127.0.0.1:5000/getColNames")
    .then(data => data.json())
    .then(res => this.setState({ cols:res.col_names}));   
  }

  getSelectedColumnData(colId1,colId2){
    //   console.log("Getting data for:",colId)
    fetch("http://127.0.0.1:5000/getSelectedColumnData?colId="+colId1)
    .then(data => data.json())
    .then(res => this.setState({ selected_data_1:res.selected_data,selected_col_1:colId1}));   
    
    fetch("http://127.0.0.1:5000/getSelectedColumnData?colId="+colId2)
    .then(data => data.json())
    .then(res => this.setState({ selected_data_2:res.selected_data,selected_col_2:colId2}));   
  }

  showModal = () => {
    this.setState({ showModal: true });
  };

  hideModal = (colId1,colId2) => {
      if(colId1 != null && colId2 != null && typeof colId1 != 'undefined' && typeof colId2 != 'undefined'){
        this.getSelectedColumnData(parseInt(colId1),parseInt(colId2))
        this.setState({ showModal:false,showAddButton: false});
      }
      else{
          this.setState({showModal:false})
      }
  };


  render() {
    const showHideAddButton = this.state.showAddButton ? this.props.id+" display-flex" : this.props.id + " display-none";
    const showHideGraph = this.state.showAddButton ? this.props.id + " display-none" : this.props.id + " display-block";
    const canvas_className = "cell"+this.props.id+"_"+this.state.selected_col_1.toString()+"_col_viz_canvas"
    console.log("Relation One Item col width:",this.props.width)
    console.log("Relation One Item col height:",this.props.h)
    const col1Data = this.state.selected_data_1;
    const col2Data = this.state.selected_data_2;
    var dataDict = {}
    Object.keys(col1Data).map(
        function(key){
            dataDict[col1Data[key]] = col2Data[key]
        }
    )

    console.log("DATA dict:",dataDict)
    return (
      <div className="App" style={{width:this.props.width,height:this.props.h}}>
        <div className={showHideAddButton}>
            <div className = "add-button">
                <button className="add-button-style" onClick={this.showModal}>Add Chart</button>
            </div>
            <ModalChooseTwoColumns show={this.state.showModal} handleClose={this.hideModal}/>
        </div>
        <div className={showHideGraph}>
            <div className="center-align svg">
            <div className={canvas_className}>
            <Container containerClass={canvas_className} colorCoding='false' data={dataDict} toDraw="SCATTERPLOT" xLabel={this.state.cols[this.state.selected_col_1]} yLabel={this.state.cols[this.state.selected_col_2]} titleGraph="Column Relation" width={this.props.width} height={this.props.h}></Container>
            </div>
            <div>
              <button onClick={() => {this.setState({showAddButton :true})}}>Remove Chart</button>
            </div>
            </div>
        </div>
      </div>
    );
  }
}

export default RelationColumnVisualization;
