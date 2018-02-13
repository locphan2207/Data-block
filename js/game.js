import * as d3 from 'd3';
import * as MyMath from './math';

// Note: Becuase I add this script on top of the html file, so I need to make
// an event listener to wait for all content loaded before running the code.
// If you don't want to add event, then simple add the script at the end of the html file

let data = [{r: 12}, {r: 34}, {r: 100}, {r: 200}, {r: 400}];
const queue = [];

document.addEventListener("DOMContentLoaded", () => {
  let svg = d3.select("svg")
    .attr("width",  window.innerWidth - 300)
    .attr("height", window.innerHeight);

  let rScale = d3.scaleLinear()
    .domain([12, 400])
    .range([10, 100]); // width / number of data, divide 2 again cus this is radius scale

  const simulation = d3.forceSimulation(queue)
  .force('collide', d3.forceCollide().radius((d) => rScale(d.r)))
  .force("y", d3.forceY().strength(0.005).y(4000))
  .force("x", d3.forceX().strength(0.005).x(svg.attr("width")/2))
  .on("tick", ticked);

  function update() {
    const circles = d3.select("svg").selectAll("circle")
      .data(queue);
    circles.exit().remove();
    const entered = circles.enter().append("circle")
      .attr("r", (d) => rScale(d.r))
      .attr("cx", (d) => 500 + Math.random() * 100)
      .attr("cy", (d) => (d.y))
      .attr("fill", "red")
      .attr("fill-opacity", 0.2);
    simulation.nodes(queue);  // call animation again with updated queue
  }

  function ticked() {
    d3.select("svg").selectAll("circle")
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`);
  }

  let idx = 0;
  const interval = d3.interval(() => {
    queue.push(data[idx++]);
    update();
    if (idx >= data.length) interval.stop();
  }, 200);
});


// let circle= svg.selectAll("circle")
//   .data(data);
//
// circle.enter().append("circle")
//   .attr("cx", (d, i) => (i * svg.attr("width")/(data.length) + 30))
//   .attr("cy", 100)
//   .attr("r", d => (rScale(d)) )
//   .attr("fill", "steelblue")
//   .attr("fill-opacity", 0.5)
//   .attr("class", "data-circle");
//
// const circles = document.getElementsByClassName("data-circle");
// const interval = setInterval(() => {
//   for (let i = 0; i < circles.length; i++) {
//     const cy = parseInt(circles[i].getAttribute("cy"));
//     const r = parseInt(circles[i].getAttribute("r"));
//     circles[i].setAttribute("cy", cy + 1);
//
//     if (isOutOfFrame(circles[i])) {
//       circles[i].remove();
//     }
//   }
// }, 10);
// const isOutOfFrame = (htmlCircle) => {
//   const cx = parseInt(htmlCircle.getAttribute("cx"));
//   const cy = parseInt(htmlCircle.getAttribute("cy"));
//   const r = parseInt(htmlCircle.getAttribute("r"));
//   const leftBound = 0;
//   const rightBound = parseInt(d3.select("svg").attr("width"));
//   const bottomBound = parseInt(d3.select("svg").attr("height"));
//
//   return ((cx+r)<leftBound || (cx-r)>rightBound || (cy+r)>bottomBound);
// };
// Momemtum = Mass * Velocity
// p = F * dt
// v = p/m = a * dt
// pos =
