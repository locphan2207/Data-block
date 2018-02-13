import * as d3 from 'd3';
import * as MyMath from './math';

// Note: Becuase I add this script on top of the html file, so I need to make
// an event listener to wait for all content loaded before running the code.
// If you don't want to add event, then simple add the script at the end of the html file
const deltaT = 1;

let data = [12, 34, 100, 200, 400];
const queue = [];

document.addEventListener("DOMContentLoaded", () => {
  let svg = d3.select("svg")
    .attr("width",  window.innerWidth - 300)
    .attr("height", window.innerHeight);

  let rScale = d3.scaleLinear() // radius scale
    .domain([12, 400])
    .range([10, 100]); // width / number of data, divide 2 again cus this is radius scale

  let mScale = d3.scaleLinear() // mass scale
    .domain([12, 400])
    .range([1, 10]);

  //Create shield:
  svg.append("circle")
    .attr("cx", parseInt(svg.attr("width"))/2)
    .attr("cy", parseInt(svg.attr("height")) - 400)
    .attr("r", 50)
    .attr("id", "shield")
    .attr("fill", "red");

  //Create falling objects:
  let circle= svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
      .attr("cx", (d, i) => (i * svg.attr("width")/(data.length) + 30))
      .attr("cy", 100)
      .attr("r", d => (rScale(d)) )
      .attr("fill", "steelblue")
      .attr("fill-opacity", 0.5)
      .attr("class", "data-circle")
      .attr("m", (d) => mScale(d) )
      .attr("vx", 0) //initialize initial velocity:
      .attr("vy", 0);

  //Physics constants:
  const Fg = [0, 9.8]; // F gravity, positive 9.8 because origin on top
  //Find HTML elements:
  const circles = document.getElementsByClassName("data-circle");
  const shield = document.getElementById('shield');
  //Game Loop:
  const interval = setInterval(() => {
    for (let i = 0; i < circles.length; i++) {
      //update pos here:

      console.log(circles[i]);
      console.log(shield);
      if (MyMath.detectCollision(circles[i], shield)) {
        clearInterval(interval);
      }

      if (isOutOfFrame(circles[i])) {
        circles[i].remove();
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

  return ((cx+r)<leftBound || (cx-r)>rightBound || (cy+r)>bottomBound);
}

function getFnet(...Fnet) {
  let Ftotal = [0,0,0];
  for (let i = 0; i < Fnet.length; i++) {
    Ftotal = MyMath.addVector(Ftotal, Fnet[i]); // Ftotal += Fnet[i]
  }
  return Ftotal;
}

function updatePos(htmlCir, Fnet) {
  const m = parseInt(htmlCir.getAttribute("m"));
  const a = MyMath.divideVector(Fnet, m);  // a = F/m
  const adt = MyMath.multiplyVector(a, deltaT); // a*dt

  const v = [parseInt(htmlCir.getAttribute("vx")),
    parseInt(htmlCir.getAttribute("vx"))]; // velocity
  v = MyMath.addVector(v, adt); // v = v0 + a*dt

  const cx = parseInt(htmlCir.getAttribute("cx"));
  const cy = parseInt(htmlCir.getAttribute("cy"));
  htmlCir.setAttribute("cx", cx + v[0]*deltaT + 0.5*a[0]*Math.pow(deltaT,2)); //x = x0 + v*dt + a*dt^2
  htmlCir.setAttribute("cy", cy + v[1]*deltaT + 0.5*a[1]*Math.pow(deltaT,2));
}



// Momemtum = Mass * Velocity
// p = F * dt
// v = p/m = a * dt
// pos =
