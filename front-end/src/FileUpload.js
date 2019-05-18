import React, { Component } from 'react';
import axios from 'axios';
import './FileUpload.css'

export default class FileUpload extends Component{
constructor(props) {
    super(props);
      this.state = {
        uploadStatus: false,
        resMessage : "",
        filename:""
      }
    this.handleUploadImage = this.handleUploadImage.bind(this);
    // this.uploadInput = React.createRef();
    this.updateParent = this.updateParent.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
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

  onInputChange(event){
    if (!event.target.files[0]) {
      return
    }
    this.setState({filename:event.target.files[0].name})
  }

  render(){
      return (
      <div className="Upload-button">
        <h2 className="text-color">Let's Get started! Upload a csv file</h2>
          <input className="input-button" type="file" id="file" onChange={this.onInputChange} ref={(ref) => { this.uploadInput = ref; }}/>
          <label for="file"><span>{this.state.filename}</span><strong>Choose a file</strong></label>
          <br></br>
          <button className ="submit-button" onClick={this.handleUploadImage}>Upload</button>
      </div>
      )
  }
}