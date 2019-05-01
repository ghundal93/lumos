import * as d3 from 'd3';
import './App.css'


const drawScatterPlot = (props) => {
    var obj = props.data
    //console.log("inside scatterplot obj:",obj)
    var data = []
    Object.keys(obj).map(function (key) {
        data.push(obj[key])
      });
    //console.log("inside scatterplot:",data)
    var margin = {top: 50, right: 60, bottom: 50, left: 50}
    // width = 600 - margin.left - margin.right,
    // height = 270 - margin.top - margin.bottom;
    var width = (Math.max(document.documentElement.clientWidth, window.innerWidth || 0))/2 - margin.left - margin.right;
    var height = (Math.max(document.documentElement.clientHeight, window.innerHeight || 0))/2 - margin.top - margin.bottom;

    // Parse the date / time
    //var parseDate = d3.time.format("%d-%b-%y").parse;
    //var parseDate = d3.time.format("%y-%b-%d").parse;
    //var parseDate = d3.time.format("%Y-%m-%d").parse;

    // Set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // Define the axes
    var xAxis = d3.axisBottom().scale(x);

    var yAxis = d3.axisLeft().scale(y).ticks(5);

    // Define the line
    var valueline = d3.line()
        .x(function(d) { var val = d.value; return x(val.Column_0); })
        .y(function(d) { var val = d.value; return y(val.Column_1); });

    var valueline2 = d3.line()
    .x(function(d,i){ return x(i);})
    .y(function(d,i){ return y(d[i]);});

    var xMap = function(d) { console.log("here");var val = d.value; return x(val.Column_0); }
    var yMap = function(d) { var val = d.value; return y(val.Column_1); }
    
    // Adds the svg canvas
    d3.select(".canvas>*").remove()
    var svg = d3.select('.canvas')
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    var x_val = []
    var y_val = []
    for (var k=0;k<data.length;k++) {
        var val = data[k];
        x_val.push(parseFloat(val["Column_0"]));
        y_val.push(parseFloat(val["Column_1"]));
    }
    //console.log("x_val:",x_val);
    //console.log(y_val);
    var dlist = d3.entries(data);
    //var dlist = data;
    //console.log("DLIST:",dlist);
    // Scale the range of the data
    x.domain([d3.min(x_val),d3.max(x_val)]);
    y.domain([d3.min(y_val), d3.max(y_val)]);
    console.log("Before drawing circle");
        svg.append("g")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("fill", "none")
        .selectAll("circle")
        .data(dlist)
        .enter()
        .append("circle")
        .attr("cx", xMap)
        .attr("cy", yMap)
        .attr("r", 2);

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
}

export default drawScatterPlot;