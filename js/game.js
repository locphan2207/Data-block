import * as d3 from 'd3';
import * as MyMath from './math';

// Note: Becuase I add this script on top of the html file, so I need to make
// an event listener to wait for all content loaded before running the code.
// If you don't want to add event, then simple add the script at the end of the html file

let data = [12, 34, 100, 200, 400];
const queue = [];

document.addEventListener("DOMContentLoaded", () => {
  let svg = d3.select("svg")
    .attr("width",  window.innerWidth - 300)
    .attr("height", window.innerHeight);

  let rScale = d3.scaleLinear()
    .domain([12, 400])
    .range([10, 100]); // width / number of data, divide 2 again cus this is radius scale

  svg.append("circle")
    .attr("cx", parseInt(svg.attr("width"))/2)
    .attr("cy", parseInt(svg.attr("height")) - 400)
    .attr("r", 50)
    .attr("id", "shield")
    .attr("fill", "red");

  let circle= svg.selectAll("circle")
    .data(data);

  circle.enter().append("circle")
    .attr("cx", (d, i) => (i * svg.attr("width")/(data.length) + 30))
    .attr("cy", 100)
    .attr("r", d => (rScale(d)) )
    .attr("fill", "steelblue")
    .attr("fill-opacity", 0.5)
    .attr("class", "data-circle");

  const circles = document.getElementsByClassName("data-circle");
  const shield = document.getElementById('shield');
  const interval = setInterval(() => {
    for (let i = 0; i < circles.length; i++) {
      const cy = parseInt(circles[i].getAttribute("cy"));
      const r = parseInt(circles[i].getAttribute("r"));
      circles[i].setAttribute("cy", cy + 100);
      console.log(circles[i]);
      console.log(shield);
      if (MyMath.detectCollision(circles[i], shield)) {
        clearInterval(interval);
      }

      if (isOutOfFrame(circles[i])) {
        circles[i].remove();
      }
    }
  }, 1000);
});

function isOutOfFrame(htmlCircle) {
  const cx = parseInt(htmlCircle.getAttribute("cx"));
  const cy = parseInt(htmlCircle.getAttribute("cy"));
  const r = parseInt(htmlCircle.getAttribute("r"));
  const leftBound = 0;
  const rightBound = parseInt(d3.select("svg").attr("width"));
  const bottomBound = parseInt(d3.select("svg").attr("height"));

  return ((cx+r)<leftBound || (cx-r)>rightBound || (cy+r)>bottomBound);
}


// Momemtum = Mass * Velocity
// p = F * dt
// v = p/m = a * dt
// pos =
