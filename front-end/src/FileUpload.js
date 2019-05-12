import React, { Component } from 'react';
import axios from 'axios';
import './FileUpload.css'

export default class FileUpload extends Component{
constructor(props) {
    super(props);
      this.state = {
        uploadStatus: false,
        resMessage : ""
      }
    this.handleUploadImage = this.handleUploadImage.bind(this);
    // this.uploadInput = React.createRef();
    this.updateParent = this.updateParent.bind(this)
  }


  handleUploadImage(ev) {

    ev.preventDefault();
    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    axios.post('http://localhost:5000/upload', data)
      .then(this.updateParent)
      .catch(function (error) {
        console.log(error);
      });
  }

  updateParent(){
    this.props.handler("Dashboard")
  }

  render(){
      return (
      <div className="Upload-button">
        <h2>Let's Get started! Upload a csv file</h2>
          <input className="input-button" type="file" id="file" ref={(ref) => { this.uploadInput = ref; }}/>
          <br></br>
          <button className ="submit-button" onClick={this.handleUploadImage}>Upload</button>
      </div>
      )
  }
}