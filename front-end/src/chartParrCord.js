
import * as d3 from 'd3';
import './App.css';
import './chartParrCord.css';

const draw_parrcord = (props) => {
    var svgContainer = '.'+props.containerClass
    d3.select(svgContainer +'> *').remove();
    // d3.select('.legend > *').remove();
    var dataToDraw = props.dataToDraw;
    var colsToDraw = props.colsToDraw;


    var margin = {top: 50, right: 30, bottom: 30, left: 30},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scalePoint([0, width]),
        y = {},
        dragging = {};

    var line = d3.line(),
        axis = d3.axisLeft(),
        background,
        foreground;

    var svg = d3.select(svgContainer).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var dimensions = colsToDraw;
    console.log(dataToDraw);

   x.domain(dimensions = colsToDraw.filter(function(d) {
    return (y[d] = d3.scaleLinear()
        .domain(d3.extent(dataToDraw, function(p) { return +p[d]; }))
        .range([height, 0]));
    }));

    background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(dataToDraw)
        .enter().append("path")
        .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(dataToDraw)
        .enter().append("path")
        .attr("d", path);

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) {
            console.log("axis "+d+" to be placed at "+x(d));
            return "translate(" + x(d) + ")"; })
        .call(d3.drag()
            .subject(function(d) { return {x: x(d)}; })
            .on("start", function(d) {
            dragging[d] = x(d);
            background.attr("visibility", "hidden");
            })
            .on("drag", function(d) {
            dragging[d] = Math.min(width, Math.max(0, d3.event.x));
            foreground.attr("d", path);
            dimensions.sort(function(a, b) { return position(a) - position(b); });
            x.domain(dimensions);
            g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
            })
            .on("end", function(d) {
            delete dragging[d];
            transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
            transition(foreground).attr("d", path);
            background
                .attr("d", path)
                .transition()
                .delay(500)
                .duration(0)
                .attr("visibility", null);
            }));

    // Add an axis and title.
    g.append("g")
        .attr("class", "axis")
        .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .style("font-size", "10px")
        .style("fill", "black")
        .text(function(d) { return d; });

    
    // Add and store a brush for each axis.
    var exploring = [];
    g.append("g")
        .attr("class", "brush")
        .each(function(d) {
            d3.select(this)
            .call( y[d].brush =
                d3.brushY()
                .extent([[x(d)-10, 0], [x(d)+10, height]])
                .on("start", brushstart)
                .on("brush", brush)
            );
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);
    

    //pixel position of a dimension
    function position(d) {
    var v = dragging[d];
    return v == null ? x(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
        }

    function brushstart(d, i) {
        console.log("brushstart");
        exploring.push(dimensions[i]);
        d3.event.sourceEvent.stopPropagation();
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        /*var actives = dimensions.filter(function(p) {
            console.log("is active"+y[p].brush.extent()[0]);
            return (d3.event.selection !== null); }),*/
        var actives = exploring;
        console.log("Actives :"+actives)
        var extents = actives.map(function(p) {
            console.log(y[p].brush.extent())
            return y[p].brush.extent(); });
            //extents = d3.brushSelection(this);
        foreground.style("display", function(d) {
            return actives.every(function(p, i) {
            return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            }) ? null : "none";
        });
    }

}

export default draw_parrcord;