const xMin = -2;
const xMax = 1;
const yMin = -1;
const yMax = 1;

const aspectRatio = (xMax - xMin) / (yMax - yMin);

function getTLOffset(canvas) {
  const canvasAspectRatio = canvas.width / canvas.height;

  if (canvasAspectRatio >= aspectRatio) {
    // padding at left and right, heights match
    const actualImgWidth = canvas.height * aspectRatio;
    return [(canvas.width - actualImgWidth) / 2, 0];
  } else {
    // padding at top and bottom, widths match
    const actualImgHeight = canvas.width / aspectRatio;
    return [0, (canvas.height - actualImgHeight) / 2];
  }
}

// TODO: coordinate conversion has problems when we have blue margins
function pixToCoords(xPix, yPix, canvas) {
  const offset = getTLOffset(canvas);

  xPix -= offset[0];
  yPix -= offset[1];

  const xReal = (xPix / (canvas.width - 2 * offset[0])) * (xMax - xMin) + xMin;
  const yReal = yMax - (yPix / (canvas.height - 2 * offset[1])) * (yMax - yMin);

  return [xReal, yReal];
}

function coordsToPix(xCoord, yCoord, canvas) {
  const offset = getTLOffset(canvas);

  const xPix = (xCoord - xMin) * (canvas.width - 2 * offset[0]) / (xMax - xMin);
  const yPix = (yMax - yCoord) * (canvas.height - 2 * offset[1]) / (yMax - yMin);

  return [xPix + offset[0], yPix + offset[1]];
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

function drawCircle(xPix, yPix, radius, transparency, context, colorOverride=null) {
  context.fillStyle = colorOverride ?? `rgba(255, 38, 38, ${transparency})`;

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
  drawCircle(pix[0], pix[1], 15, 0.6, context, "rgba(255, 102, 0, 0.6)");

  // render each point in our list
  let prevPt = coordsToPix(0, 0, canvas);
  for (let i = 0; i < points.length; i++) {
    const pt = coordsToPix(points[i].re, points[i].im, canvas);
    drawCircle(pt[0], pt[1], 5, 1, context);
    drawLine(prevPt[0], prevPt[1], pt[0], pt[1], context);
    prevPt = pt;
  }
}

function dist(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

window.onload = (event) => {
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');

  const iterControl = document.querySelector('#iterControl');
  const cControl = document.querySelector('#cControl');

  // set up values to keep track of
  let c = { re: -0.5, im: 0.3 };
  let points = computePoints(c, iterControl.value);

  function setC(newVal) {
    c = newVal;
    cControl.value = `${c.re.toFixed(3)} + ${c.im.toFixed(3)}i`;
    points = computePoints(c, iterControl.value);
  }
  setC(c);

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

  // rendering for typing in new c value
  cControl.onchange = () => {
    const regex = /^([+-]?\d*\.?\d*) ?\+ ?([+-]?\d*\.?\d*)i$/gm;
    const match = regex.exec(cControl.value);
    console.log(match);
    setC({ re: parseFloat(match[0]), im: parseFloat(match[1]), });
    renderPoints(c, points, canvas, context);
  }

  // rendering for dragging c around
  let isDragging = false;
  canvas.onmousedown = (event) => {
    isDragging = true;
    console.log(`${event.offsetX}, ${event.offsetY}`);
  }
  canvas.onmousemove = (event) => {
    if (isDragging) {
      const coords = pixToCoords(event.offsetX, event.offsetY, canvas);
      setC({ re: coords[0], im: coords[1] });
      renderPoints(c, points, canvas, context);
    }
  }
  canvas.onmouseup = (event) => {
    isDragging = false;

    const coords = pixToCoords(event.offsetX, event.offsetY, canvas);
    setC({ re: coords[0], im: coords[1] });
    renderPoints(c, points, canvas, context);
  }
}

