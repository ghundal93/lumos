import React, { Component } from 'react';
import axios from 'axios';
import Container from './Container';

export default class ClusterScreePlot extends Component{
    constructor(props) {
        super(props);
        this.state ={
            dist : {},
            elbow_point : 1
        }
    }

    componentDidMount() {
        this.getPlotData()
    }

    getPlotData() {
        fetch("http://127.0.0.1:5000/kmeansScreeplot")
        .then(data => data.json())
        .then(res => this.setState({dist : res.result_dict, 
                                    elbow_point : res.elbow_point}));
    }

    render() {
        const distData = this.state.dist;
        const elbow_point = this.state.elbow_point;

        return(
            <div>
                <div class='canvas-scree'>
                <Container containerClass='canvas-scree' data={distData}  elbow={elbow_point} xLabel = "Cluster Count" yLabel = "Distance" titleGraph="Clustering Scree Plot" toDraw="LINECHART"></Container>
                </div>
            </div>
        );
    }
}
