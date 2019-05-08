import React, { Component } from 'react';
import './ModalChooseColumn.css';

export default class ModalChooseColumn extends Component{
    constructor(props){
        super(props)
        this.state={cols:{},colId:0,shape:"BAR",}
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

    onColBoxChange(e){
        var colId = e.target.value;
        this.setState({colId:e.target.value})
      }

      onTypeBoxChange(e){
        this.setState({shape:e.target.value})
      }

      onAddButtonClick = (e) => {
        console.log("Add button clicked")
        console.log("col_selecte",this.state.colId)
        console.log("type_selected",this.state.shape)
        this.props.handleClose(this.state.colId, this.state.shape)
      }

    render(){

        const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
        return(
            <div className={showHideClassName}>
                <section className="modal-main">
                    <div>
                        <p className = "select-column">Select a column:</p>
                        <select className="select-box" id="parent_select_col_box" value={this.state.selected_col} onChange={this.onColBoxChange.bind(this)} >
                        {
                        Object.keys(this.state.cols).map((key) => {
                            return <option key={key} id={key} value={key}>{this.state.cols[key]}</option>
                        })
                        }
                        </select>
                    </div>
                    <div>
                        <p className = "select-column">Select chart type:</p>
                        <select className="select-box" id="parent_select_type_box" value={this.state.shape} onChange={this.onTypeBoxChange.bind(this)} >
                        <option key="BAR" id="BAR" value="BAR">BAR CHART</option>
                        <option key="CIRCLE" id="CIRCLE" value="CIRCLE">PIE CHART</option>
                        </select>
                    </div>  
                <button onClick={this.onAddButtonClick}> ADD </button>               
                <button onClick={this.props.handleClose}>CLOSE</button>
                </section>
            </div>
        )
        }
}