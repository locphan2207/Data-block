export const vecPos = (htmlCircle) => {
  return [parseInt(htmlCircle.getAttribute("cx")),
    parseInt(htmlCircle.getAttribute("cy"))];  //  (x, y)
};

export function vecUnit(vector) {
  const mag = vecMag(vector);
  return divideVector(vector, mag);
}

export const subtractVector = (vector1, vector2) => {
  return [vector1[0] - vector2[0], vector1[1] - vector2[1]];  // (x1-x2, y1-y2)
};

export const addVector = (vector1, vector2) => {
  return [vector1[0] + vector2[0], vector1[1] + vector2[1]];  // (x1+x2, y1+y2)
};

export const multiplyVector = (vector1, scalar) => {
  return [vector1[0] * scalar, vector1[1] * scalar];  // (x1*x2, y1*y2)
};

export const divideVector = (vector1, scalar) => {
  return [vector1[0] / scalar, vector1[1] / scalar];  // (x1*x2, y1*y2)
};

export const vecMag = (vector) => {
  const x2 = Math.pow(vector[0], 2);
  const y2 = Math.pow(vector[1], 2);
  return Math.sqrt(x2 + y2); // sqrt(x^2 + y^2)
};

export const detectCollision = (htmlCir1, htmlCir2) => {
  // If the |position vector2 - position vector1| < (|radius1| + |radius2|)
  const positionSub = subtractVector(vecPos(htmlCir1), vecPos(htmlCir2));
  const positionMag = vecMag(positionSub);
  const r1 = parseInt(htmlCir1.getAttribute("r"));
  const r2 = parseInt(htmlCir2.getAttribute("r"));
  const radiusMag = Math.abs(r1) +  Math.abs(r2);
  return positionMag < radiusMag;
};

// Gravity force:
export function getFg(htmlCir) {
  const a = [0, 1]; // gravity, positive 9.8 because origin on top, change to 1 becuase it so fast
  const m = parseInt(htmlCir.getAttribute("m"));
  return multiplyVector(a, m);
}

// Spring force: (in this we calcuate Fs from circle 2 applies on circle 1)
export function getFs(htmlCir1, htmlCir2) {
  const k = 500; // Spring constant 1000 seems nice
  const positionSub = subtractVector(vecPos(htmlCir1), vecPos(htmlCir2));
  const positionMag = vecMag(positionSub);
  const r1 = parseInt(htmlCir1.getAttribute("r"));
  const r2 = parseInt(htmlCir2.getAttribute("r"));
  const radiusMag = Math.abs(r1) +  Math.abs(r2);
  const diff = radiusMag - positionMag; // find the x
  const norm = vecUnit(positionSub);  // vector unit
  const scalar = k * diff;  // k * x
  const Fs =  multiplyVector(norm, scalar); // Fs = k * x * normVector
  return Fs;
}

export function getFnet(...Fnet) {
  // console.log(Fnet);
  let Ftotal = [0,0,0];
  for (let i = 0; i < Fnet.length; i++) {
    Ftotal = addVector(Ftotal, Fnet[i]); // Ftotal += Fnet[i]
  }
  return Ftotal;
}

export function updatePos(htmlCir, Fnet, deltaT) {
  const m = parseInt(htmlCir.getAttribute("m"));
  const a = divideVector(Fnet, m);  // a = F/m
  const adt = multiplyVector(a, deltaT); // a*dt

  let v = [parseInt(htmlCir.getAttribute("vx")),
    parseInt(htmlCir.getAttribute("vy"))]; // velocity
  v = addVector(v, adt); // v = v0 + a*dt
  htmlCir.setAttribute('vx', v[0]);
  htmlCir.setAttribute('vy', v[1]);
  console.log(v);
  let cx = parseInt(htmlCir.getAttribute("cx"));
  let cy = parseInt(htmlCir.getAttribute("cy"));
  cx = cx + (v[0] * deltaT) / 800;  // divide 100 to fit the screen speed, accerleration = 9.8 pixels/s^2 is too much
  cy = cy + (v[1] * deltaT) / 800;
  // debugger
  htmlCir.setAttribute("cx",  cx + (v[0] * deltaT) / 500 ); //x = x0 + v*dt
  htmlCir.setAttribute("cy", cy + (v[1] * deltaT) / 500 );
}
