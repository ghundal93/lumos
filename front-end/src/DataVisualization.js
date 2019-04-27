import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Container from "./Container";
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";
import styled from 'styled-components';
// import { Dropdown } from 'react-bootstrap';
const RangeSliderContainer = styled.div`
.input-range__track--active,
.input-range__slider {
  background: ${props => props.color}; 
  border-color: ${props => props.color};
}
.input-range__label{
  color: ${"black"};
}
`;

class DataVisualization extends Component {
  constructor(){
    super()
    this.state={cols:[],selected_col:1,selected_data:[],nBins:10,shape:"BAR"}
    this.onSliderChange = this.onSliderChange.bind(this);
    this.getColumnNames = this.getColumnNames.bind(this);
  }

  componentWillMount() {
        this.getColumnNames()
        this.getSelectedColumnData(0)
  }

  getColumnNames(){
    fetch("http://127.0.0.1:5000/getColNames")
    .then(data => data.json())
    .then(res => this.setState({ cols:res.col_names}));   
  }

  getSelectedColumnData(colId){
    fetch("http://127.0.0.1:5000/getSelectedColumnData?colId="+colId)
    .then(data => data.json())
    .then(res => this.setState({ selected_data:res.selected_data,selected_col:colId}));       
  }

  onOptionChange(e){
    var colId = e.target.value;
    this.getSelectedColumnData(colId)
  }

  onInputChange(e) {
    this.setState({nBins:e.target.value})
  }

  onSliderChange(value){
    this.setState({nBins:value})
  }

  onChartClick(e) {
    console.log("VIZZ CLICKED")
    this.state.shape === "BAR"? this.setState({shape:"CIRCLE"}):this.setState({shape:"BAR"})
  }

  onButtonClick(e){
    this.setState({shape:"FORCE"})
  }
  // shouldShowSlider(){
  //   if(this.state.shape == "BAR"){
  //     return <div className="slider"><label >Number of Bins</label><input type="range" id="customRange" min="3" value={this.state.nBins} step = "1" max="20" onChange={this.onInputChange.bind(this)}/></div>
  //   }
  //   else
  //   return <div></div>
  // }
  render() {
      console.log("ColNames",this.state.cols)
      console.log("selected_col",this.state.selected_col)
    return (
      <div className="App">
        <p className="heading">Visualisation: Assignment 1</p>
        <p className = "select-column">Select a column:</p>
        <select className="select-box" id="select_box" value={this.state.selected_col} onChange={this.onOptionChange.bind(this)} >
        {this.state.cols.map((col,id) => {
            return <option key={id} id={id} value={id}>{col}</option>
        })}
        </select>
        <div className="canvas">
          <Container onComponentClicked={this.onChartClick.bind(this)} varData={this.state.selected_data} nBins={this.state.nBins} shape = {this.state.shape}></Container>
        </div>
        {/* <div className="slider">
        <label >Number of Bins </label>
        <input type="range" id="customRange" min="3" value={this.state.nBins} step = "1" max="20" onChange={this.onInputChange.bind(this)}/>
        </div> */}
        <br/>
        <RangeSliderContainer color="#2B7B65">
          <div className="slider">
          <InputRange maxValue={20} minValue={3} value={this.state.nBins} onChange={value => this.onSliderChange(value)}/>
          </div><br/>
        </RangeSliderContainer>
        <label >Number of Bins </label>
        <div>
          <button onClick={this.onButtonClick.bind(this)}>Show Force Directed</button>
        </div>
      </div>
    );
  }
}

export default DataVisualization;
