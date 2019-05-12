import React, { Component } from 'react';
import axios from 'axios';
import Container from './Container';

export default class ClusterVisualisation extends Component{
    constructor(props) {
        super(props);
        this.state = {
            labelsDict : {},
            pcaDict : {},
            clusterCount : 4
        }
    }

    componentDidMount(){
        this.getClusterData(4)
    }

    getClusterData(count) {
        fetch("http://127.0.0.1:5000/performKMeans?count="+count)
        .then(data => data.json())
        .then(res => this.setState({pcaDict : res.pca_data, 
                                    labelsDict : res.labels_dict}));
    }

    onClusCountChange(e){
        var count = e.target.value;
        this.setState({clusterCount : count});
        this.getClusterData(count);
    }

    render() {
        const pcaDict = this.state.pcaDict;
        const labelsDict = this.state.labelsDict;
        const countRange = new Array(24);
        for(var i=0; i < countRange.length; i++){
            countRange[i] = i+2;
        }

        return(
            <div>
                <div style={{float:'right',width: 50 + '%'}}>
                <p className = "select-cluster-count">Select Cluster Count:</p>
                <select className="select-box" id="select_count_box" value={this.state.clusterCount} onChange={this.onClusCountChange.bind(this)} >
                {countRange.map((count,id) => {
                    return <option key={id} id={id} value={count}>{count}</option>
                })}
                </select>
                </div>
                <div class='canvas-cluster'>
                <Container containerClass='canvas-cluster' colorCoding='true' data={pcaDict} labels={labelsDict} toDraw="SCATTERPLOT" xLabel = "PC0" yLabel = "PC1" titleGraph="Cluster Formations"></Container>
                </div>
            </div>
        );
    }
}