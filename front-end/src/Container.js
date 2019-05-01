import React, { Component } from 'react';
import draw_bin from './chart.js';
import draw_corr from './chartCorr.js';

export default class Container extends Component{
    componentDidMount(){
        if(this.props.chartType == "corr")
            draw_corr(this.props)
        else 
            draw_bin(this.props)
    }

    componentDidUpdate(prevProps){
        if(this.props.chartType == "corr")
            draw_corr(this.props)
        else 
            draw_bin(this.props)
    }
    render(){
        return (
            <div className="container-div"/>
            
        )
    }
}