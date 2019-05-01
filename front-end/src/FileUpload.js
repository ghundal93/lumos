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
  }


  handleUploadImage(ev) {

    ev.preventDefault();
    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    axios.post('http://localhost:5000/upload', data)
      .then(this.props.handler("Dashboard"))
      .catch(function (error) {
        console.log(error);
      });

  }

  render(){
      return (
      <div style={{display: 'flex',justifyContent: 'center',height: 50+'vh'}} >
        <div>
          <div class="col-lg-1">
            <h2>Let's Get started! Upload a csv file</h2>
          </div>
          <div class="col-lg-1 ">
            <input className="input-button" type="file" id="file" ref={(ref) => { this.uploadInput = ref; }}/>
            <br></br>
          </div>
          <div class="col-lg-1">
            <button className ="submit-button" onClick={this.handleUploadImage}>Upload</button>
          </div>
        </div>
      </div>
      )
  }
}