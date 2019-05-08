import React, { Component } from 'react';
import Container from './Container';

export default class PCADimReduction extends Component {
    
    constructor(){
        super();
        this.state = { pca_data:{},
                        loadings_data:{},
                        pca_corr_data :{},
                        elbow:0,
                        task : ""};
      }

    componentWillMount() {
        this.getDimReducedData()    
    }

    getDimReducedData() {
        fetch("http://127.0.0.1:5000/performPCA?nC=5")
        .then(data => data.json())
        .then(res => this.setState({ pca_data:res.pca_data, 
                                    elbow_point: res.elbow_point, 
                                    pca_corr_data: res.pca_corr_data, 
                                    loadings_data:res.loadings_data}));
            //loading_data:JSON.parse(res.loading_data)}));   
    }

    onTaskChange(e){
        var task = e.target.value;
        this.setState({task : task});
        if(task == "View Scree Plot"){
            this.getDimReducedData();
        } else if(task == "View Correlation between any 2 PCA dims") {
            this.getDimReducedData();
        } else if (task == "Show Significance of Features on Principal components") {
            this.getDimReducedData();
        } /*else if (task == "Apply PCA on data") {
            getPCAData();
        } else if (task == "View Component Matrix") {
            getComponentMatrix();
        } else if (task == "View Component Score Table") {
            getCompScoreMat()
        } */else {
            return;
        }
    }

    

    render(){
        const task = this.state.task;
        let containerComp;

        if(task == "View Scree Plot"){
            console.log("Task is "+task);
            containerComp = <Container containerName='canvas-pca' colorCoding='false' data={this.state.pca_data}  elbow={this.state.elbow_point} xLabel = "Feature" yLabel = "Variance" titleGraph="PCA Scree Plot" toDraw="LINECHART"/>;
        } else if(task == "View Correlation between any 2 PCA dims") {
            console.log("Task is "+task);
            containerComp = <Container  containerName='canvas-pca' data={this.state.pca_corr_data} toDraw="SCATTERPLOT" xLabel = "PC0" yLabel = "PC1" titleGraph="ScatterPlot between PC1 and PC0"/>;
        } else if (task == "Show Significance of Features on Principal components") {
            var trs = [];
            trs.push(<tr>
                <td>Column Index</td>
                </tr>);
            //for(var i = 0; i < )
            trs.push(<tr>
                <td>this.state.loading_data[0][0]</td>
                </tr>);
            containerComp = <div>
            <table>
                {trs}
            </table>
          </div>;

        } else if (task == "Apply PCA on data") {
            containerComp = <div> Hii </div>;
        } else if (task == "View Component Matrix") {
            containerComp = <div> Hii </div>;
        } else if (task == "View Component Score Table") {
            containerComp = <div> Hii </div>;
        } else {
            containerComp = <div></div>;
        }

        // console.log("pca data",this.state.pca_data);
        // console.log("elbow point ", this.state.elbow_point);
        return(
            <div>
                <div style={{float:'right',width: 50 + '%'}}>
                    <p className = "select-pca-task">Select A PCA related task</p>
                    <select className="select-box" id="sselect-pca-task" value={this.state.task} onChange={this.onTaskChange.bind(this)} >
                    <option key='0' id='0' value='-- Select --'>-- Select --</option>
                    <option key='1' id='1' value='View Scree Plot'>View Scree Plot</option>
                    <option key='2' id='2' value='View Correlation between any 2 PCA dims'>View Correlation between any 2 PCA dims</option>
                    <option key='3' id='3' value='Show Significance of Features on Principal components'>Show Significance of Features on Principal components</option>
                    <option key='4' id='4' value='Apply PCA on data'>Apply PCA on data</option>
                    <option key='5' id='5' value="View Component Matrix">View Rotated Component Matrix</option>
                    <option key='6' id='6' value="View Component Score Table">View Component Score Table</option>
                    </select>
                </div>
                <div className="canvas-pca">
                    {containerComp}
                </div>
            </div>
            
        )
        /*
        
            <Container  containerName='canvas-pca' data={this.state.loading_data} toDraw="SCATTERPLOT" xLabel = "PC0" yLabel = "PC1" titleGraph="ScatterPlot between PC1 and PC0"/>
            <Container containerName='canvas-pca' colorCoding='false' data={this.state.pca_data}  elbow={this.state.elbow_point} xLabel = "Feature" yLabel = "Variance" titleGraph="PCA Scree Plot" toDraw="LINECHART"/>
        </div>
        */

    }

}