import * as d3 from 'd3';
import './App.css'


// const drawScatterPlot = (props) => {
//     var obj = props.data
//     //console.log("inside scatterplot obj:",obj)
//     var data = []
//     Object.keys(obj).map(function (key) {
//         data.push(obj[key])
//       });
//     //console.log("inside scatterplot:",data)
//     var margin = {top: 50, right: 60, bottom: 50, left: 50}
//     // width = 600 - margin.left - margin.right,
//     // height = 270 - margin.top - margin.bottom;
//     var width = (Math.max(document.documentElement.clientWidth, window.innerWidth || 0))/2 - margin.left - margin.right;
//     var height = (Math.max(document.documentElement.clientHeight, window.innerHeight || 0))/2 - margin.top - margin.bottom;

//     // Parse the date / time
//     //var parseDate = d3.time.format("%d-%b-%y").parse;
//     //var parseDate = d3.time.format("%y-%b-%d").parse;
//     //var parseDate = d3.time.format("%Y-%m-%d").parse;

//     // Set the ranges
//     var x = d3.scaleLinear().range([0, width]);
//     var y = d3.scaleLinear().range([height, 0]);

//     // Define the axes
//     var xAxis = d3.axisBottom().scale(x);

//     var yAxis = d3.axisLeft().scale(y).ticks(5);

//     // Define the line
//     var valueline = d3.line()
//         .x(function(d) { var val = d.value; return x(val.Column_0); })
//         .y(function(d) { var val = d.value; return y(val.Column_1); });

//     var valueline2 = d3.line()
//     .x(function(d,i){ return x(i);})
//     .y(function(d,i){ return y(d[i]);});

//     var xMap = function(d) { console.log("here");var val = d.value; return x(val.Column_0); }
//     var yMap = function(d) { var val = d.value; return y(val.Column_1); }
    
//     // Adds the svg canvas
//     d3.select(".canvas>*").remove()
//     var svg = d3.select('.canvas')
//         .append("svg")
//             .attr("width", width + margin.left + margin.right)
//             .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//             .attr("transform",
//                 "translate(" + margin.left + "," + margin.top + ")");
//     var x_val = []
//     var y_val = []
//     for (var k=0;k<data.length;k++) {
//         var val = data[k];
//         x_val.push(parseFloat(val["Column_0"]));
//         y_val.push(parseFloat(val["Column_1"]));
//     }
//     //console.log("x_val:",x_val);
//     //console.log(y_val);
//     var dlist = d3.entries(data);
//     //var dlist = data;
//     //console.log("DLIST:",dlist);
//     // Scale the range of the data
//     x.domain([d3.min(x_val),d3.max(x_val)]);
//     y.domain([d3.min(y_val), d3.max(y_val)]);
//     console.log("Before drawing circle");
//         svg.append("g")
//         .attr("stroke", "steelblue")
//         .attr("stroke-width", 1.5)
//         .attr("fill", "none")
//         .selectAll("circle")
//         .data(dlist)
//         .enter()
//         .append("circle")
//         .attr("cx", xMap)
//         .attr("cy", yMap)
//         .attr("r", 2);

//     // Add the X Axis
//     svg.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(xAxis);

//     // Add the Y Axis
//     svg.append("g")
//         .attr("class", "y axis")
//         .call(yAxis);
// }

const drawScatterPlot = (props) => {

    var data = props.data

    var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;
    var xLabel = props.xLabel;
    var yLabel = props.yLabel;
    var titleGraph = props.titleGraph
    var x_data  = [];
    var y_data = [];
    
    var count_data = 0;
    for(var k in data){
        count_data = count_data + 1;
        x_data.push(parseFloat(k));
        y_data.push(data[k]);
    }
    console.log("count data is "+count_data);
    /*
    for(var i = 0; i < x_data.length; i++){
        console.log("x : "+x_data[i]+" y :"+y_data[i]);
    }
    */
    
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    
    var xAxis = d3.axisBottom().scale(x)
    var yAxis = d3.axisLeft().scale(y)

    d3.select(".canvas>*").remove()
    var svg = d3.select(".canvas")
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
    console.log("x gap is ",x_gap);
    console.log("y gap is ",y_gap);
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
          .style("fill", "steelblue");
    
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
      console.log("Here 7");
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

      svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .style("text-decoration", "underline")  
      .text(titleGraph);

}

export default drawScatterPlot;