let json, req = new XMLHttpRequest();

/** Send http req */
req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json',true);
req.send();
req.onload = function() {
  json = JSON.parse(req.responseText);
  // d3.select("div#svg-container")
  //   .text(JSON.stringify(json));
  drawSvg();
};

/** Create hidden tooltip div */
const tooltip = d3.select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  // .each( function() {
  //   d3.select(this).append("span").attr("id", "date");
  //   d3.select(this).append("span").attr("id", "gdp");
  // })
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


  /** Set the scales for x and y axes */
  const xScale = d3.scaleTime()
    .domain([
      new Date(d3.min(json, (d) => d.Year) - 1, 0), 
      new Date(d3.max(json, (d) => d.Year) + 1, 0)
    ])
    .range([0 , width])
  ;
  const yScale = d3.scaleTime()
    .domain([
      new Date(0, 0, 1, 0, 0, d3.min(json, (d) => d.Seconds)), 
      new Date(0, 0, 1, 0, 0, d3.max(json, (d) => d.Seconds))
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

  const scatterplot = svg.append("g")
    .attr("id", "scatterplot")
  ;

  /** Create bars from json data */
  scatterplot.selectAll("circle")
    .data(json)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => d3.format(".2~f")(xScale(new Date(d.Year, 0))))
    .attr("cy", (d) => d3.format(".2~f")(yScale(new Date(0, 0, 1, 0, 0, d.Seconds))))
    .attr("r", 7)
    .attr("data-xvalue", (d) => d3.format(".2~f")(xScale(new Date(d.Year, 0))))
    .attr("data-yvalue", (d) => d3.format(".2~f")(yScale(new Date(0, 0, 1, 0, 0, d.Seconds))))
    .attr("fill", function(d) {
      return d.Doping ? "hsla(0, 100%, 50%, 0.5)" : "hsla(120, 100%, 50%, 0.5)";
    })
  ;

  /** Create barChart axes */
  // barChart x-axis 
  scatterplot.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  ;

  // barChart y-axis
  scatterplot.append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(0, 0)")
    .call(yAxis)
  ;

  // barChart y-axis label
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

  /** Center the barChart group in the svg */
  scatterplot.attr("transform", function(d) {
    let bboxWDiff = d.bboxWidth - width;
    let bboxHDiff = d.bboxHeight - height;
    let newX = Math.round(margin.left + (bboxWDiff / 2));
    let newY = Math.round(margin.top + (bboxHDiff / 2) - (d.xAxisHeight / 2));
    return "translate(" + newX + "," + newY + ")"
  });

}