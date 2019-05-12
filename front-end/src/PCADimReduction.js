import React, { Component } from 'react';
import Container from './Container';
import ErrorBoundry from './ErrorBoundry';
import draw from './chart.js';
import drawScatterPlot from './scatterplot.js';
import drawLineChart from './linechart.js';
import draw_corr from './chartCorr.js';
import Dummy from './Dummy';
import './App.css'

export default class PCADimReduction extends Component {
    
    constructor(){
        super();
        this.state = {  variance_data:{},
                        loadings_data:{},
                        pca_corr_data :{},
                        elbow_point:0,
                        columns : [],
                        comp_score : {},
                        pca_count:0,
                        pca_data : {},
                        download_data : false,
                        task : ""};
      }

    /*
    componentDidMount() {
        this.getDimReducedData()
    }
    */

    getPCAStats() {
        fetch("http://127.0.0.1:5000/performPCA?nC=10")
        .then(data => data.json())
        .then(res => this.setState({ variance_data:res.var_data,
                                    elbow_point: res.elbow_point, 
                                    pca_corr_data: res.pca_corr_data, 
                                    loadings_data:JSON.parse(res.loadings_data),
                                    comp_score : JSON.parse(res.comp_score)}));
    }

    getDimReducedData(count) {
        fetch("http://127.0.0.1:5000/reduceDataDimPCA?count="+count)
        .then(data => data.json())
        .then(res => this.setState({ pca_data : res.reduced_data_path}))
        .then(this.setState({download_data : true}));
    }

    getColumnNames(){
        fetch("http://127.0.0.1:5000/getColNames")
        .then(data => data.json())
        .then(res => this.setState({ columns:res.col_names}));   
    }

    onTaskChange(e){
        var task = e.target.value;
        this.setState({task : task});
        if(task != "Apply PCA on data") {
            this.getPCAStats();
            this.getColumnNames();
        }
    }

    onCountChange(e) {
        var count  = parseInt(e.target.value);
        
        if(count != 0){
            this.setState({pca_count : count});
            this.getDimReducedData(count);
        } else {
            this.setState({download_data : false});
        }
    }

    downloadPCAPath() {
        var path = this.state.pca_data;
        fetch("http://127.0.0.1:5000/getPCAData?path="+path)
        .then((response) => {
            var a = response.body.getReader();
            a.read().then(({ done, value }) => {
                this.saveAsFile(new TextDecoder("utf-8").decode(value), 'filename');
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

    render(){
        const task = this.state.task;
        let containerComp;
        

        if(task == "View Scree Plot"){
            console.log(this.state.variance_data);
            containerComp = <div>
            <Container className="canvas-pca" containerClass='canvas-pca' colorCoding='false' data={this.state.variance_data}  elbow={this.state.elbow_point} xLabel = "Feature" yLabel = "Variance" titleGraph="PCA Scree Plot" toDraw="LINECHART"/>
            <div className="canvas-pca">
            </div>
            </div>;
        } else if(task == "View Correlation between any 2 PCA dims") {
            containerComp = <div><Container  containerClass='canvas-pca' data={this.state.pca_corr_data} toDraw="SCATTERPLOT" xLabel = "PC0" yLabel = "PC1" titleGraph="ScatterPlot between PC1 and PC0"/>
            <div className="canvas-pca">
            </div> </div>;
        } else if (task == "Show Significance of Features on Principal components") {
            var loads = this.state.loadings_data;
            var colNames = this.state.columns;
            var numRows = Object.keys(loads).length;
            var numCols = Object.keys(Object.values(loads)[0]).length;
            var trs = [];

            var tds_header = [];
            tds_header.push(<td>Column Index</td>);
            for (var j=1; j <= numCols; j++){
                var name = 'PCA'+j.toString();
                tds_header.push(<td>{name}</td>);
            }
            trs.push(<tr className='header-row'>
               {tds_header}
                </tr>);

            for(var i=0; i < numRows; i++){
                var tds = [];
                tds.push(<td>{colNames[i]}</td>)
                for(var j=0; j < numCols; j++){
                    tds.push(<td>{loads[i][j].toFixed(4)}</td>);
                }
                var className = (i % 2 == 0) ? 'even' : 'odd';
                trs.push(<tr className={className}>{tds}</tr>);
            }

            containerComp =<div style={{'margin-left': '100px'}}>
                <h2> Significance of various features on principle components </h2>
                <table>
                <tbody>
                {trs}
                </tbody>
                </table>
                </div>;
        } else if (task == "Apply PCA on data") {
            var option_list = [];
            option_list.push(<option key='0' id='0' value='--- Select ---'>--- Select ---</option>);
            for(var i = 1; i <= 10; i++){
                option_list.push(<option key={i} id={i} value={i}>{i}</option>);
            }

            let buttonComp;
            if(this.state.download_data == true){
                var path = this.state.pca_data;
                //"http://localhost:3000/Users/apekshasinghal/Documents/SBU/Visualization/FinalProject/lumos/back-end/Transformed_data/pca_data.csv"
                buttonComp = 
                //<a href={path} download>Download</a>
                <button onClick={this.downloadPCAPath.bind(this)} >Download!</button>;
            }

            containerComp = <div>
            <h2> Select count of principle components </h2>
            <select className="select-box" id="select-pca-count" value={this.state.pca_count} onChange={this.onCountChange.bind(this)}>
            {option_list}
            </select>
            <br></br>{buttonComp}</div>;
            
        } else if (task == "View Component Score Table") {
            var comp_score = this.state.comp_score;
            var numCols = Object.keys(comp_score).length;
            var numRows = Object.keys(Object.values(comp_score)[0]).length;

            var trs = [];

            var tds_header = [];
            tds_header.push(<th className='header-row'>Data Index</th>);
            for (var j=1; j <= numCols; j++){
                var name = 'PCA'+j.toString();
                tds_header.push(<th className='header-row'>{name}</th>);
            }
            trs.push(<tr style={{'position':"fixed"}}>
               {tds_header}
                </tr>);

            for(var i=0; i < numRows; i++){
                var tds = [];
                tds.push(<td style={{'width': '75px'}}>{i}</td>)
                for(var j=0; j < numCols; j++){
                    tds.push(<td style={{'width': '75px'}}>{comp_score[j][i].toFixed(4)}</td>);
                }
                var className = (i % 2 == 0) ? 'even' : 'odd';
                trs.push(<tr className={className}>{tds}</tr>);
            }

            containerComp =<div style={{'margin-left': '100px'}}>
                <h2> Significance of various features on principle components </h2>
                <table >
                <tbody className='scrollable-table'>
                {trs}
                </tbody>
                </table>
                </div>;
        } else {
            containerComp = <div></div>;
        }
        //style={{float:'right',width: 50 + '%'}}
        return(
            <div>
                <div>
                    <h2> Select A PCA related task </h2>
                    <select className="select-box" id="select-pca-task" value={this.state.task} onChange={this.onTaskChange.bind(this)} >
                    <option key='0' id='0' value='-- Select --'>-- Select --</option>
                    <option key='1' id='1' value='View Scree Plot'>View Scree Plot</option>
                    <option key='2' id='2' value='View Correlation between any 2 PCA dims'>View Correlation between any 2 PCA dims</option>
                    <option key='3' id='3' value='Show Significance of Features on Principal components'>Show Significance of Features on Principal components</option>
                    <option key='4' id='4' value='Apply PCA on data'>Apply PCA on data</option>
                    <option key='5' id='5' value="View Component Score Table">View Component Score Table</option>
                    </select>
                </div>
                <ErrorBoundry>
                {containerComp}
                </ErrorBoundry>
            </div>
        )
    }

}