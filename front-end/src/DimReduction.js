import React, { Component } from 'react';
import Container from './Container';

export default class DimReduction extends Component {
    
    constructor(){
        super()
        this.state = {pca_data:{},loading_data:{}, elbow:0}
      }

    componentWillMount() {
        this.getDimReducedData()    
    }

    getDimReducedData(){
        fetch("http://127.0.0.1:5000/performPCA?nC=5")
        .then(data => data.json())
        .then(res => this.setState({ pca_data:res.pca_data, elbow_point: res.elbow_point,loading_data:res.loading_data})); 
            //loading_data:JSON.parse(res.loading_data)}));   
    }

    render(){
        console.log("pca data",this.state.pca_data);
        console.log("elbow point ", this.state.elbow_point);
        return(
            <div className="canvas">
              <Container data={this.state.loading_data} toDraw="SCATTERPLOT" xLabel = "PC0" yLabel = "PC1" titleGraph="ScatterPlot"/>
                <Container data={this.state.pca_data}  elbow={this.state.elbow_point} xLabel = "Feature" yLabel = "Significance" titleGraph="Significance Graph" toDraw="LINECHART"/>
            </div>
        )
    }

}