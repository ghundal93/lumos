import React, { Component } from 'react';
import Container from './Container';

export default class DimReduction extends Component {
    
    constructor(){
        super()
        this.state = {pca_data:{},loading_data:{}}
      }

    componentWillMount() {
        this.getDimReducedData()
    }

    getDimReducedData(){
        fetch("http://127.0.0.1:5000/performPCA?nC=2")
        .then(data => data.json())
        .then(res => this.setState({ pca_data:JSON.parse(res.pca_data),loading_data:JSON.parse(res.loading_data)}));   
    }

    render(){
        return(
            <div className="canvas">
                <Container data={this.state.pca_data} toDraw="SCATTERPLOT"/>
                <Container data={this.state.loading_data} xLabel = "Feature" yLabel = "Significance" titleGraph="Significance Graph" toDraw="LINECHART"/>
            </div>
        )
    }

}