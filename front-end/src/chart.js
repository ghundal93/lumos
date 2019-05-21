import * as d3 from 'd3-v5';
import './App.css'
import { normalize } from '../node_modules/uri-js/dist/es5/uri.all';

// Bar Chart
function drawBarChart(binArray, margin,barSep,nBins,w,h,onComponentClicked,binRange,sbgContainerClass){
    d3.select(sbgContainerClass+">*").remove()
    var svg = d3.select(sbgContainerClass).append('svg')
    .attr('height',h)
    .attr('width',w)
    .attr('id','svg-viz')
    .attr('class','svg')
    .on("click",onComponentClicked)

    //y-axis
    const yScale = d3.scaleLinear()
    .range([h-margin, margin])
    .domain([0,d3.max(binArray)]);

    // const yScale = d3.scaleSymlog()
    // .range([h-margin, margin])
    // .domain([0,d3.max(binArray)]);

    svg.append('g')
    .call(d3.axisLeft(yScale))
    .attr('transform',`translate(${margin}, 0)`)

    //x-axis
    var x_domain =[]
    for(var i=0;i<nBins;i++){
        x_domain.push(i);
    }
    const xScale = d3.scaleBand()
    .range([0, w-2*margin])
    .domain(x_domain)
    .padding(0.2)

    const x = d3.scaleBand().domain(binRange).range([0, w-2*margin]);


    svg.append('g')
    .attr('transform', `translate(${margin}, ${h-margin})`)
    .call(d3.axisBottom(x))
    .selectAll(".tick text")
    .call(wrap, x.bandwidth());

    //bars
    svg.selectAll(".bars")
    .data(binArray)
    .enter()
    .append('rect')
    .attr('x', function(d,i){
        return margin + xScale(i);
    })
    .attr('y',(s) => {return yScale(s)})
    .attr('height', function (s){return h-margin - yScale(s)})
    .attr('width', function(d){
        return (w-barSep-20)/nBins;
    })
    .attr('id',function(d,i){
        return "bar_"+(i+1);
    })
    .attr('fill','#235A64')
    .on("mouseover", onMouseOver)
    .on("mouseout", onMouseOut)

    function onMouseOver(d,i){
        d3.select(this)
        .transition()
        .duration(100)
        .attr('width', (w-barSep+20)/nBins)
        .attr('height',h-margin - yScale(d)+10)
        .attr('y',yScale(d)-10)

        svg.append("text")
        .attr("class","text_class")
        .attr('x', margin+ xScale(i)+(w-barSep+20)/(nBins*2) - 10)
        .attr('y',yScale(d)-10)
        .attr('fill','black')
        .attr("text.anchor","middle")
        .text(binArray[i]);
    };

    function onMouseOut(d,i){
        d3.selectAll(".text_class")
        .remove()
        d3.select(this)
        .transition()
        .duration(100)
        .attr('width', (w-barSep-20)/nBins)
        .attr('height',h-margin - yScale(d))
        .attr('y',yScale(d))
    };

    // Followed tutorial to wrap the text : https://gist.github.com/guypursey/f47d8cd11a8ff24854305505dbbd8c07
    function wrap(text, width) {
        text.each(function() {
          var text = d3.select(this),
              words = text.text().split(/\s+/).reverse(),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = 1.1, // ems
              y = text.attr("y"),
              dy = parseFloat(text.attr("dy")),
              tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
          }
        });
      }

}

// Pie Chart
function drawPieChart(binArray,nBins,width,height,margin,onComponentClicked,binRange,sbgContainerClass){
    d3.select(sbgContainerClass+">*").remove()
    var radius = width/4;

    var color = d3.scaleOrdinal(["#ABA847","#9AA448","#89A14B","#799C4E","#6A9852","#5B9357","#4D8D5B","#40885F","#358262","#2B7B65","#237566","#1F6E67","#1E6867","#206166","#235A64","#285360","#2C4C5C","#2F4557","#323E51","#34374A"]);

    // var color = d3.scaleOrdinal(["#ABA847","#1E313D","#1D3945","#1B424B","#194B51","#185456","#195D59","#1D665B","#246F5D","#2E785C","#3B805B","#498959","#589157","#699954","#7BA051","#8EA74E","#A2AD4D","#B7B34C","#CDB84E","#E4BC51"]);
    // var color = d3.scaleOrdinal(["#EE9ED0","#DFA4DB","#CDABE4","#BAB2EA","#A5B9ED","#8EBFED","#78C4EA","#62C9E4","#50CDDB","#44D0D0","#42D2C3","#4AD3B5","#58D4A5","#69D496","#7BD487","#8ED278","#A0D06B","#B3CD60","#C5CA58","#D7C554"]);

    // pie chart arc
    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    // arc for animation on mouse over a particular pie
    var arc_onMouseOver = d3.arc()
        .outerRadius(radius+10)
        .innerRadius(0);

    // label arc
    var labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);
    

    // generate pie chart
    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d; });
    
    // define the svg for pie chart
    var svg = d3.select(sbgContainerClass).append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr('class','svg')
    .append("g")
    .attr("transform", "translate(" + (width / 3 + 40) + "," + height / 2 + ")")
    .on("click",onComponentClicked) 

    // "g element is a container used to group other SVG elements"
    var g = svg.selectAll(".arc")
    .data(pie(binArray))
    .enter().append("g")
    .attr("class", "arc")

    // append path 
    g.append("path")
    .attr("d", arc)
    .on("mouseover",onMouseOver)
    .on("mouseout",onMouseOut)
    .style("fill", function(d, i) { return color(i); })
    // transition 
    .transition()
    .ease(d3.easeLinear)
    .duration(2000)
    .attrTween("d", tweenPie);

    function tweenPie(b) {
        b.innerRadius = 0;
        var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
        return function(t) { return arc(i(t)); };
    }
    function onMouseOver(d,i){
        //increases the radius of the arc
        d3.select(this).transition()
        .duration(500)
        .attr("d", arc_onMouseOver)
        .style("stroke","black")
        .style("stroke-width",6);

        //appends the bin value text
        d3.select(this.parentNode).append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .attr("class","pie-label")
        .text(function(d, i) { return d.value; });
    };
    function onMouseOut(d,i){
        // decrease the radius on mouse out
        d3.select(this).transition()
        .duration(500)
        .attr("d", arc)
        .style("stroke","none");
        
        //remove the text
        d3.select(".pie-label").remove();
        }
                     

    // legend - Followed the tutorial from : http://zeroviscosity.com/d3-js-step-by-step/step-3-adding-a-legend
    var legendRectSize = 10;
    var legendSpacing = 4;
    var legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing;
        var offset =  height * color.domain().length / 2;
        var horz =  radius + 20;
        var vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
    });


    legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', color)
    .style('stroke', color);
 
    legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d,i) { return binRange[i]; });

}

// bins the array and draws bar/pie chart based on the shape passed
const draw = (props) => {
    var sbgContainerClass = "."+props.containerClass
    d3.select(sbgContainerClass+ '>*').remove();
    var data = props.varData;
    const margin = 20
    var nBins = props.nBins;
    const p_w = props.width;
    const p_h = props.height;
    var w,h;
    if(p_w != null && p_h != null){
        w = p_w - margin;
        h = p_h - margin;
    }
    else {
        console.log("ELSE CONDITION!!")
        w = Math.min(document.documentElement.clientWidth, window.innerWidth || 0) - margin
        h = Math.min(document.documentElement.clientHeight, window.innerHeight || 0) - margin
    }

    var max_d = Number.MIN_SAFE_INTEGER;
    var min_d = Number.MAX_SAFE_INTEGER;

    for(var i=0;i<data.length;i++){
        data[i] = parseFloat(data[i])
    }
    if(data[i] < 1){
        data = normalize_data(data);
    }
    for(var i=0;i<data.length;i++){
        if(data[i] > max_d)
            max_d = data[i]
        if(data[i] < min_d)
            min_d = data[i]
    }
    console.log("DATA:",data)
    // var max_d = d3.max(data);
    // var min_d = d3.min(data);
    console.log("MAX:",max_d);
    console.log("MIN:",min_d);
    var bin_size = parseInt((max_d - min_d)/nBins);
    if(bin_size == 0){
        nBins = 3;
        bin_size = parseInt((max_d - min_d)/nBins);
    }
    var binArray = []
    for(var i=0 ;i<nBins;i++){
        binArray.push(0)
    }

    for(var i=0;i<data.length;i++){
        var index = (data[i] - min_d)/bin_size;
        if(isNaN(index))
            continue;
        binArray[parseInt(index)%nBins]++;
    }
    console.log("BIN-SIZE",bin_size);
    var binRange = []
    for(var i=0;i<binArray.length;i++){
        var val = (i+1)* bin_size;
        binRange.push(val + " - " + (val+bin_size));
    }
    console.log("BINRANGE:",binRange)
    if(props.shape == "BAR")
        drawBarChart(binArray,margin,4*margin,nBins,w/2,h-h/4,props.onComponentClicked,binRange,sbgContainerClass)
    else if(props.shape == "CIRCLE")
        drawPieChart(binArray,nBins,w/2,h-h/3,margin,props.onComponentClicked,binRange,sbgContainerClass)

}

function drawForceLayout(data,width,height,nBins,min,max,onComponentClicked){
    d3.select('.canvas > *').remove();
    var groups = 4
    var nodes = [];
    for(var i=0;i<40;i++){
        nodes.push({id:i,group:i%4})
    }
    console.log(nodes);
    
    var links = []
    for(var i=0;i<nodes.length;i++){
        for(var j=0;j<nodes.length;j++){
            if(i == j)
                continue;
            links.push({target:j,source:i,value: Math.abs(i-j)})
        }
    }
    console.log(links)

    var svg = d3.select(".canvas").append("svg")
    .attr("width", width)
    .attr("height", height)

    const simulation = d3.forceSimulation()
  .force('charge', d3.forceManyBody().strength(-20)) 
  .force('center', d3.forceCenter(width / 2, height / 2))

  const nodeElements = svg.append('g')
  .selectAll('circle')
  .data(nodes)
  .enter().append('circle')
    .attr('r', 10)

    simulation.nodes(nodes).on('tick', () => {
        nodeElements
          .attr("cx", node => node.x)
          .attr("cy", node => node.y)
      })
      simulation.force('link', d3.forceLink()
      .id(link => link.id)
      .strength(link => link.strength))

      const linkElements = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
        .attr('stroke-width', 1)
        .attr('stroke', '#E5E5E5')
        .attr('stroke',"black")
    
        linkElements
        .attr('x1', link => link.source.x)
        .attr('y1', link => link.source.y)
        .attr('x2', link => link.target.x)
        .attr('y2', link => link.target.y)
    
        simulation.force('link').link(links)
    
        const dragDrop = d3.drag()
        .on('start', node => {
          node.fx = node.x
          node.fy = node.y
        })
        .on('drag', node => {
          simulation.alphaTarget(0.7).restart()
          node.fx = d3.event.x
          node.fy = d3.event.y
        })
        .on('end', node => {
          if (!d3.event.active) {
            simulation.alphaTarget(0)
          }
          node.fx = null
          node.fy = null
        })

}

function normalize_data(data){
    var output = []
    var max = d3.max(data);
    var min = d3.min(data);
    for(var i=0;i<data.length;i++){
        output[i] = ((data[i] - min )/ (max - min))*100;
    }
    return output;
}

export default draw;