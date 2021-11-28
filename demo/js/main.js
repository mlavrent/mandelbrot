
window.onload = (event) => {
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');

  // context.fillStyle('#000000');
  // context.fillRect(0, 0, 1000, 1000)

  // set width and height of the canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 71;
}

