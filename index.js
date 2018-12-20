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

  /** Create svg element */
  const svg = d3.select("main div#svg-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  ;

}