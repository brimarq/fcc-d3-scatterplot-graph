let json, req = new XMLHttpRequest();

/** Send http req */
req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json',true);
req.send();
req.onload = function() {
  json = JSON.parse(req.responseText);
  drawSvg();
};

/** Create hidden tooltip div */
const tooltip = d3.select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .each(function() {
    d3.select(this).append("span").attr("id", "cyclist");
    d3.select(this).append("span").attr("id", "stats");
    d3.select(this).append("span").attr("id", "thedope");
  })
;

function drawSvg() {

  /** Set initial svg dimensions to 16:10 ratio */
  const w = 800;
  const h = w / 1.6;

  /** Set "margins" for the chart */
  const margin = {top: h * .1, right: w * .07, bottom: h * .1, left: w * .06};

  /** Set width and height for the chart */
  const width = w - margin.left - margin.right;
  const height = h - margin.top - margin.bottom;

  /** Set dot colors */
  const dotColor = {
    dope: "hsla(0, 100%, 50%, 0.7)",
    nodope: "hsla(120, 100%, 40%, 0.7)",
    stroke: "#777"
  };

  /** Set the scales for x and y axes */
  const xScale = d3.scaleTime()
    .domain([
      new Date(d3.min(json, (d) => d.Year) - 1, 0), 
      new Date(d3.max(json, (d) => d.Year) + 1, 0)
      // new Date(d3.min(json, (d) => d.Year), 0), 
      // new Date(d3.max(json, (d) => d.Year), 0)
    ])
    .range([0 , width])
  ;

  const yScale = d3.scaleTime()
    .domain([
      new Date(0, 0, 1, 0, 0, d3.min(json, (d) => d.Seconds) - 5), 
      new Date(0, 0, 1, 0, 0, d3.max(json, (d) => d.Seconds) + 5)
      // new Date(0, 0, 1, 0, 0, d3.min(json, (d) => d.Seconds)), 
      // new Date(0, 0, 1, 0, 0, d3.max(json, (d) => d.Seconds))
    ])
    .range([0, height]) // keeps the plot right-side-up 
  ; 

  /** Axes to be called */
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  /** Create svg element */
  const svg = d3.select("main div#svg-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  ;

  /** Create svg defs */
  const defs = d3.select("svg").append("defs");

  /** Chart title text */
  svg.append("text")
    .attr("id", "title")
    .attr("x", (w / 2))
    .attr("y", margin.top / 4 * 3)
    .attr("fill", "#222")
    .style("text-anchor", "middle")
    .style("font-size", "1.25em")
    .style("font-weight", "bold")
    .text("Doping and Professional Cycling")
    .append("tspan")
    .attr("x", (w / 2))
    .attr("dy", 20)
    .attr("fill", "#222")
    .style("font-weight", "normal")
    .style("font-size", "0.7em")
    .text("1994 - 2015")
  ;

  /** Create scatterplot group */
  const scatterplot = svg.append("g")
    .attr("id", "scatterplot")
  ;

  /** Create dots from json data */
  scatterplot.selectAll("circle")
    .data(json)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => d3.format(".2~f")(xScale(new Date(d.Year, 0))))
    .attr("cy", (d) => d3.format(".2~f")(yScale(new Date(0, 0, 1, 0, 0, d.Seconds))))
    .attr("r", 7)
    .attr("data-xvalue", (d) => new Date(d.Year, 0))
    .attr("data-yvalue", (d) => new Date(0, 0, 1, 0, 0, d.Seconds))
    .attr("fill", function(d) {
      return d.Doping ? dotColor.dope : dotColor.nodope;
    })
    .attr("stroke", dotColor.stroke)
  ;

  /** Create scatterplot axes */
  // scatterplot x-axis 
  scatterplot.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  ;

  // scatterplot y-axis
  scatterplot.append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(0, 0)")
    .call(yAxis)
  ;

  // scatterplot y-axis label
  scatterplot.append("text")
    .attr("x", 25)
    .attr("y", height / 2 )
    .style("text-anchor", "middle")
    .text("Time in Minutes")
    .attr("transform", function(d) { 
      const x = d3.select(this).attr("x");
      const y = d3.select(this).attr("y");
      return "rotate(-90 " + x + " " + y + ")"
    })
  ;

  /** Legend for scatterplot, positioned on the right-edge */
  const legend = scatterplot.append("g")
    .attr("id", "legend")
    .attr("transform", "translate(" + width + ", " + 0 + ")")
    // .style("outline", "1px solid lime")
  ;

  // Create a rect for legend box that will center legend contents
  legend.append("rect")
    .attr("id", "legend-box")
    .attr("fill", "hsl(0, 0%, 96%)")
    .attr("rx", 8)
    .attr("ry", 8)
  ;
    
  // Group for legend text
  legend.append("g")
    .attr("id", "legend-text")
    .attr("font-size", ".8em")
    .style("text-anchor", "end")
    // .style("outline", "1px solid blue")
    .each(function() {
      d3.select(this).append("text")
        .attr("dy", "1em")
        .text("Cyclists with no doping allegations ")
        .append("tspan")
        .text("⬤")
        .attr("fill", dotColor.nodope)
      ;
      d3.select(this).append("text")
        .attr("dy", "2.5em")
        .text("Cyclists with doping allegations ")
        .append("tspan")
        .text("⬤")
        .attr("fill", dotColor.dope)
      ;
    })
  ;

  // Position the legend contents
  legend.each(function() {
    // set padding for the legend box
    const padding = {top: 10, right: 10, bottom: 10, left: 10};
    // get legend-text group bbox dimensions
    const legendText = {
      width: +d3.format(".2~f")(this.querySelector("g#legend-text").getBBox().width),
      height: +d3.format(".2~f")(this.querySelector("g#legend-text").getBBox().height)
    };

    // Calculate legend-box rect dimensions
    const box = {
      width: Math.round(padding.left + legendText.width + padding.right), 
      height: Math.round(padding.top + legendText.height + padding.bottom)
    };
    
    // Position legend-box and set dimensions
    d3.select("rect#legend-box")
      .attr("x", -box.width)
      .attr("y", 0)
      .attr("width", box.width)
      .attr("height", box.height)
    ;

    // Position legend-text group, centered "within" legend-box
    d3.select("g#legend-text")
      .attr("transform", "translate(" + -padding.right + ", " + padding.top + ")")
    ;
  });
  

  /** Now, get barChart bbox dimensions and bind data to barChart */
  scatterplot.each(function() {
    let data = {};
    data.bboxWidth = d3.format(".2~f")(this.getBBox().width);
    data.bboxHeight = d3.format(".2~f")(this.getBBox().height);
    d3.select("g#x-axis").each(function() {
      data.xAxisHeight = d3.format(".2~f")(this.getBBox().height)
    });
    d3.select("g#y-axis").each(function() {
      data.yAxisWidth = d3.format(".2~f")(this.getBBox().width)
    });
    d3.select(this).datum(data);
  });

  /** Center the scatterplot group in the svg */
  scatterplot.attr("transform", function(d) {
    let bboxWDiff = d.bboxWidth - width;
    let bboxHDiff = d.bboxHeight - height;
    let newX = Math.round(margin.left + (bboxWDiff / 2));
    let newY = Math.round(margin.top + (bboxHDiff / 2) - (d.xAxisHeight / 2));
    return "translate(" + newX + "," + newY + ")"
  });

  /** Hover effects for tooltip */
  scatterplot.selectAll(".dot")
    .on("mouseover", function(d) {
      let data = this.dataset, 
          cyclistText = d.Name + " (" + d.Nationality + ")",
          statsText = "Y: " + d.Year + ", T: " + d.Time
      ;
      
      tooltip
        .style("visibility", "visible")
        .attr("data-year", data.xvalue)
        .each(function() {
          d3.select("#cyclist").text(cyclistText).style("font-weight", "bold");
          d3.select("#stats").text(statsText);
          d3.select("#thedope").text(d.Doping);
        })
      ;
    })
    .on("mousemove", function(d) { 
      tooltip
        .style("top", (d3.event.pageY - 50) + "px")
        .style("left", (d3.event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
      tooltip.style("visibility", "hidden");
    })
  ;
  

  
}
