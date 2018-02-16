/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 173);
/******/ })
/************************************************************************/
/******/ ({

/***/ 173:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _d = __webpack_require__(90);

var d3 = _interopRequireWildcard(_d);

var _math = __webpack_require__(465);

var MyMath = _interopRequireWildcard(_math);

var _population_api = __webpack_require__(466);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Globals:
var deltaT = 1;
var isPaused = false;
var score = 0;
var data = [];
var queue = [];
var rScale = d3.scaleLinear() // radius scale
.range([40, 500]); // width / number of data, divide 2 again cus this is radius scale
var mScale = d3.scaleLinear() // mass scale
.range([5, 50]);

// ----------------MAIN-------------------
// Note: Becuase I add this script on top of the html file, so I need to make
// an event listener to wait for all content loaded before running the code.
// If you don't want to add event, then simple add the script at the end of the html file
document.addEventListener("DOMContentLoaded", function () {
  d3.csv("./data/change.csv", function (d) {
    data = d3.shuffle(d.filter(function (row) {
      return row.population !== "..";
    })); //filter the empty popoulation row, and shuffle
  });

  var svg = d3.select("svg").attr("width", 800).attr("height", window.innerHeight - 20);

  var gameWidth = parseInt(svg.attr("width"));
  var gameHeight = parseInt(svg.attr("height"));

  // Add shield:
  var shieldR = 25;
  svg.append("svg:image").attr('x', gameWidth / 2).attr('y', gameHeight - 300).attr('width', shieldR * 2).attr('height', shieldR * 2).attr('r', shieldR) // for calculating
  .attr('cx', gameWidth / 2).attr('cy', gameHeight - 300).attr("id", "shield").attr("transform", "translate(-25, -25)").attr("xlink:href", "./images/shield.svg.png");

  // Add character:
  var characterR = 30;
  svg.append("svg:image").attr('x', gameWidth / 2).attr('y', gameHeight - characterR - 30).attr('width', characterR * 2).attr('height', characterR * 2).attr('r', characterR - 10) // for calculating
  .attr('cx', gameWidth / 2).attr('cy', gameHeight - characterR - 30).attr("id", "character").attr("transform", "translate(-30, -30)").attr("xlink:href", "./images/icons8-minion-50.png");

  // Mouse event:
  var shield = document.getElementById('shield');
  document.addEventListener("mousemove", function (e) {
    shield.setAttribute("x", e.pageX - 500); // shift because shield position depends on svg position
    shield.setAttribute("cx", e.pageX - 500);
  });

  // Pausing event:
  document.addEventListener("keydown", function (e) {
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
  var gameRule = document.getElementById('tutorial-button');
  gameRule.addEventListener("click", function () {
    isPaused = true;
    $("#pause").text("Paused");
    window.cancelAnimationFrame(frameId);

    var rule = document.getElementsByClassName('instruction-window-container')[0];
    var className = rule.getAttribute("class");
    className += " display-modal";
    rule.setAttribute("class", className);
  });

  // Close modal:
  var closes = document.getElementsByClassName("close");
  for (var i = 0; i < closes.length; i++) {
    closes[i].addEventListener("click", function () {
      isPaused = false;
      $("#pause").text("Playing");
      frameId = window.requestAnimationFrame(runFrame);

      var rule = document.getElementsByClassName('instruction-window-container')[0];
      var className = rule.getAttribute("class");
      if (className.slice(29) === "display-modal") {
        //check if this window is open
        className = className.slice(0, 28);
        rule.setAttribute("class", className);
      }

      var lose = document.getElementsByClassName('lose-window-container')[0];
      className = lose.getAttribute("class");
      console.log(className);
      if (className.slice(22) === "display-modal") {
        //check if this window is open
        className = className.slice(0, 21);
        lose.setAttribute("class", className);
        location.reload();
      }
    });
  }
  //----Game Loop-----:
  var idx = 1;
  var frameId = void 0;
  function runFrame(error) {
    // update domain: (doesnt work if put these lines above)
    rScale.domain([2851, 275067797]);
    mScale.domain([2851, 275067797]);

    // Loading data to queue:
    // idx = createUpdateCircles(idx, gameWidth, gameHeight);
    if (queue.length < 5) {
      // increase queue length by changing this number
      if (!data[idx]) idx++;else queue.push(data[idx++]);
    } else {
      var group = d3.select("svg").selectAll(".group");
      var groupEnter = group.data(queue).enter().append("g").attr("class", "group");
      groupEnter.append("circle").attr("cx", function (d) {
        return gameWidth / 6 + Math.random() * gameWidth / 3;
      }) //random position from 1/3 screen to 2/3 screen
      .attr("cy", function (d, i) {
        return i * -400;
      }).attr("r", function (d) {
        return rScale(d.population);
      }).attr("fill", function (d) {
        if (d.name[0] === "F") {
          return "lightcoral";
        } else {
          return "lightblue";
        }
      }).attr("fill-opacity", 0.7).attr("class", "data-circle").attr("m", function (d) {
        return mScale(d.population);
      }).attr("vx", 0) // initialize initial velocity:
      .attr("vy", 0);
      groupEnter.append("text").attr("fill", function (d) {
        if (d.name[0] === "F") {
          return "navy";
        } else {
          return "darkred";
        }
      }).attr("font-family", "sans-serif").attr("font-size", "15px").attr("text-anchor", "middle").text(function (d) {
        return d.country;
      });
      groupEnter.append("text").attr("fill", "black").attr("text-anchor", "middle").attr("font-family", "sans-serif").attr("dy", 20) //shift 10px down
      .text(function (d) {
        return d.population;
      });

      group.data(queue).exit().remove();
    }
    var character = document.getElementById('character');

    shieldCollision(idx);
    frameId = window.requestAnimationFrame(runFrame); // a better version of setInterval, call functino again inside function
    characterMove();
    characterCollision(frameId, idx); // have to call this after requestFrame..
  }
  frameId = window.requestAnimationFrame(runFrame); // start frame, use cancelAnimationFrame(frameId);
});

// -------Functions area -------
function characterCollision(frameId, idx) {
  var circles = document.getElementsByClassName("data-circle");
  var character = document.getElementById("character");
  for (var i = 0; i < circles.length; i++) {
    if (MyMath.detectCollision(circles[i], character)) {
      window.cancelAnimationFrame(frameId);
      showLoseWindow();
    }
  }
}

function showLoseWindow() {
  var loseWindow = document.getElementsByClassName('lose-window-container')[0];
  var className = loseWindow.getAttribute("class");
  className += " display-modal";
  loseWindow.setAttribute("class", className);
}

function shieldCollision(idx) {
  var circles = document.getElementsByClassName("data-circle");
  var shield = document.getElementById("shield");
  for (var i = 0; i < circles.length; i++) {
    // Physics:
    var Fnet = void 0;
    var hasCollision = false;
    if (MyMath.detectCollision(circles[i], shield)) {
      Fnet = MyMath.getFnet(MyMath.getFg(circles[i]), MyMath.getFs(circles[i], shield));

      hasCollision = true;
      score += 500 - parseInt(circles[i].getAttribute("r"));
      updateScore();
    } else Fnet = MyMath.getFnet(MyMath.getFg(circles[i]));
    MyMath.updatePos(circles[i], Fnet, deltaT);
    if (isOutOfFrame(circles[i])) {
      d3.select(circles[i].parentNode).remove(); //remove group (circle + text)
      queue.splice(idxToRemove(idx - 1), 1);
    }
  }
}

function updateScore() {
  var $scoreElement = $('#score');
  $scoreElement.text(score);
}

function isOutOfFrame(htmlCircle) {
  var cx = parseInt(htmlCircle.getAttribute("cx"));
  var cy = parseInt(htmlCircle.getAttribute("cy"));
  var r = parseInt(htmlCircle.getAttribute("r"));
  var leftBound = 0;
  var rightBound = parseInt(d3.select("svg").attr("width"));
  var bottomBound = parseInt(d3.select("svg").attr("height"));

  return cx + r <= leftBound || cx - r >= rightBound || cy + r > bottomBound;
}

function idxToRemove(dataIdx) {
  // get the object in data array, to use it to find the index in queue
  for (var i = 0; i < queue.length; i++) {
    if (data[dataIdx].Country === queue[i].Country) return i;
  }
}

function characterMove() {
  var circles = document.getElementsByClassName("data-circle");
  var character = document.getElementById("character");
  var distanceArr = [];
  for (var i = 0; i < circles.length; i++) {
    distanceArr.push(MyMath.getDistance(circles[i], character));
  }
  var closestCir = circles[distanceArr.indexOf(Math.min.apply(Math, distanceArr))];
  // Move left if closest circle on left side
  var charX = parseInt(character.getAttribute("x"));
  var cirX = parseInt(closestCir.getAttribute("cx"));
  if (cirX < charX && charX - cirX > 3) {
    // check if the x-diference is not smaller than 3,
    charX -= 3;
  } else if (cirX > charX && cirX - charX > 3) {
    // dont move char if x-difference is smaller than 3
    charX += 3;
  }
  character.setAttribute("x", charX);
  character.setAttribute("cx", charX);
}

/***/ }),

/***/ 465:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detectCollision = exports.getDistance = exports.vecMag = exports.divideVector = exports.multiplyVector = exports.addVector = exports.subtractVector = exports.vecPos = undefined;
exports.vecUnit = vecUnit;
exports.getFg = getFg;
exports.getFs = getFs;
exports.getFnet = getFnet;
exports.updatePos = updatePos;

var _d = __webpack_require__(90);

var d3 = _interopRequireWildcard(_d);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var vecPos = exports.vecPos = function vecPos(htmlCircle) {
  return [parseInt(htmlCircle.getAttribute("cx")), parseInt(htmlCircle.getAttribute("cy"))]; //  (x, y)
};

function vecUnit(vector) {
  var mag = vecMag(vector);
  return divideVector(vector, mag);
}

var subtractVector = exports.subtractVector = function subtractVector(vector1, vector2) {
  return [vector1[0] - vector2[0], vector1[1] - vector2[1]]; // (x1-x2, y1-y2)
};

var addVector = exports.addVector = function addVector(vector1, vector2) {
  return [vector1[0] + vector2[0], vector1[1] + vector2[1]]; // (x1+x2, y1+y2)
};

var multiplyVector = exports.multiplyVector = function multiplyVector(vector1, scalar) {
  return [vector1[0] * scalar, vector1[1] * scalar]; // (x1*x2, y1*y2)
};

var divideVector = exports.divideVector = function divideVector(vector1, scalar) {
  return [vector1[0] / scalar, vector1[1] / scalar]; // (x1*x2, y1*y2)
};

var vecMag = exports.vecMag = function vecMag(vector) {
  var x2 = Math.pow(vector[0], 2);
  var y2 = Math.pow(vector[1], 2);
  return Math.sqrt(x2 + y2); // sqrt(x^2 + y^2)
};

var getDistance = exports.getDistance = function getDistance(htmlCir1, htmlCir2) {
  var positionSub = subtractVector(vecPos(htmlCir1), vecPos(htmlCir2));
  return vecMag(positionSub);
};

var detectCollision = exports.detectCollision = function detectCollision(htmlCir1, htmlCir2) {
  // If the |position vector2 - position vector1| < (|radius1| + |radius2|)
  var positionMag = getDistance(htmlCir1, htmlCir2);
  var r1 = parseInt(htmlCir1.getAttribute("r"));
  var r2 = parseInt(htmlCir2.getAttribute("r"));
  var radiusMag = Math.abs(r1) + Math.abs(r2);
  return positionMag < radiusMag;
};

// Gravity force:
function getFg(htmlCir) {
  var a = [0, 9.8]; // gravity, positive 9.8 because origin on top, change to 1 becuase it so fast
  var m = parseInt(htmlCir.getAttribute("m"));
  return multiplyVector(a, m);
}

// Spring force: (in this we calcuate Fs from circle 2 applies on circle 1)
function getFs(htmlCir1, htmlCir2) {
  var k = 1000; // Spring constant 1000 seems nice
  var positionSub = subtractVector(vecPos(htmlCir1), vecPos(htmlCir2));
  var positionMag = vecMag(positionSub);
  var r1 = parseInt(htmlCir1.getAttribute("r"));
  var r2 = parseInt(htmlCir2.getAttribute("r"));
  var radiusMag = Math.abs(r1) + Math.abs(r2);
  var diff = radiusMag - positionMag; // find the x
  var norm = vecUnit(positionSub); // vector unit
  var scalar = k * diff; // k * x
  var Fs = multiplyVector(norm, scalar); // Fs = k * x * normVector
  return Fs;
}

function getFnet() {
  var Ftotal = [0, 0, 0];

  for (var _len = arguments.length, Fnet = Array(_len), _key = 0; _key < _len; _key++) {
    Fnet[_key] = arguments[_key];
  }

  for (var i = 0; i < Fnet.length; i++) {
    Ftotal = addVector(Ftotal, Fnet[i]); // Ftotal += Fnet[i]
  }
  return Ftotal;
}

function updatePos(htmlCir, Fnet, deltaT) {
  var m = parseInt(htmlCir.getAttribute("m"));
  var a = divideVector(Fnet, m); // a = F/m
  var adt = multiplyVector(a, deltaT); // a*dt

  var v = [parseInt(htmlCir.getAttribute("vx")), parseInt(htmlCir.getAttribute("vy"))]; // velocity
  v = addVector(v, adt); // v = v0 + a*dt
  htmlCir.setAttribute('vx', v[0]);
  htmlCir.setAttribute('vy', v[1]);
  var cx = parseInt(htmlCir.getAttribute("cx"));
  var cy = parseInt(htmlCir.getAttribute("cy"));
  cx = cx + v[0] * deltaT / 600;
  cy = cy + v[1] * deltaT / 600;
  // debugger
  htmlCir.setAttribute("cx", cx); //x = x0 + v*dt
  htmlCir.setAttribute("cy", cy);

  var parent = d3.select(htmlCir.parentNode);
  parent.selectAll("text") //also update text position
  // .attr("dx", -parent.select("circle").attr("r")/2)
  .attr("x", cx).attr("y", cy);
}

/***/ }),

/***/ 466:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var getPopulation = exports.getPopulation = function getPopulation(year, age) {
  return $.ajax({
    url: "http://api.population.io:80/1.0/population/" + year + "/aged/" + age + "/"
  });
};

/***/ }),

/***/ 90:
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/Users/kimvibui/Documents/Loc/data_block/node_modules/d3/index.js'");

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map