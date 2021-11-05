import cmath
import sys
import matplotlib.pyplot as plt
import PIL.Image as Image
import numpy as np


iterations = 200
seedVal = 0
size = 600

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
  return abs(equation(inVal)) <= 2

pixelMap = np.zeros((size, 2*size), dtype=np.uint8)
row = 0
for x in np.linspace(-2, 1, 2*size):
  col = 0
  for y in np.linspace(-1, 1, size):
    equation = get_equation(complex(x, y), power=2, iterations=iterations)
    if is_equation_bounded(equation, seedVal):
      pixelMap[col][row] = 1
    col += 1
  row += 1

image = Image.fromarray(pixelMap * 255)#.resize((500, 500))
image.show()

imMap = np.asarray(image)
print(f"{np.count_nonzero(pixelMap)}/{size * size}")
print(f"{np.count_nonzero(imMap)}/{size * size}")