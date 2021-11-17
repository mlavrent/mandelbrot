import cmath
import sys
import matplotlib.pyplot as plt
import PIL.Image as Image
import numpy as np


iterations = 200
power = 2
seedVal = 1
constVal = -0.1 - 0.68j
size = 1000

def get_equation(const, power = 2, iterations = 25):
  def iterated_equation(x, remaining_iterations):
    if remaining_iterations > 0:
      if (abs(x) > 10):
        return x, remaining_iterations
      return iterated_equation(x ** power + const, remaining_iterations - 1)
    else:
      return x ** power + const, remaining_iterations

  return lambda x: iterated_equation(x, iterations)

def escape_speed(equation, inVal):
  result, quitTime = equation(inVal)

  if (abs(result) <= max(abs(inVal), 4)):
    return 0, 0, 0
  else:
    return 160, int(255 * (quitTime/iterations) ** 4), 255

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
      pixelMap[col][row] = escape_speed(equation, complex(x, y))
      col += 1
    row += 1

  return pixelMap


# image = Image.fromarray(compute_mandelbrot_set(), mode="HSV").convert("RGB")
# image.show()
# image.save(f"images/mandelbrot-i{iterations}-s{seedVal}-p{power}.png")

image = Image.fromarray(compute_julia_set(constVal), mode="HSV").convert("RGB")
image.show()
image.save(f"images/julia-i{iterations}-c{constVal}-p{power}.png")