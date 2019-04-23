import React, { Component } from 'react';
import axios from 'axios';

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
      .then(this.props.handler("SUMMARIZE"))
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
      <div>
          <input type="file" id="file" ref={(ref) => { this.uploadInput = ref; }}/>
          <button onClick={this.handleUploadImage}>upload</button>
          {/* <div>
            <div style={{float:'left',width: 50 + '%',height:100 +"vh",overflow:'scroll'}}>
                <p>Response from server:</p>
                <p>{this.state.resMessage}</p>
                {
                  Object.keys(summary).map(
                    function(key){
                      return (
                        <div>
                        <label>{key}</label>
                        <table>
                          <tbody>
                            {
                              Object.keys(summary[key]).map(
                                function(k){
                                  return(
                                    <tr>
                                    <td>{k}</td>
                                    <td key = {key.toString()+"_"+k.toString()}>{summary[key][k]}</td>
                                    </tr>
                                  )
                                }
                              )
                              }
                          </tbody>
                        </table>
                        </div>
                      )
                    }
                  )
              }
            </div>
            <div style={{float:'right',width: 50 + '%',overflow:'scroll',height:100 +'vh'}}>
            <ScrollArea
            speed={0.8}
            className="area"
            contentClassName="content"
            >
              <p>Correlation Table</p>
              {
                <table>
                  <tbody>
                  {  
                    corr.map( row => <tr>{
                      row.map(elem => <td>{elem}</td>)
                    }</tr>)
                  }
                  </tbody>
                </table>
              }
              </ScrollArea>
            </div>
          </div> */}
      </div>
      )
  }
}