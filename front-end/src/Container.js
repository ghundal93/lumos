import React, { Component } from 'react';
import draw from './chart.js';
import drawScatterPlot from './scatterplot.js';
import drawLineChart from './linechart.js';
import draw_corr from './chartCorr.js';


export default class Container extends Component{
    componentDidMount(){
        if(this.props.toDraw == "SCATTERPLOT")
            drawScatterPlot(this.props)
        else if (this.props.toDraw == "LINECHART")
            drawLineChart(this.props)
        else if(this.props.toDraw == "CORR")
            draw_corr(this.props)
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
        else
            draw(this.props)
    }
    render(){
        return (
            <div className="container-div"/>
        );
    }
}