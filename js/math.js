export const vecPos = (circle) => {
  return [circle.attr("cx"), circle.attr("cy")];  //  (x, y)
};

export const subtractVector = (vector1, vector2) => {
  return [vector1[0] - vector2[0], vector1[1] - vector2[1]];  // (x1-x2, y1-y2)
};

export const vectorMagnitude = (vector) => {
  const x2 = Math.pow(vector[0], 2);
  const y2 = Math.pow(vector[1], 2);
  return Math.sqrt(x2 + y2); // sqrt(x^2 + y^2)
};

export const detectCollision = (circle1, circle2) => {
  // If the |position vector2 - position vector1| < (|radius1| + |radius2|)
  console.log(vecPos(circle1));
  console.log(vecPos(circle2));
  const positionSub = subtractVector(vecPos(circle1), vecPos(circle2));
  console.log("subtract vector", positionSub);
  const positionMag = vectorMagnitude(positionSub);
  console.log(positionMag);
  const radiusMag = Math.abs(circle1.attr("r")) +  Math.abs(circle2.attr("r"));
  console.log(radiusMag);
  return positionMag < radiusMag;
};
