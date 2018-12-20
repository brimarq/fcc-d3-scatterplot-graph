let json, req = new XMLHttpRequest();

/** Send http req */
req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json',true);
req.send();
req.onload = function() {
  json = JSON.parse(req.responseText);
  // d3.select("div#svg-container")
  //   .text(JSON.stringify(json));
  // drawSvg();
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