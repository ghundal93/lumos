import React, { Component } from 'react';
import axios from 'axios';

export default class FileUpload extends Component{
constructor(props) {
    super(props);
      this.state = {
        uploadStatus: false,
        resMessage : "",
        summary : []
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
      .then((response) => this.setState({ uploadStatus: true,resMessage : response.data.message, summary:response.data.summary}))
      .catch(function (error) {
        console.log(error);
      });
  }

  render(){
    console.log("summ",this.state.summary)
    console.log("summ type",typeof(this.state.summary))
    const summary = this.state.summary
      return (
      <div>
          <input type="file" id="file" ref={(ref) => { this.uploadInput = ref; }}/>
          <button onClick={this.handleUploadImage}>upload</button>
          <div>
              <p>Response from server:</p>
              <p>{this.state.resMessage}</p>
              {/* <p>{this.state.summary}</p> */}
              <table>
                <tbody>
                  {
                    Object.keys(summary).map(
                      function(key){
                        return(
                          <tr key = {key}>
                            {
                              Object.keys(summary[key]).map(
                                function(k){
                                  return(
                                    <td key = {key.toString()+"_"+k.toString()}>{summary[key][k]}</td>
                                  )
                                }
                              )
                            }
                          </tr>
                        )
                      }
                    )
                  }
                </tbody>
              </table>
          </div>
      </div>
      )
  }
}