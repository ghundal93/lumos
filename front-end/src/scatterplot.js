import * as d3 from 'd3-v5';
import './App.css'
// import {Spinner} from 'spin.js';

//ref : http://bl.ocks.org/eesur/cf81a5ea738f85732707
// loader settings
var opts = {
    lines: 9, // The number of lines to draw
    length: 9, // The length of each line
    width: 5, // The line thickness
    radius: 14, // The radius of the inner circle
    color: '#EE3124', // #rgb or #rrggbb or array of colors
    speed: 1.9, // Rounds per second
    trail: 40, // Afterglow percentage
    className: 'spinner', // The CSS class to assign to the spinner
  };

const drawScatterPlot = (props) => {

    var data = props.data
    var sbgContainerClass = "."+props.containerClass
    var margin = {top: 30, right: 20, bottom: 30, left: 50}
    var margin_big = {top: 30, right: 100, bottom: 60, left: 100}
    const p_w = props.width;
    const p_h = props.height;
    var width,height;
    if(p_w != null && p_h != null){
        console.log("IF CONDITION: p_width,",p_w)
        console.log("IF CONDITION: p_height,",p_w)
        width = p_w -  margin_big.left - margin_big.right;
        height = p_h - margin_big.top - margin_big.bottom;
        console.log("IF CONDITION: width,",width)
        console.log("IF CONDITION: height,",height)
    }
    else {
        console.log("ELSE CONDITION!!")
        width = 600 - margin.left - margin.right;
        height = 500 - margin.top - margin.bottom;
    }
    var xLabel = props.xLabel;
    var yLabel = props.yLabel;
    var colorCoding = props.colorCoding;
    var sbgContainerClass = "."+props.containerClass;
    
    var titleGraph = props.titleGraph
    var x_data  = [];
    var y_data = [];
    var label_data = [];

    var startColor = '#ABDDA4',
	    endColor = '#FEE08B';
    
    var count_data = 0;

    if (colorCoding == 'true'){
        var color = d3.scaleOrdinal(d3.schemeCategory10);
    }

    for(var k in data){
        count_data = count_data + 1;
        // console.log("k is "+k);
        x_data.push(parseFloat(k));
        y_data.push(parseFloat(data[k]));
        if(colorCoding == 'true'){
            label_data.push(parseInt(props.labels[k]));
        }
    }
    // console.log("label Data "+label_data);
    console.log("x data",x_data)
    console.log("y data",y_data)
    
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    
    var xAxis = d3.axisBottom().scale(x)
    var yAxis = d3.axisLeft().scale(y)

    d3.select(sbgContainerClass+">*").remove()
    var svg = d3.select(sbgContainerClass)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");
    
    var data_list = d3.entries(data);
    
      // Scale the range of the data
    const x_gap = (d3.max(x_data) - d3.min(x_data))/count_data;
    const y_gap = (d3.max(y_data) - d3.min(y_data))/count_data;

    x.domain([d3.min(x_data)-20*x_gap, d3.max(x_data)+20*x_gap]);
    y.domain([d3.min(y_data)-20*y_gap, d3.max(y_data)+20*y_gap]);
    
    /*
    var xValue = function(d) { return parseFloat(d.key);};
    var yValue = function(d) { return d.value;};
    */
    var xMap = function(d) { return x(parseFloat(d.key));};
    var yMap = function(d) { return y(d.value);};
    // var spinner = new Spinner().spin();
    // if(x_data.length == 0){
    //     d3.select("svg").node().append(spinner.el);
    // }
    // else{
        // spinner.stop()
        svg.selectAll(".dot")
            .data(data_list)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", function(d, i){
                            if(colorCoding == 'true'){
                                // console.log(" color assigned  is "+color(label_data[i]));
                                return color(label_data[i]);
                            }
                            else{
                                return("steelblue");
                            }
                    });
        // }
      // Add the X Axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", -6)
          .style("text-anchor", "end")
          .text("PC1");
    
      // Add the Y Axis
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("PC2");  

      svg.append("text")             
      .attr("transform",
              "translate(" + (width/2) + " ," + 
                          (height + margin.top) + ")")
      .style("text-anchor", "middle")
      .style("fill", "rgb(112, 122, 68)")
      .style("font-size", "16px") 
      .text(xLabel);

      svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", "rgb(112, 122, 68)")
      .style("font-size", "15px") 
      .text(yLabel);

      svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px") 
    .style("fill", "rgb(112, 122, 68)")
    .style("font-weight", "Bold") 
      .text(titleGraph);

}

export default drawScatterPlot;