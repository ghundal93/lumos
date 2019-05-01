import * as d3 from 'd3';
import './App.css'

const drawLineChart = (props) => {
    var data = props.data;
    var xLabel = props.xLabel;
    var yLabel = props.yLabel;
    var titleGraph = props.titleGraph
    var margin = {top: 30, right: 20, bottom: 60, left: 50},
        width = 600 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    // Parse the date / time
    //var parseDate = d3.time.format("%d-%b-%y").parse;
    //var parseDate = d3.time.format("%y-%b-%d").parse;
    //var parseDate = d3.time.format("%Y-%m-%d").parse;

    // Set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // Define the axes
    // Define the axes
    var xAxis = d3.axisBottom().scale(x);

    var yAxis = d3.axisLeft().scale(y).ticks(5);

    // Define the line
    var valueline = d3.line()
        .x(function(d) { return x(parseInt(d.key)); })
        .y(function(d) { return y(d.value); });

    var valueline2 = d3.line()
    .x(function(d,i){ return x(i);})
    .y(function(d,i){ return y(d[i]);});

    // Adds the svg canvas
    d3.select(".canvas>*").remove()
    var svg = d3.select(".canvas")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text(titleGraph);

    var x_val = []
    var y_val = []
    for (var k in data) {
        x_val.push(parseInt(k));
        y_val.push(data[k]);
    }

    console.log("x_val:",x_val);
    console.log(y_val);
    var dlist = d3.entries(data);
    console.log("DLIST:",dlist);
    console.log("xdomain",[d3.min(x_val),d3.max(x_val)])
    console.log("ydomain",[d3.min(y_val),d3.max(y_val)])
    // Scale the range of the data
    x.domain([d3.min(x_val),d3.max(x_val)]);
    y.domain([d3.min(y_val), d3.max(y_val)]);

    // Add the valueline path.
    svg.append("path")
    .attr("class", "line")
    .attr("d", valueline(dlist));

    // Add the X Axis
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    // Add the Y Axis
    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

    svg.append("text")             
    .attr("transform",
            "translate(" + (width/2) + " ," + 
                        (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text(xLabel);

    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(yLabel);
}

export default drawLineChart;