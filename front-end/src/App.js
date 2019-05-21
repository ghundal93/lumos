import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './FileUpload.js';
import DataSummary from './DataSummary.js';
import DataVisualization from './DataVisualization.js';
import FileUpload from './FileUpload.js';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs/lib';
import "react-tabs/style/react-tabs.css";
import Dashboard from './Dashboard';

class App extends Component {
// states - UPLOAD, SUMMARIZE, VISUALIZE
  state = {notes:"",showPage:"UPLOAD"}

  constructor(props){
    super(props)
    this.changePageState = this.changePageState.bind(this)
    this.getDataFromBackend = this.getDataFromBackend.bind(this)
    this.renderSubComponent = this.renderSubComponent.bind(this)
    this.handleOnClick = this.handleOnClick.bind(this)
    this.handleImageClick = this.handleImageClick.bind(this)
  }

  componentDidMount(){
    this.getDataFromBackend()
  }

  getDataFromBackend = () => {
    fetch("http://127.0.0.1:5000/main")
    .then(data => data.json())
    .then(res => this.setState({ notes: res.notes }));
  }

  changePageState(val){
    this.setState({showPage:val});
  }

  renderSubComponent(){
    switch(this.state.showPage){
      case "UPLOAD":
        return <FileUpload handler = {this.changePageState} />;
      case "Dashboard":
        return <Dashboard handler = {this.changePageState} value="default"/>;
      
    }
  }

  handleOnClick(val){
    console.log("Button clicked,",val)
    this.setState({showPage:val})
  }

  handleImageClick(){
    this.setState({showPage:"UPLOAD"})
  }

  render() {
    let titles;
    if(this.state.showPage != "UPLOAD"){
      titles  = 
      <div style={{display:'flex'}}>
      <div style={{float:'left',width: 30+ '%'}}><img border="0" alt="Home" src={require("./home_logo.png")} width="50" height="50" onClick={this.handleImageClick} ></img></div>
      <div style={{float:'center',width: 70 + '%'}}><h2 style={{color:"rgb(47, 73, 114)"}}> CSE564 : Visualisation : Data Engineer</h2></div>
      </div>
    }
    const Component = (
      <div className="App">
        <div className="space"/>
        {titles}
        <div>
          {this.renderSubComponent()}
        </div>
      </div>
      );
    return Component;
  };
}

export default App;
