import React, { Component } from 'react';
import './MDSDimReduction.css'

export default class MDSDimReduction extends Component{
    constructor(){
        super();
        this.state = { matrix  : "-- Select --",
        download_data : false,
        data_path : "",
        count : 0
        };
    }

    downloadFilePath() {
        var path = this.state.data_path;
        fetch("http://127.0.0.1:5000/getFileData?path="+path)
        .then((response) => {
            var a = response.body.getReader();
            a.read().then(({ done, value }) => {
                this.saveAsFile(new TextDecoder("utf-8").decode(value), 'mds_data.csv');
              }
            );
        });
    }

    saveAsFile(text, filename) {
        // Step 1: Create the blob object with the text you received
        const type = 'application/text'; // modify or get it from response
        const blob = new Blob([text], {type});
      
        // Step 2: Create Blob Object URL for that blob
        const url = URL.createObjectURL(blob);
      
        // Step 3: Trigger downloading the object using that URL
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click(); // triggering it manually
    }

    performMDS() {
        var matrix = this.state.matrix;
        var count = this.state.count;

        if(matrix != "-- Select --" & count != 0){
        fetch("http://127.0.0.1:5000/reduceDataDimMDS?matrix="+matrix+"&count="+count)
        .then(data => data.json())
        .then(res => this.setState({ data_path : res.reduced_data_path}))
        .then(this.setState({download_data : true}));
        } else {
            alert("Please select valid values for both Matrix and components");
        }
    }

    onMatChange(e) {
        var matrix = e.target.value;
        this.setState({matrix : matrix});
        this.setState({download_data : false});
    }

    onCountChange(e) {
        var count = parseInt(e.target.value);
        this.setState({count : count});
        this.setState({download_data : false});
    }

    render() {
        let buttonComp;
        if(this.state.download_data == true) {
            buttonComp = <button className="download-button" onClick={this.downloadFilePath.bind(this)} >Download!</button>;
        } else {
            buttonComp = <button className="perform-mds" onClick={this.performMDS.bind(this)} >Perform MDS</button>;
        }

        var option_list = [];
        option_list.push(<option key='0' id='0' value='0'>--- Select ---</option>);
        for(var i = 1; i <= 10; i++){
            option_list.push(<option key={i} id={i} value={i}>{i}</option>);
        }

        return(
            

            <div>
                <div className="mds-dim-red">
                    <h2> Select A Distance Matrix for MDS </h2>
                    <select className="select-box" id="select-mds-mat" value={this.state.matrix} onChange={this.onMatChange.bind(this)} >
                    <option key='0' id='0' value='-- Select --'>-- Select --</option>
                    <option key='1' id='1' value='euclidean'>Euclidean</option>
                    <option key='2' id='2' value='correlation'>Correlation</option>
                    </select>

                    <h2> Select Dimension count for MDS </h2>
                    <select className="select-box" id="select-mds-count" value={this.state.count} onChange={this.onCountChange.bind(this)}>
                    {option_list}
                    </select>
                    <br></br>

                    {buttonComp}
                </div>
            </div>
        );
    };
}