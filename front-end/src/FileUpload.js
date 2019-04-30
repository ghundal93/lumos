import React, { Component } from 'react';
import axios from 'axios';
import './FileUpload.css'

export default class FileUpload extends Component{
constructor(props) {
    super(props);
      this.state = {
        uploadStatus: false,
        resMessage : "",
        summary : [],
        corr :[]
      }
    this.handleUploadImage = this.handleUploadImage.bind(this);
    // this.uploadInput = React.createRef();
  }


  handleUploadImage(ev) {
    ev.preventDefault();
    // this.uploadInput.click();
    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    // data.append('filename', this.fileName.value);

    axios.post('http://localhost:5000/upload', data)
      // .then((response) => this.setState({ uploadStatus: true,resMessage : response.data.message, summary:response.data.summary,corr:response.data.corr}))
      .then(this.props.handler("Dashboard"))
      .catch(function (error) {
        console.log(error);
      });
  }

  render(){
    console.log("summ",this.state.summary)
    console.log("summ type",typeof(this.state.summary))
    console.log("corr",this.state.corr)
    console.log(" type corr",typeof(this.state.corr))
    const summary = this.state.summary
    const corr = this.state.corr
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