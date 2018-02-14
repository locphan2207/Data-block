import * as d3 from 'd3';
import * as MyMath from './math';

import {getPopulation} from './population_api';

const deltaT = 1;


let data = [];
let queue = [];

// Note: Becuase I add this script on top of the html file, so I need to make
// an event listener to wait for all content loaded before running the code.
// If you don't want to add event, then simple add the script at the end of the html file
document.addEventListener("DOMContentLoaded", () => {
  d3.csv("./data/change.csv", (d) => {
    data = d;
    console.log(d);
    console.log(data);
  });
  let svg = d3.select("svg")
    .attr("width",  window.innerWidth - 300)
    .attr("height", window.innerHeight);

  let rScale = d3.scaleLinear() // radius scale
    .domain([2851, 275067797])
    .range([100, 500]); // width / number of data, divide 2 again cus this is radius scale

  let mScale = d3.scaleLinear() // mass scale
    .domain([2851, 275067797])
    .range([50, 100]);

  //Create shield:
  svg.append("circle")
    .attr("cx", parseInt(svg.attr("width"))/2)
    .attr("cy", parseInt(svg.attr("height")) - 300)
    .attr("r", 15)
    .attr("id", "shield")
    .attr("fill", "red");

  //Find HTML elements:
  const shield = document.getElementById('shield');

  document.addEventListener("mousemove", (e) => {
    shield.setAttribute("cx", e.pageX);
  });

  //Game Loop:
  let idx = 0;
  const interval = setInterval(() => {
    if (queue.length < 3) {
      queue.push(data[idx++]);
      console.log(data);
      console.log(queue);
      const circle = svg.selectAll(".data-circle");
      circle
        .data(queue)
        .enter().append("circle")
          .attr("cx", parseInt(svg.attr("width"))/2 - 10)
          .attr("cy", (d, i) => -i * 1000)
          .attr("r", d => (rScale(d.population)) )
          .attr("fill", "steelblue")
          .attr("fill-opacity", 0.5)
          .attr("class", "data-circle")
          .attr("m", (d) => mScale(d.population) )
          .attr("vx", 0) // initialize initial velocity:
          .attr("vy", 0);
      circle.data(queue).exit().remove();
    }


    const circles = document.getElementsByClassName("data-circle");

    for (let i = 0; i < circles.length; i++) {
      let Fnet;
      let hasCollision = false;
      if (MyMath.detectCollision(circles[i], shield)) {
        Fnet = MyMath.getFnet(
          MyMath.getFg(circles[i]),
          MyMath.getFs(circles[i], shield)
        );
        hasCollision = true;
      } else Fnet = MyMath.getFnet(MyMath.getFg(circles[i]));
      MyMath.updatePos(circles[i], Fnet, deltaT);
      console.log(queue);
      if (isOutOfFrame(circles[i])) {
        circles[i].remove();
        queue = queue.slice(1);
      }
    }
  }, deltaT);
});

function isOutOfFrame(htmlCircle) {
  const cx = parseInt(htmlCircle.getAttribute("cx"));
  const cy = parseInt(htmlCircle.getAttribute("cy"));
  const r = parseInt(htmlCircle.getAttribute("r"));
  const leftBound = 0;
  const rightBound = parseInt(d3.select("svg").attr("width"));
  const bottomBound = parseInt(d3.select("svg").attr("height"));

  return ((cx+r)<=leftBound || (cx-r)>=rightBound || (cy+r)>bottomBound);
}

function loadJSONtoData(year, age) {
  getPopulation(year, age)
    .then((response) => {
      data = response;
    });
}
