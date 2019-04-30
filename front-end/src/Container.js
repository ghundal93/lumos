import React, { Component } from 'react';
import draw from './chart.js';

export default class Container extends Component{
    componentDidMount(){
        draw(this.props)
    }

    componentDidUpdate(prevProps){
        draw(this.props)
    }

    render(){
        return (
            <div className="container-div"/>
        )
    }
}