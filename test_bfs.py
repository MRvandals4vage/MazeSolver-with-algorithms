import numpy as np
from algorithms.bfs import BFS

grid = np.genfromtxt("mazes_input/maze_0.csv", delimiter=",", dtype=int)
start = (0,0)
goal = (40,40)
grid_dim = (40,40)
bfs = BFS(start, goal, grid_dim)
print(grid[1,0])
print(type(grid[1,0]))
print(grid[1,0] in [1, 3])
print(bfs.child_gen(grid))
