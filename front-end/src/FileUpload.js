import React, { Component } from 'react';
import axios from 'axios';

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
    // this.uploadInput.click();
    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    // data.append('filename', this.fileName.value);

    axios.post('http://localhost:5000/upload', data)
      .then((response) => this.setState({ uploadStatus: true,resMessage : response.data.message }))
      .catch(function (error) {
        console.log(error);
      });
  }

  render(){
      return (
      <div>
          <input type="file" id="file" ref={(ref) => { this.uploadInput = ref; }}/>
          <button onClick={this.handleUploadImage}>upload</button>
          <div>
              <p>Response from server:</p>
              <p>{this.state.resMessage}</p>
          </div>
      </div>
      )
  }
}