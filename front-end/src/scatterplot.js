import * as d3 from 'd3';
import './App.css'

const drawScatterPlot = (props) => {

    var data = props.data
    var sbgContainerClass = "."+props.containerClass
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
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
    console.log(data_list);
    
      // Scale the range of the data
    const x_gap = (d3.max(x_data) - d3.min(x_data))/count_data;
    const y_gap = (d3.max(y_data) - d3.min(y_data))/count_data;
    // console.log("x gap is ",x_gap);
    // console.log("y gap is ",y_gap);
    x.domain([d3.min(x_data)-20*x_gap, d3.max(x_data)+20*x_gap]);
    y.domain([d3.min(y_data)-20*y_gap, d3.max(y_data)+20*y_gap]);
    
    /*
    var xValue = function(d) { return parseFloat(d.key);};
    var yValue = function(d) { return d.value;};
    */
    var xMap = function(d) { return x(parseFloat(d.key));};
    var yMap = function(d) { return y(d.value);};
    
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
                          (height + margin.top + 50) + ")")
      .style("text-anchor", "middle")
      .style("fill", "Blue")
      .text(xLabel);

      svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", "Blue")
      .text(yLabel);

      svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "16px")
      .style("fill", "Blue")
      .style("text-decoration", "underline")  
      .text(titleGraph);

}

export default drawScatterPlot;