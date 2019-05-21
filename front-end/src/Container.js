import React, { Component } from 'react';
import draw from './chart.js';
import drawScatterPlot from './scatterplot.js';
import drawLineChart from './linechart.js';
import draw_corr from './chartCorr.js';
import draw_parrcord from './chartParrCord.js';


export default class Container extends Component{
    constructor(props){
        super(props);
        this.state = {width:props.width,height:props.height}
    }
    componentDidMount(){
        if(this.props.toDraw == "SCATTERPLOT")
            drawScatterPlot(this.props)
        else if (this.props.toDraw == "LINECHART")
            drawLineChart(this.props)
        else if(this.props.toDraw == "CORR")
            draw_corr(this.props)
        else if (this.props.toDraw == "PARRCORD")
        {
            draw_parrcord(this.props);
        }
        else
            draw(this.props)
    }

    componentDidUpdate(prevProps){
        if(this.props.toDraw == "SCATTERPLOT")
            drawScatterPlot(this.props)
        else if (this.props.toDraw == "LINECHART")
            drawLineChart(this.props)
        else if(this.props.toDraw == "CORR")
            draw_corr(this.props)
        else if (this.props.toDraw == "PARRCORD") {
            draw_parrcord(this.props);
        }
        else
            draw(this.props)
    }
    render(){
        console.log("In Container width",this.state.width)
        console.log("In Container height",this.state.height)
        return (
            <div className="container-div" style={{width:this.state.width,height:this.state.height}}/>
        );
    }
}