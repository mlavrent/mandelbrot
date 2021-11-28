import matplotlib.pyplot as plt
import PIL.Image as Image
import numpy as np
from pathlib import Path

iterations = 250
power = 2
seedVal = 0
constVal = -0.9728 - 0.1770j
size = 1500

def get_equation(const, power = 2, iterations = 25):
  def iterated_equation(x, remaining_iterations):
    if remaining_iterations > 0:
      if (abs(x) > 10):
        return x, remaining_iterations
      return iterated_equation(x ** power + const, remaining_iterations - 1)
    else:
      return x ** power + const, remaining_iterations

  return lambda x: iterated_equation(x, iterations)

def escape_speed(equation, inVal, bw=False, hue=160, val=255):
  result, quitTime = equation(inVal)

  if (abs(result) <= max(abs(inVal), 4)):
    return 0, 0, 0
  else:
    if bw:
      return hue, 0, int(255 * (quitTime/iterations) ** 4)
    else:
      return hue, int(255 * (quitTime/iterations) ** 4), val

def compute_mandelbrot_set():
  pixelMap = np.zeros((size, 3*size//2, 3), dtype=np.uint8)
  row = 0
  for x in np.linspace(-2, 1, 3*size//2):
    col = 0
    for y in np.linspace(-1, 1, size):
      equation = get_equation(complex(x, y), power=power, iterations=iterations)
      pixelMap[col][row] = escape_speed(equation, seedVal)
      col += 1
    row += 1

  return pixelMap

def compute_julia_set(const):
  pixelMap = np.zeros((size, size, 3), dtype=np.uint8)
  row = 0
  for x in np.linspace(-2, 2, size):
    col = 0
    for y in np.linspace(-2, 2, size):
      equation = get_equation(const, power=power, iterations=iterations)
      pixelMap[col][row] = escape_speed(equation, complex(x, y), bw=True, hue=17, val=200)
      col += 1
    row += 1

  return pixelMap

def linear_path(start, end):
  return lambda t: start + (end - start) * t

def make_mandelbrot_image(show=True, filename=None):
  if not filename:
      filename = f"images/mandelbrot-i{iterations}-s{seedVal}-p{power}.png"

  image = Image.fromarray(compute_mandelbrot_set(), mode="HSV").convert("RGB")
  if show:
    image.show()
  image.save(filename)

def make_julia_image(constVal, show=True, filename=None):
  if not filename:
    filename = f"images/julia-i{iterations}-c{constVal}-p{power}.png"

  image = Image.fromarray(compute_julia_set(constVal), mode="HSV").convert("RGB")
  if show:
    image.show()
  image.save(filename)

def make_julia_sets_along_path(path, path_name, steps=100):
  Path(path_name).mkdir(parents=True, exist_ok=False)

  for t in np.linspace(0, 1, steps):
    print(f"Time {5:05d}")
    make_julia_image(path(t), show=False, filename=f"{path_name}/{t:05d}.png")


# make_mandelbrot_image()
make_julia_image(constVal)
# make_julia_sets_along_path(linear_path(-0.1+0.5j, -0.1+0.9j), "(-0.1+0.5j)lin(-0.1+0.9j)-30s", 30)




