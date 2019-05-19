import React, { Component } from 'react';
import Checkbox from './Checkbox';
import Container from './Container';

export default class ParellelCoordinates extends Component {

    constructor(){
        super();
        this.state = {
            columns : [],
            selectedCheckboxes : new Set(),
            dataDf : [],
            dataToDraw : [],
            colsToDraw : []
        };
    }

    componentDidMount() {
        this.getColumnNames();
        this.getDataDf();
    }

    toggleCheckbox = label => {
        // const mapSize = this.state.selectedCheckboxes.size;
        var selectedItems = this.state.selectedCheckboxes;
        if (selectedItems.has(label)) {
            selectedItems.delete(label);
        } else {
            selectedItems.add(label);
        }
    }

    handleFormSubmit = formSubmitEvent => {
        formSubmitEvent.preventDefault();
        const mapSize = this.state.selectedCheckboxes.size;
        if(mapSize <= 5 & mapSize >= 2) {

            const dataFull = this.state.dataDf;
            /*
            var tempData = [];
            const dataFull = this.state.dataDf;
            //console.log(dataFull[0].length);
            //for(var i=0; i < dataFull.length; )
            for (const checkbox of this.state.selectedCheckboxes) {
                console.log("Checkbox data is "+dataFull[checkbox]);
                tempData.push({
                    key:   checkbox,
                    value: dataFull[checkbox]
                });
            }
            this.setState({dataToDraw : tempData});
            */
           var temp = [];
            for (const checkbox of this.state.selectedCheckboxes) {
                
                temp.push(checkbox);
            }
            this.setState({dataToDraw : dataFull});
            this.setState({colsToDraw : temp});
        }  else {
            alert("Max Limit Reached");
        }
        
    }

    getDataDf() {
        fetch("http://127.0.0.1:5000/getDataDf")
        .then(data => data.json())
        //.then(res => console.log(res));
        .then(res => this.setState({dataDf : JSON.parse(res.data_df)}));
    }

    getColumnNames(){
        fetch("http://127.0.0.1:5000/getColNames")
        .then(data => data.json())
        .then(res => this.setState({ columns:res.col_names}));   
    }

    render() {

        let formComp = [];
        const colNames = this.state.columns;
        const numBoxes  = colNames.length;
        const dataToDraw = this.state.dataToDraw;
        let containerElem;

        for(var i = 0; i < colNames.length; i++){
            formComp.push(<Checkbox
            label={colNames[i]}
            handleCheckboxChange={this.toggleCheckbox}
            key={colNames[i]}
            />);
        }
        
        if(dataToDraw.length > 0) {
            console.log("Data to draw"+this.state.colsToDraw);
            containerElem = <Container colsToDraw={this.state.colsToDraw} containerClass='canvas-parcord' dataToDraw={dataToDraw}  toDraw="PARRCORD"></Container>
        }

        return ( <div  style={{display:'flex'}}>
            
            <div style={{float:'left',width: 30+ '%'}}>
            <h4> Check upto 5 columns and hit draw!</h4>
            <form onSubmit={this.handleFormSubmit}>
                {formComp}
                <button type="submit">Draw</button>
            </form>
            </div>
            {containerElem}
            <div class='canvas-parcord' style={{float:'center',width: 70+ '%'}}>
            </div>
            </div>
        );

    }
}
