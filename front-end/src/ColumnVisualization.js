import React, { Component } from 'react';
import logo from './logo.svg';
// import './App.css';
import Container from "./Container";
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";
import styled from 'styled-components';
import ModalChooseColumn from './ModalChooseColumn';
import './ColumnVisualization.css'
import Button from 'react-bootstrap/Button';
import "react-tabs/style/react-tabs.css";
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

class ColumnVisualization extends Component {
  constructor(props){
    super(props)
    this.state={cols:[],selected_col:parseInt(props.colID),selected_data:[],nBins:5,shape:props.shape,showAddButton:true,showModal:false}
    this.onSliderChange = this.onSliderChange.bind(this);
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

  getSelectedColumnData(colId){
    //   console.log("Getting data for:",colId)
    fetch("http://127.0.0.1:5000/getSelectedColumnData?colId="+colId)
    .then(data => data.json())
    .then(res => this.setState({ selected_data:res.selected_data,selected_col:colId}));       
  }

  onTypeBoxChange(e){
    // console.log("TYPE" , e.target.value)
    this.setState({shape:e.target.value})
  }

  onInputChange(e) {
    this.setState({nBins:e.target.value})
  }

  onSliderChange(value){
    this.setState({nBins:value})
  }

  onChartClick(e) {
    // console.log("VIZZ CLICKED")
    this.state.shape === "BAR"? this.setState({shape:"CIRCLE"}):this.setState({shape:"BAR"})
  }

  onButtonClick(e){
    this.setState({shape:"FORCE"})
  }

  showModal = () => {
    this.setState({ showModal: true });
  };

  hideModal = (colId,chartType) => {
      if(colId != null && chartType != null && typeof colId != 'undefined' && typeof chartType != 'undefined'){
        this.getSelectedColumnData(parseInt(colId))
        this.setState({ showModal:false,showAddButton: false,shape: chartType});
      }
      else{
          this.setState({showModal:false})
      }
  };


  render() {
    const showHideAddButton = this.state.showAddButton ? this.props.id+" display-flex" : this.props.id + " display-none";
    const showHideGraph = this.state.showAddButton ? this.props.id + " display-none" : this.props.id + " display-block";
    const canvas_className = "cell"+this.props.id+"_"+this.state.shape+"_"+this.state.selected_col.toString()+"_col_viz_canvas"
    console.log("One Item col width:",this.props.width)
    console.log("One Item col height:",this.props.h)
    return (
      <div className="App" style={{width:this.props.width,height:this.props.h}}>
        <div className={showHideAddButton}>
            <div className = "add-button">
                <button className="add-button-style" onClick={this.showModal}>Add Chart</button>
            </div>
            <ModalChooseColumn show={this.state.showModal} handleClose={this.hideModal}/>
        </div>
        <div className={showHideGraph}>
            <div className="center-align svg">
            <div className={canvas_className}>
            <Container varData={this.state.selected_data} nBins={this.state.nBins} shape = {this.state.shape} containerClass={canvas_className} width={this.props.width} height={this.props.h}></Container>
            </div>
            <div>
              <button onClick={() => {this.setState({showAddButton :true})}}>Remove Chart</button>
            </div>
            </div>
            <div className="range-slider">
            <RangeSliderContainer color="#2B7B65">
            <InputRange maxValue={10} minValue={3} value={this.state.nBins} onChange={value => this.onSliderChange(value)}/>
            <br/>
            </RangeSliderContainer>
            <label >Number of Bins </label>
            </div>
        </div>
      </div>
    );
  }
}

export default ColumnVisualization;
