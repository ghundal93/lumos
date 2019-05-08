import * as d3 from 'd3';
import './App.css'
import { normalize } from 'uri-js';
import './chartCorr.css';

//Correlation Table
const draw_corr = (props) => {
    var svgContainer = '.'+props.containerClass
    d3.select(svgContainer +'> *').remove();
    d3.select('.legend > *').remove();
    var corrData = props.varData;
    var cols = props.colNames;

    var correlationMatrix =[];

    for(var k =0;k<corrData.length;k++){
        var val = corrData[k];
        var row_data = [];
        for(var i=0;i<cols.length;i++){
            row_data.push(parseFloat(val[cols[i]]).toFixed(2));
        }
        correlationMatrix.push(row_data);
    }

    Matrix(correlationMatrix, cols,svgContainer);

};

function Matrix(data, cols,svgContainer){
    var margin = {top: 50, right: 50, bottom: 150, left: 150},
	    width = 600,
	    height = 600,
	    labelsData = cols,
	    startColor = '#ABDDA4',
	    endColor = '#FEE08B';

	var widthLegend = 100;


	if(!data){
		throw new Error('Please pass data');
	}
    
    var maxValue = d3.max(data, function(layer) { return d3.max(layer, function(d) { return d; }); });
    var minValue = d3.min(data, function(layer) { return d3.min(layer, function(d) { return d; }); });

    
	var numrows = data.length;
	var numcols = numrows;

	var svg = d3.select(svgContainer).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var background = svg.append("rect")
	    .style("stroke", "black")
	    .style("stroke-width", "2px")
	    .attr("width", width)
	    .attr("height", height);


    var x = d3.scaleBand()
        .domain(d3.range(numcols))
        .range([0, width]);

    var y = d3.scaleBand()
        .domain(d3.range(numrows))
        .range([0, height]);

    var colorMap = d3.scaleQuantize()
    .domain([minValue,maxValue])
    .range([startColor, endColor]);

    console.log("color map example "+colorMap(minValue));

	var row = svg.selectAll(".row")
	    .data(data)
	  	.enter().append("g")
	    .attr("class", "row")
	    .attr("transform", function(d, i) {
            return "translate(0," + y(i) + ")"; });

	var cell = row.selectAll(".cell")
	    .data(function(d) { return d; })
			.enter().append("g")
	    .attr("class", "cell")
	    .attr("transform", function(d, i) {
            return "translate(" + x(i) + ", 0)"; });

	cell.append('rect')
	    .attr("width", x.bandwidth())
	    .attr("height", y.bandwidth())
	    .style("stroke-width", 0);

    cell.append("text")
	    .attr("dy", ".5em")
	    .attr("x", x.bandwidth() / 2)
	    .attr("y", y.bandwidth() / 2)
	    .attr("text-anchor", "middle")
	    .style("fill", function(d, i) { return d >= maxValue/2 ? 'white' : 'black'; })
        .text(function(d, i) { return d; })
        .style("font-size", "10px");

	row.selectAll(".cell")
	    .data(function(d, i) {
            return data[i]; })
	    .style("fill", colorMap);

	var labels = svg.append('g')
		.attr('class', "labels");

	var columnLabels = labels.selectAll(".column-label")
	    .data(labelsData)
	    .enter().append("g")
	    .attr("class", "column-label")
	    .attr("transform", function(d, i) {
            //console.log("xi is ",x(i));
            return "translate(" + x(i) + "," + height + ")"; 
        });

    

	columnLabels.append("line")
		.style("stroke", "black")
	    .style("stroke-width", "1px")
	    .attr("x1", x.bandwidth()/2)
	    .attr("x2", x.bandwidth()/2)
	    .attr("y1", 0)
        .attr("y2", 5)
        .style("font-size", "10px");

	columnLabels.append("text")
	    .attr("x", 0)
	    .attr("y", y.bandwidth() / 2)
	    .attr("dy", ".20em")
	    .attr("text-anchor", "end")
	    .attr("transform", "rotate(-60)")
        .text(function(d, i) { return d; })
        .style("font-size", "10px");

	var rowLabels = labels.selectAll(".row-label")
	    .data(labelsData)
	    .enter().append("g")
	    .attr("class", "row-label")
	    .attr("transform", function(d, i) {
            return "translate(" + 0 + "," + y(i) + ")"; });

	rowLabels.append("line")
		.style("stroke", "black")
	    .style("stroke-width", "1px")
	    .attr("x1", 0)
	    .attr("x2", -5)
	    .attr("y1", y.bandwidth() / 2)
	    .attr("y2", y.bandwidth() / 2);

	rowLabels.append("text")
	    .attr("x", -8)
	    .attr("y", y.bandwidth() / 2)
	    .attr("dy", ".20em")
	    .attr("text-anchor", "end")
        .text(function(d, i) { return d; })
        .style("font-size", "10px");

    var key = d3.select(".legend")
    .append("svg")
    .attr("width", widthLegend)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(0, 0)");

    var legend = key
    .append("defs")
    .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "100%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "100%")
    .attr("spreadMethod", "pad");

    legend
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", endColor)
    .attr("stop-opacity", 1);

    legend
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", startColor)
    .attr("stop-opacity", 1);

    key.append("rect")
    .attr("width", widthLegend/2-10)
    .attr("height", height)
    .style("fill", "url(#gradient)")
    .attr("transform", "translate(0," + margin.top + ")");

    var yaxis = d3.scaleLinear()
    .range([height, 0])
    .domain([minValue, maxValue]);

    key.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(41," + margin.top + ")")
    .call(d3.axisLeft(yaxis));

}

export default draw_corr;