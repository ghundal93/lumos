import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './FileUpload.js';
import FileUpload from './FileUpload.js';

class App extends Component {

  state = {notes:"",showPage:"UPLOAD"}

  componentDidMount(){
    this.getDataFromBackend()
  }

  getDataFromBackend = () => {
    fetch("http://127.0.0.1:5000/main")
    .then(data => data.json())
    .then(res => this.setState({ notes: res.notes }));
  }


  render() {
    return (
      <div className="App">
        <div>
          <p>Notes: {this.state.notes}</p>
        </div>
        <div>
          <FileUpload/>
        </div>
      </div>
    );
  }
}

export default App;
