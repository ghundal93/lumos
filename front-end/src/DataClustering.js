import React, { Component } from 'react';
import Container from './Container';

export default class DataClustering extends Component {
    
    constructor(){
        super()
        this.state = {loading_data:{}}
      }

    componentWillMount() {
        //this.getDimReducedData()
    }

    getDimReducedData(){
        fetch("http://127.0.0.1:5000/performKMeans?k=2")
        .then(data => data.json())
        .then(res => this.setState({ pca_data:JSON.parse(res.pca_data),loading_data:JSON.parse(res.loading_data)}));   
    }

    render(){
        console.log("loading data",this.state.loading_data);
        return(
            <div className="canvas">
                <Container data={this.state.loading_data} xLabel = "Feature" yLabel = "Significance" titleGraph="Significance Graph" toDraw="LINECHART"/>
            </div>
        )
    }

}