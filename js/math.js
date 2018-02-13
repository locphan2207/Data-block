export const vecPos = (htmlCircle) => {
  return [parseInt(htmlCircle.getAttribute("cx")),
    parseInt(htmlCircle.getAttribute("cy"))];  //  (x, y)
};

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

export const vectorMagnitude = (vector) => {
  const x2 = Math.pow(vector[0], 2);
  const y2 = Math.pow(vector[1], 2);
  return Math.sqrt(x2 + y2); // sqrt(x^2 + y^2)
};

export const detectCollision = (htmlCir1, htmlCir2) => {
  // If the |position vector2 - position vector1| < (|radius1| + |radius2|)
  console.log(vecPos(htmlCir1));
  console.log(vecPos(htmlCir2));
  const positionSub = subtractVector(vecPos(htmlCir1), vecPos(htmlCir2));
  console.log("subtract vector", positionSub);
  const positionMag = vectorMagnitude(positionSub);
  console.log(positionMag);
  const r1 = parseInt(htmlCir1.getAttribute("r"));
  const r2 = parseInt(htmlCir2.getAttribute("r"));
  const radiusMag = Math.abs(r1) +  Math.abs(r2);
  console.log(radiusMag);
  return positionMag < radiusMag;
};
