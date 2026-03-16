import maze_generator as mg
import numpy as np

def test():
    grid = np.zeros((41, 41))
    curr_pos = (0, 0)
    pos_visited = [curr_pos]
    back_tracks = 0
    grid[0, 0] = 2
    grid[-1, -1] = 3
    done = False
    
    while not done:
        grid, curr_pos, back_tracks, done = mg.generate_move(grid, curr_pos, pos_visited, back_tracks)
        if curr_pos not in pos_visited:
            pos_visited.append(curr_pos)
    print("Nonzeros:", np.count_nonzero(grid))

test()
