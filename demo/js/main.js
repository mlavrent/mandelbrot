const xMin = -2;
const xMax = 1;
const yMin = -1;
const yMax = 1

// TODO: coordinate conversion has problems when we have blue margins
function pixToCoords(xPix, yPix, canvas) {
  const xReal = (xPix / canvas.width) * (xMax - xMin) + xMin;
  const yReal = yMax - (yPix / canvas.height) * (yMax - yMin);

  return [xReal, yReal];
}

function coordsToPix(xCoord, yCoord, canvas) {
  const xPix = (xCoord - xMin) * canvas.width / (xMax - xMin);
  const yPix = (yMax - yCoord) * canvas.height / (yMax - yMin);

  return [xPix, yPix];
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

function drawCircle(xPix, yPix, radius, transparency, context) {
  context.fillStyle = `rgba(255, 38, 38, ${transparency})`;

  context.beginPath();
  context.arc(xPix, yPix, radius, 0, 2 * Math.PI, true);
  context.fill();
}

function drawLine(startX, startY, endX, endY, context) {
  context.strokeStyle = `rgba(255, 38, 38, 0.7)`;
  context.lineWidth = 3;
  context.lineCap = 'round';

  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.stroke();
}

function clearCanvas(canvas, context) {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function renderPoints(c, points, canvas, context) {
  clearCanvas(canvas, context);
  // render c
  const pix = coordsToPix(c.re, c.im, canvas);
  drawCircle(pix[0], pix[1], 15, 0.5, context);

  // render each point in our list
  let prevPt = coordsToPix(0, 0, canvas);
  for (let i = 0; i < points.length; i++) {
    const pt = coordsToPix(points[i].re, points[i].im, canvas);
    drawCircle(pt[0], pt[1], 5, 1, context);
    drawLine(prevPt[0], prevPt[1], pt[0], pt[1], context);
    prevPt = pt;
  }
}

window.onload = (event) => {
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');

  const iterControl = document.querySelector('#iterControl');

  // set up values to keep track of
  let c = { re: -0.5, im: 0.3 };
  let points = computePoints(c, iterControl.value);

  // set width and height of the canvas
  window.onresize = (_) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 71;
    renderPoints(c, points, canvas, context);
  }
  window.onresize(null);
  renderPoints(c, points, canvas, context);

  // rendering for when iterations changes
  iterControl.oninput = () => {
    points = computePoints(c, iterControl.value);
    renderPoints(c, points, canvas, context);
  }

  // rendering for dragging c around
  let isDragging = false;
  canvas.onmousedown = (event) => {
    isDragging = true;
  }
  canvas.onmousemove = (event) => {
    if (isDragging) {
      const coords = pixToCoords(event.offsetX, event.offsetY, canvas);
      c = { re: coords[0], im: coords[1] };
      points = computePoints(c, iterControl.value);
      renderPoints(c, points, canvas, context);
    }
  }
  canvas.onmouseup = (event) => {
    isDragging = false;

    const coords = pixToCoords(event.offsetX, event.offsetY, canvas);
    c = { re: coords[0], im: coords[1] };
    points = computePoints(c, iterControl.value);
    renderPoints(c, points, canvas, context);
  }
  canvas.onmouseover = (event) => {

  }
}

