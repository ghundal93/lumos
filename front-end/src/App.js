import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './FileUpload.js';
import DataSummary from './DataSummary.js';
import DataVisualization from './DataVisualization.js';
import FileUpload from './FileUpload.js';
//import Tabs from 'react-bootstrap/Tabs';
//import Tab from 'react-bootstrap/Tab';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
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
      /*
      case "SUMMARIZE":
        return <DataSummary/>;
      case "VISUALIZE":
        return <DataVisualization/>;
      */
    }
  }

  handleOnClick(val){
    console.log("Button clicked,",val)
    this.setState({showPage:val})
  }

  render() {
    const Component = (
      <div>
      <div>
      <h1> CSE564 : Visualisation : Data Engineer</h1>
      <a href="http://localhost:3000">
      <img border="0" alt="Home" src={require("./home_logo.png")} width="60" height="40"></img>
      </a>
      </div>
        <div>
          {this.renderSubComponent()}
        </div>
        </div>
        );
    return Component;
   /*
    (
      <div className="App">
        <div>
          <h1> CSE564 : Visualisation : Data Engineer</h1>
        </div>
        <div>
          
          <button id = {"UPLOAD"} onClick={(e) => this.handleOnClick(e.target.id)}>File UPLOAD</button>
          <button id = {"SUMMARIZE"} onClick={(e) => this.handleOnClick(e.target.id)}>Data Summary</button>
          <button id = {"VISUALIZE"} onClick={(e) => this.handleOnClick(e.target.id)}>Data Visualise</button>
        </div>
        <div>
          {this.renderSubComponent()}
        </div>
      </div>
    );
    */
  };
}

export default App;
