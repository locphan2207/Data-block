import * as d3 from 'd3';

// Note: Becuase I add this script on top of the html file, so I need to make
// an event listener to wait for all content loaded before running the code.
// If you don't want to add event, then simple add the script at the end of the html file
document.addEventListener("DOMContentLoaded", () => {

  console.log(d3);
  console.log(window.innerHeight);

  let svg = d3.select("svg")
    .attr("width",  window.innerWidth/2)
    .attr("height", window.innerHeight/2);

  console.log(svg);

  let circle = svg.append("circle")
    .attr("cx", 100)
    .attr("cy", 100)
    .attr("r", 40)
    .attr("fill", "steelblue")
    .attr("fill-opacity", 0.5);

  let circle2 = svg.append("circle")
    .attr("cx", 300)
    .attr("cy", 100)
    .attr("r", 40)
    .attr("fill", "red")
    .attr("fill-opacity", 0.5);

    console.log(circle.attr("cx"));

  const frameLoop = setInterval(() => {
    const prevX1 = circle.attr("cx");
    circle.transition()
      .attr("cx", parseInt(prevX1) + 10);
    console.log("frame loop");
    console.log(circle.attr("cx"));
    console.log(circle2.attr("cx"));
  }, 500);

  if (circle.attr("cx") > circle2.attr("cx")) {
    clearInterval(frameLoop);
    console.log('clear interval');
  }


});
