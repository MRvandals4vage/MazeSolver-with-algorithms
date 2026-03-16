import numpy as np
import sys
sys.path.append('algorithms')
from bfs import BFS

grid = np.genfromtxt("mazes_input/maze_0.csv", delimiter=",", dtype=int)
start = (0,0)
goal = (40,40)
grid_dim = (40,40)
bfs = BFS((0,0), (40,40), (40,40))
print("Grid[1,0]:", grid[1,0])
print("Type:", type(grid[1,0]))
print("In [1,3]:", grid[1,0] in [1, 3])
print("Is in grid:", (1,0) <= grid_dim)
path, done = bfs.child_gen(grid)
print("Path:", path)
print("Done:", done)
print("Open lists:", len(bfs.openlist))
print("Closed lists:", len(bfs.closedlist))
