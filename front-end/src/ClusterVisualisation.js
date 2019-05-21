import React, { Component } from 'react';
import axios from 'axios';
import Container from './Container';
import './App.css'
import sizeMe from 'react-sizeme';
import Loader from 'react-loader-spinner';

class ClusterVisualisation extends Component{
    constructor(props) {
        super(props);
        this.state = {
            labelsDict : {},
            pcaDict : {},
            mdsEucLabelsDict : {},
            mdsCorrLabelsDict : {},
            mdsEucDict : {},
            mdsCorrDict : {},
            clusterCount : 4,
            loader:false
        }
        this.getClusterData(4)
    }

    componentDidMount(){
        this.getClusterData(4)
    }

    getClusterData(count) {
        fetch("http://127.0.0.1:5000/performKMeans?count="+count)
        .then(data => data.json())
        .then(res => this.setState({pcaDict : res.pca_data, 
            labelsDict : res.labels_dict,
            mdsEucDict : res.mds_euc_data,
            mdsEucLabelsDict : res.mds_euc_labels_dict,
            mdsCorrDict : res.mds_corr_data,
            mdsCorrLabelsDict : res.mds_corr_labels_dict}));
    }

    onClusCountChange(e){
        var count = e.target.value;
        this.setState({clusterCount : count,pcaDict:{}});
        this.getClusterData(count);
    }

    render() {
        const pcaDict = this.state.pcaDict;
        const labelsDict = this.state.labelsDict;
        const mdsEucDict = this.state.mdsEucDict;
        const mdsCorrDict = this.state.mdsCorrDict;
        const mdsEucLabelsDict =  this.state.mdsEucLabelsDict;
        const mdsCorrLabelsDict = this.state.mdsCorrLabelsDict;

        const countRange = new Array(24);
        for(var i=0; i < countRange.length; i++){
            countRange[i] = i+2;
        }

        const { width, height } = this.props.size
        const loader = Object.keys(pcaDict).length == 0 ? true : false;
        console.log("CLusterVisualisation, WIDTH:",width)
        console.log("CLusterVisualisation, HEIGHT:",height)
        console.log("State of loader:",this.state.loader)
        let containerComp = <div className='canvas-cluster viz-container display-flex-col'>
            <div className="row">
                <div className="item-1">
                    {
                        <Container containerClass='item-1' colorCoding='true' data={pcaDict} labels={labelsDict} toDraw="SCATTERPLOT" xLabel = "PC0" yLabel = "PC1" titleGraph="Cluster Formations" width={width/2} height={height/2}></Container> 
                    }
                </div>
                <div className="item-2">
                    {
                        <Container containerClass='item-2' colorCoding='true' data={mdsEucDict} labels={mdsEucLabelsDict} toDraw="SCATTERPLOT" xLabel = "MDS0" yLabel = "MDS1" titleGraph="Cluster Formations on MDS - EUC" width={width/2} height={height/2}></Container> 
                    }
                </div>
            </div>
            <div className="row">
                <div className = "item-3">
                    {
                        <Container containerClass='item-3' colorCoding='true' data={mdsCorrDict} labels={mdsCorrLabelsDict} toDraw="SCATTERPLOT" xLabel = "MDS0" yLabel = "MDS1" titleGraph="Cluster Formations on MDS - CORR" width={width/2} height={height/2}></Container>
                    }
                </div>
            </div>
        </div>
        return(
            <div>
                <div style={{"text-align":"center"}}>
                    <label className = "select-cluster-count">Select Cluster Count:</label>
                    <select className="select-box" id="select_count_box" value={this.state.clusterCount} onChange={this.onClusCountChange.bind(this)} >
                    {countRange.map((count,id) => {
                        return <option key={id} id={id} value={count}>{count}</option>
                    })}
                    </select>
                </div>
                {
                    loader ? <div className="loader-style"><Loader type="Ball-Triangle" color="#00BFFF" height="100"	width="100"/></div> : containerComp
                }
            </div>
        );
    }
}

export default sizeMe({ monitorHeight: true }) (ClusterVisualisation)