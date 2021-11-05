import cmath
import sys
import matplotlib.pyplot as plt
import PIL.Image as Image
import numpy as np


iterations = 200
power = 4
seedVal = 0
constVal = -1
size = 1000

def get_equation(const, power = 2, iterations = 25):
  def iterated_equation(x, remaining_iterations):
    if remaining_iterations > 0:
      if (abs(x) > 2):
        return x
      return iterated_equation(x ** power + const, remaining_iterations - 1)
    else:
      return x ** power + const

  return lambda x: iterated_equation(x, iterations)

def is_equation_bounded(equation, inVal):
  return abs(equation(inVal)) <= max(abs(inVal), 2)

def compute_mandelbrot_set():
  pixelMap = np.zeros((size, 2*size), dtype=np.uint8)
  row = 0
  for x in np.linspace(-2, 1, 2*size):
    col = 0
    for y in np.linspace(-1, 1, size):
      equation = get_equation(complex(x, y), power=power, iterations=iterations)
      if is_equation_bounded(equation, seedVal):
        pixelMap[col][row] = 1
      col += 1
    row += 1

  return pixelMap

def compute_julia_set(const):
  pixelMap = np.zeros((size, size), dtype=np.uint8)
  row = 0
  for x in np.linspace(-2, 2, size):
    col = 0
    for y in np.linspace(-2, 2, size):
      equation = get_equation(const, power=power, iterations=iterations)
      if is_equation_bounded(equation, complex(x, y)):
        pixelMap[col][row] = 1
      col += 1
    row += 1

  return pixelMap


# image = Image.fromarray(compute_mandelbrot_set() * 255)
# image.show()
# image.save(f"images/mandelbrot-i{iterations}-s{seedVal}-p{power}.png")

image = Image.fromarray(compute_julia_set(constVal) * 255)
image.show()
image.save(f"images/julia-i{iterations}-c{constVal}-p{power}.png")