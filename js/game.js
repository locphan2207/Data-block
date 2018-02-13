import * as d3 from 'd3';
import * as MyMath from './math';

// Note: Becuase I add this script on top of the html file, so I need to make
// an event listener to wait for all content loaded before running the code.
// If you don't want to add event, then simple add the script at the end of the html file

const data = [12, 34, 100, 200, 400];
const gravityConst = 9.8; //  m/s^2

document.addEventListener("DOMContentLoaded", () => {
  let svg = d3.select("svg")
    .attr("width",  window.innerWidth - 300)
    .attr("height", window.innerHeight);

  let rScale = d3.scaleLinear()
    .domain([Math.min(...data), Math.max(...data)])
    .domain([Math.min(...data), Math.max(...data)])

    .range([10, svg.attr("width")/(2 * data.length)]); // width / number of data, divide 2 again cus this is radius scale
                                                      // each data, has their own section

  let circle= svg.selectAll("circle")
    .data(data);

  circle.enter().append("circle")
    .attr("cx", (d, i) => (i * svg.attr("width")/(data.length) + 30))
    .attr("cy", 100)
    .attr("r", d => (rScale(d)) )
    .attr("fill", "steelblue")
    .attr("fill-opacity", 0.5)
    .attr("class", "data-circle");

  // circle.data()
  //   .attr("cx",
  // const prevY = circle.data().attr("cy");
  const circles = document.getElementsByClassName("data-circle");
  const interval = setInterval(() => {
    for (let i = 0; i < circles.length; i++) {
      const cy = parseInt(circles[i].getAttribute("cy"));
      const r = parseInt(circles[i].getAttribute("r"));
      circles[i].setAttribute("cy", cy + 1);

      if (isOutOfFrame(circles[i])) {
        circles[i].remove();
      }
    }
  }, 10);
});

const isOutOfFrame = (htmlCircle) => {
  const cx = parseInt(htmlCircle.getAttribute("cx"));
  const cy = parseInt(htmlCircle.getAttribute("cy"));
  const r = parseInt(htmlCircle.getAttribute("r"));
  const leftBound = 0;
  const rightBound = parseInt(d3.select("svg").attr("width"));
  const bottomBound = parseInt(d3.select("svg").attr("height"));

  return ((cx+r)<leftBound || (cx-r)>rightBound || (cy+r)>bottomBound);
};
// Position = Mass * Velocity
