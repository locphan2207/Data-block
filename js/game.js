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
    data = d.filter(row => row.population != ".."); //filter the empty popoulation row
  });
  let svg = d3.select("svg")
    .attr("width",  800)
    .attr("height", window.innerHeight);

  const gameWidth = parseInt(svg.attr("width"));
  const gameHeight = parseInt(svg.attr("height"));

  let rScale = d3.scaleLinear() // radius scale
    .range([40, 500]); // width / number of data, divide 2 again cus this is radius scale

  let mScale = d3.scaleLinear() // mass scale
    .range([5, 50]);

  //Create shield:
  // svg.append("circle");
  //   .attr("cx", gameWidth/2)
  //   .attr("cy", parseInt(svg.attr("height")) - 300)
  //   .attr("r", 25)
  //   // .attr("id", "shield")
  //   .attr("fill", "red");

  const shieldR = 25;
  svg.append("svg:image")
    .attr('x', gameWidth/2)
    .attr('y', gameHeight - 300)
    .attr('width', shieldR * 2)
    .attr('height', shieldR * 2)
    .attr('r', shieldR) // for calculating
    .attr('cx', gameWidth/2)
    .attr('cy', gameHeight - 300)
    .attr("id", "shield")
    .attr("xlink:href", "./images/shield.svg.png");

  //Find HTML elements:
  const shield = document.getElementById('shield');

  document.addEventListener("mousemove", (e) => {
    shield.setAttribute("x", e.pageX);
    shield.setAttribute("cx", e.pageX);
  });

  //Game Loop:
  let idx = 0;
  const runFrame = () => {
    // update domain: (doesnt work if put these lines above)
    rScale.domain([2851, 275067797]);
    mScale.domain([2851, 275067797]);

    // Loading data to queue
    if (queue.length < 3) { // increase queue length by changing this number
      queue.push(data[idx++]);
      console.log(queue);
      const group = svg.selectAll(".group");
      const groupEnter = group
        .data(queue)
        .enter().append("g").attr("class", "group");
      groupEnter
        .append("circle")
          .attr("cx", (d) => gameWidth/6 + Math.random()*gameWidth/3 ) //random position from 1/3 screen to 2/3 screen
          .attr("cy", (d,i) => -400)
          .attr("r", d => rScale(d.population))
          .attr("fill", "steelblue")
          .attr("fill-opacity", 0.5)
          .attr("class", "data-circle")
          .attr("m", (d) => mScale(d.population) )
          .attr("vx", 0) // initialize initial velocity:
          .attr("vy", 0);
      groupEnter
        .append("text")
          .attr("fill", "darkred")
          .attr("font-family", "sans-serif")
          .attr("font-size", "15px")
          .text((d) => d.country);
      groupEnter
        .append("text")
          .attr("fill", "black")
          .attr("font-family", "sans-serif")
          .attr("dy", 20) //shift 10px down
          .text((d) => d.population);

      group.data(queue).exit().remove();
    }

    const circles = document.getElementsByClassName("data-circle");
    for (let i = 0; i < circles.length; i++) {
      // Physics:
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
      if (isOutOfFrame(circles[i])) {
        d3.select(circles[i].parentNode).remove(); //remove group (circle + text)
        queue.splice(idxToRemove(idx-1), 1);
        // queue = queue.slice(1);
      }
    }

    window.requestAnimationFrame(runFrame); // a better version of setInterval, call functino again inside function
  };
  window.requestAnimationFrame(runFrame); // stop frame, use cancelAnimationFrame(frameId);
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

function idxToRemove(dataIdx) { // get the object in data array, to use it to find the index in queue
  for( let i = 0; i < queue.length; i ++) {
    if (data[dataIdx].Country === queue[i].Country) return i;
  }
}
