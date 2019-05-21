import React, { Component } from 'react';
import axios from 'axios';
import Container from './Container';
import Loader from 'react-loader-spinner';

export default class ClusterScreePlot extends Component{
    constructor(props) {
        super(props);
        this.state ={
            dist : {},
            elbow_point : 1,
            loader:false
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
        const loader = Object.keys(distData).length == 0 ? true : false;
        return(
            <div>
                <div class='canvas-scree'>
                {
                    loader ? <div className="loader-style"><Loader type="Ball-Triangle" color="#00BFFF" height="100"	width="100"/></div> : <Container containerClass='canvas-scree' data={distData}  elbow={elbow_point} xLabel = "Cluster Count" yLabel = "Distance" titleGraph="Clustering Scree Plot" toDraw="LINECHART"></Container>
                }
                </div>
            </div>
        );
    }
}
