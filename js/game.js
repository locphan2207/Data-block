import * as d3 from 'd3';
import * as MyMath from './math';

import {getPopulation} from './population_api';

// Globals:
const deltaT = 1;
let isPaused = false;
let score = 0;
let data = [];
let queue = [];
let rScale = d3.scaleLinear() // radius scale
  .range([40, 500]); // width / number of data, divide 2 again cus this is radius scale
let mScale = d3.scaleLinear() // mass scale
  .range([5, 50]);

// ----------------MAIN-------------------
// Note: Becuase I add this script on top of the html file, so I need to make
// an event listener to wait for all content loaded before running the code.
// If you don't want to add event, then simple add the script at the end of the html file
document.addEventListener("DOMContentLoaded", () => {
  d3.csv("./data/change.csv", (d) => {
    data = d3.shuffle(d.filter(row => row.population !== "..")); //filter the empty popoulation row, and shuffle
  });

  let svg = d3.select("svg")
    .attr("width",  800)
    .attr("height", window.innerHeight - 20);

  const gameWidth = parseInt(svg.attr("width"));
  const gameHeight = parseInt(svg.attr("height"));


  // Add shield:
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
    .attr("transform", "translate(-25, -25)")
    .attr("xlink:href", "./images/shield.svg.png");

  // Add character:
  const characterR = 30;
  svg.append("svg:image")
    .attr('x', gameWidth/2)
    .attr('y', gameHeight - characterR - 30)
    .attr('width', characterR * 2)
    .attr('height', characterR * 2)
    .attr('r', characterR - 10) // for calculating
    .attr('cx', gameWidth/2)
    .attr('cy', gameHeight - characterR - 30)
    .attr("id", "character")
    .attr("transform", "translate(-30, -30)")
    .attr("xlink:href", "./images/icons8-minion-50.png");

  // Mouse event:
  const shield = document.getElementById('shield');
  document.addEventListener("mousemove", (e) => {
    shield.setAttribute("x", e.pageX - 500); // shift because shield position depends on svg position
    shield.setAttribute("cx", e.pageX - 500);
  });

  // Pausing event:
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      if (!isPaused) {
        isPaused = true;
        console.log(isPaused);
        $("#pause").text("Paused");
        window.cancelAnimationFrame(frameId);
      } else {
        isPaused = false;
        $("#pause").text("Playing");
        console.log(isPaused);
        frameId = window.requestAnimationFrame(runFrame);
      }
    }
  });

  // Event to show tutorial modal:
  const gameRule = document.getElementById('tutorial-button');
  gameRule.addEventListener("click", () => {
    isPaused = true;
    $("#pause").text("Paused");
    window.cancelAnimationFrame(frameId);

    const rule = document.getElementsByClassName('instruction-window-container')[0];
    let className = rule.getAttribute("class");
    className += " display-modal";
    rule.setAttribute("class", className);
  });

  // Close modal:
  const closes = document.getElementsByClassName("close");
  for (let i = 0; i < closes.length; i++) {
    closes[i].addEventListener("click", () => {
      isPaused = false;
      $("#pause").text("Playing");
      frameId = window.requestAnimationFrame(runFrame);

      const rule = document.getElementsByClassName('instruction-window-container')[0];
      let className = rule.getAttribute("class");
      if (className.slice(29) === "display-modal") {  //check if this window is open
        className = className.slice(0, 28);
        rule.setAttribute("class", className);
      }

      const lose = document.getElementsByClassName('lose-window-container')[0];
      className = lose.getAttribute("class");
      console.log(className);
      if (className.slice(22) === "display-modal") {  //check if this window is open
        className = className.slice(0, 21);
        lose.setAttribute("class", className);
        location.reload();
      }
    });
  }
  //----Game Loop-----:
  let idx = 1;
  let frameId;
  function runFrame(error) {
    // update domain: (doesnt work if put these lines above)
    rScale.domain([2851, 275067797]);
    mScale.domain([2851, 275067797]);

    // Loading data to queue:
    // idx = createUpdateCircles(idx, gameWidth, gameHeight);
    if (queue.length < 5) { // increase queue length by changing this number
      if (!data[idx]) idx++;
      else queue.push(data[idx++]);
    } else {
      const group = d3.select("svg").selectAll(".group");
      const groupEnter = group
        .data(queue)
        .enter().append("g").attr("class", "group");
      groupEnter
        .append("circle")
          .attr("cx", (d) => gameWidth/6 + Math.random()*gameWidth/3 ) //random position from 1/3 screen to 2/3 screen
          .attr("cy", (d,i) => i*-400)
          .attr("r", d => rScale(d.population))
          .attr("fill", (d) => {
            if (d.name[0] === "F") {
              return "lightcoral";
            } else {
              return "lightblue";
            }
          })
          .attr("fill-opacity", 0.7)
          .attr("class", "data-circle")
          .attr("m", (d) => mScale(d.population) )
          .attr("vx", 0) // initialize initial velocity:
          .attr("vy", 0);
      groupEnter
        .append("text")
          .attr("fill", (d) => {
            if (d.name[0] === "F") {
              return "navy";
            } else {
              return "darkred";
            }
          })
          .attr("font-family", "sans-serif")
          .attr("font-size", "15px")
          .attr("text-anchor", "middle")
          .text((d) => d.country);
      groupEnter
        .append("text")
          .attr("fill", "black")
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("dy", 20) //shift 10px down
          .text((d) => d.population);

      group.data(queue).exit().remove();
    }
    const character = document.getElementById('character');

    shieldCollision(idx);
    frameId = window.requestAnimationFrame(runFrame); // a better version of setInterval, call functino again inside function
    characterMove();
    characterCollision(frameId, idx); // have to call this after requestFrame..
  }
  frameId = window.requestAnimationFrame(runFrame); // start frame, use cancelAnimationFrame(frameId);
});

// -------Functions area -------
function characterCollision(frameId, idx) {
  const circles = document.getElementsByClassName("data-circle");
  const character = document.getElementById("character");
  for (let i = 0; i < circles.length; i++) {
    if (MyMath.detectCollision(circles[i], character)) {
      window.cancelAnimationFrame(frameId);
      showLoseWindow();
    }
  }
}

function showLoseWindow() {
  const loseWindow = document.getElementsByClassName('lose-window-container')[0];
  let className = loseWindow.getAttribute("class");
  className += " display-modal";
  loseWindow.setAttribute("class", className);
}

function shieldCollision(idx) {
  const circles = document.getElementsByClassName("data-circle");
  const shield = document.getElementById("shield");
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
      score += 500 - parseInt(circles[i].getAttribute("r"));
      updateScore();

    } else Fnet = MyMath.getFnet(MyMath.getFg(circles[i]));
    MyMath.updatePos(circles[i], Fnet, deltaT);
    if (isOutOfFrame(circles[i])) {
      d3.select(circles[i].parentNode).remove(); //remove group (circle + text)
      queue.splice(idxToRemove(idx-1), 1);
    }
  }
}

function updateScore() {
  const $scoreElement = $('#score');
  $scoreElement.text(score);
}

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

function characterMove() {
  const circles = document.getElementsByClassName("data-circle");
  const character = document.getElementById("character");
  const distanceArr = [];
  for (let i = 0; i < circles.length; i++) {
    distanceArr.push(MyMath.getDistance(circles[i], character));
  }
  const closestCir = circles[distanceArr.indexOf(Math.min(...distanceArr))];
  // Move left if closest circle on left side
  let charX = parseInt(character.getAttribute("x"));
  let cirX = parseInt(closestCir.getAttribute("cx"));
  if ((cirX < charX) && (charX - cirX) > 3) { // check if the x-diference is not smaller than 3,
    charX -= 3;
  } else if ((cirX > charX) && (cirX - charX) > 3) {  // dont move char if x-difference is smaller than 3
    charX += 3;
  }
  character.setAttribute("x", charX);
  character.setAttribute("cx", charX);
}
