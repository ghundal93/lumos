import React, { Component } from 'react';
import './ModalChooseTwoColumns.css';
import Button from '../node_modules/react-bootstrap/Button';

export default class ModalChooseTwoColumns extends Component{
    constructor(props){
        super(props)
        this.state={cols:{},colId_1:"default1",colId_2:"default2"}
        this.getColumnNames = this.getColumnNames.bind(this);
        this.onAddButtonClick = this.onAddButtonClick.bind(this);
    }

    componentWillMount() {
        this.getColumnNames()
    }

    getColumnNames(){
        fetch("http://127.0.0.1:5000/getColNames")
        .then(data => data.json())
        .then(res => {
        var col_dict = {}
        res.col_names.map(
            function(col,i){
            col_dict[i] = col
            }
        )
        this.setState({ cols:col_dict})
        });   
    }

    onColBoxChange1(e){
        var colId = e.target.value;
        this.setState({colId_1:e.target.value})
      }

    onColBoxChange2(e){
        var colId = e.target.value;
        this.setState({colId_2:e.target.value})
      }

      onAddButtonClick = (e) => {
        this.props.handleClose(this.state.colId_1, this.state.colId_2)
      }

    render(){

        const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
        return(
            <div className={showHideClassName}>
                <section className="modal-main">
                    <div className="row" >
                        <label className = "select-column">Select first column:  </label>
                        <select className="select-box" id="parent_select_col_box_1" value={this.state.colId_1} onChange={this.onColBoxChange1.bind(this)} >
                            <option key="default1" id="default1" value="default1">-- Select a value --</option>
                        {
                        Object.keys(this.state.cols).map((key) => {
                            if(key != this.state.colId_2){
                                return <option key={key} id={key} value={key}>{this.state.cols[key]}</option>
                            }
                        })
                        }
                        </select>
                    </div>
                    <div className="row">
                        <label className = "select-column">Select second column:  </label>
                        <select className="select-box" id="parent_select_col_box_2" value={this.state.colId_2} onChange={this.onColBoxChange2.bind(this)} >
                        <option key="default2" id="default2" value="default2">-- Select a value --</option>
                        {
                        Object.keys(this.state.cols).map((key) => {
                            if(key != this.state.colId_1){
                                return <option key={key} id={key} value={key}>{this.state.cols[key]}</option>
                            }
                        })
                        }
                        </select>
                    </div>
                    <div className="row button-section">
                        <button className="add-button" onClick={this.onAddButtonClick}> ADD </button>               
                        <button className="close-button" onClick={this.props.handleClose}>CLOSE</button>
                    </div>
                </section>
            </div>
        )
        }
}