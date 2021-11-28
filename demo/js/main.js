const xMin = -2;
const xMax = 1;
const yMin = -1;
const yMax = 1


function pixToCoords(xPix, yPix, canvas) {
  const xReal = (xPix / canvas.width) * (xMax - xMin) + xMin;
  const yReal = yMax - (yPix / canvas.height) * (yMax - yMin);

  return [xReal, yReal];
}

function computePoints(c, iterations) {
  const points = [];
  let point = {re: 0, im: 0};
  for (let i = 0; i < iterations; i++) {
    point = {
      re: (point.re ** 2 - point.im ** 2) + c.re,
      im: 2 * point.re * point.im + c.im,
    };

    points.push(point);
  }
  return points;
}

window.onload = (event) => {
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');

  const c = {re: 0, im: 0};
  const points = computePoints(c, document.querySelector('#iterControl').value);

  // set width and height of the canvas
  window.onresize = (_) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 71;
  }
  window.onresize(null)

  // set up onclick event for canvas
  canvas.onclick = (event) => {
    console.log(`Canvas clicked at ${event.offsetX}, ${event.offsetY}`)
    const realCoords = pixToCoords(event.offsetX, event.offsetY, canvas);
    console.log(`Real coords: ${realCoords[0]}, ${realCoords[1]}`)


  }
}

