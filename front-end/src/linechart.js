import * as d3 from 'd3-v5';
import './App.css'
import './linechart.css'


const drawLineChart = (props) => {
    var data = props.data;
    var elbow_point = parseInt(props.elbow);
    var xLabel = props.xLabel;
    var yLabel = props.yLabel;
    var titleGraph = props.titleGraph
    var sbgContainerClass = "."+props.containerClass
    console.log("elbow_point is at"+elbow_point);

    var margin = {top: 30, right: 20, bottom: 30, left: 100},
        width = 600 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x_data  = [];
    var y_data = [];

    var count_data = 0;
    for(var k in data){
        count_data = count_data + 1;
        x_data.push(parseInt(k));
        y_data.push(data[k]);
    }

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // gridlines in x axis function
    function make_x_gridlines() {		
        return d3.axisBottom().scale(x).ticks(5)
    }

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft().scale(y).ticks(5)
    }

    var xAxis = d3.axisBottom().scale(x);
    var yAxis = d3.axisLeft().scale(y);

    var valueline = d3.line()
        .x(function(d, i){
            return x(parseInt(d.key));})
        .y(function(d){
            return y(d.value);})
        .curve(d3.curveMonotoneX) ;

    d3.select(sbgContainerClass+ '>*').remove();   
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
    x.domain([d3.min(x_data)-x_gap, d3.max(x_data)+x_gap]);
    y.domain([d3.min(y_data)-y_gap, d3.max(y_data)+y_gap]);

    // add the X gridlines
    svg.append("g")			
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
        )

    // add the Y gridlines
    svg.append("g")			
        .attr("class", "grid")
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        )

    // Add the valueline path.
    svg.append("path")
        .datum(data_list)
        .attr("class", "line")
        .attr("d", valueline);

    var xMap = function(d) { return x(parseFloat(d.key));};
    var yMap = function(d) { return y(d.value);};

        // Add the scatterplot
        svg.selectAll(".dot")
        .data(data_list)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d){
            if(parseInt(d.key) == elbow_point)
                return 5;
            else
            return 3.5;
        })
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d){
            if(parseInt(d.key) == elbow_point)
                return "red";
            else
            return "black";
        });
        
    // Add the X Axis
    var g_xAxis = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        g_xAxis.append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -10)
        .style("text-anchor", "end")
        .text("#PCs");

        g_xAxis.append("text")
        .attr("class", "label")
        .attr("x",150)
        .attr("y", -50)
        .style("text-anchor", "end")
        .text("Elbow point :"+elbow_point)
        .style("fill", "Red");

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
        .text("Variance");

        svg.append("text")             
        .attr("transform",
                "translate(" + (width/2) + " ," + 
                            (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .style("fill", "blue")
        .text(xLabel);
  
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "blue")
        .text(yLabel);
  
        svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("fill", "blue")
        .style("text-decoration", "underline")  
        .text(titleGraph);
}
export default drawLineChart;