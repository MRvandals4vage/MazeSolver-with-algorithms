import pygame, argparse, csv, time
import argparse
import numpy as np
from time import sleep
from numpy.random import randint

# function to check if a position is in the grid
# Returns true if pos in grid and false if not in grid
def is_in_grid(pos, grid_dim):
    (max_x, max_y) = grid_dim # unroll the dimensions
    (x, y) = pos # unroll the position coordinates
    return bool((x <= max_x) and (x >= 0) and (y <= max_y) and (y >= 0)) # only true if both true

# function to the next 2 cells that can be traversed from the current cell
# Returns a list of tuples of 2 ints
def get_next_cells(pos, grid_dim):
    x, y = pos # unroll the position coordinates
    possible_moves = []
    movements_1 = [(0, 1), (0, -1),(1, 0), (-1, 0)] # possible moves from current cell
    movements_2 = [(0, 2), (0, -2), (2, 0), (-2, 0)] # possible moves from the next cell
    for i in range(len(movements_1)):
        move_1 = movements_1[i]
        move_2 = movements_2[i]
        if is_in_grid((x + move_1[0], y + move_1[1]), grid_dim) and is_in_grid((x + move_2[0], y + move_2[1]), grid_dim):
            possible_moves.append([(x + move_1[0], y + move_1[1]), (x + move_2[0], y + move_2[1])])
    return possible_moves


# function to traverse the maze and generate the colored moves
# Returns the grid with the colored moves
def generate_move(grid, curr_pos, pos_visited, back_tracks):
    (x,y) = curr_pos
    grid[x, y] = 1
    grid_dim = (len(grid), len(grid[0]))
    possible_moves = get_next_cells(curr_pos, grid_dim)
    valid_moves = []
    for move in possible_moves:
        (x1,y1) = move[0]
        (x2,y2) = move[1]

        if (grid[x1, y1] != 1 and grid[x2, y2] != 1 and grid[x2, y2] != 2 and grid[x1, y1] != 2):
            valid_moves.append(move)
    # if there are no valid moves, then we need to backtrack to the previous move
    if len(valid_moves) == 0:
        curr_pos = pos_visited[-2 - back_tracks]
        if curr_pos == (0,0):
            done = True
            return grid, curr_pos, back_tracks, done
        back_tracks += 1
        done = False
        return grid, curr_pos, back_tracks, done

    # if there are valid moves, then we need to pick one at random and move to it
    else:
        # reset the back_tracks counter
        back_tracks = 0 
        if len(valid_moves) == 1:
            curr_pos = valid_moves[0]
            (x1, y1) = curr_pos[0]
            (x2, y2) = curr_pos[1]
            grid[x1, y1] = 1
            grid[x2, y2] = 4
            curr_pos = curr_pos[1]
            done = False
            return grid, curr_pos, back_tracks, done
        else:
            move = valid_moves[randint(0, len(valid_moves))]
            (x1,y1) = move[0]
            (x2,y2) = move[1]
            grid[x1, y1] = 1
            grid[x2, y2] = 4
            curr_pos = move[1]
            done = False
            return grid, curr_pos, back_tracks, done

if __name__ == "__main__":

    start_time = time.time()
    # define all colors of the grid RGB
    # grid == 0 for indicating wall
    black = (0, 0, 0) 
    # grid == 1 for inidicating space
    white = (255, 255, 255) 
    # grid == 2 for indicating start
    green = (0,255,128) 
    # grid == 3 for indicating goal
    red = (255,51,51) 
    # for background
    grey = (192,192,192) 
    # grid[x][y] == 4, where current position is
    blue = (153,200,255) 

    # set the height/width of each location on the grid (Square grid for now)
    height = 12
    width = height 
    margin = 1 # sets margin between grid locations

    #  parsing user input
    # example: python maze_generator.py --display=1 --num_mazes=1
    parser = argparse.ArgumentParser()
    parser.add_argument("--display", help="Display generating process 0: False, 1:True", default=1, type=int)
    parser.add_argument("--num_mazes", help="Number of mazes to generate.", default=1, type=int)
    args = parser.parse_args()

    for maze in range(args.num_mazes):
        start = time.time()
        # initialize the grid array full of zeros (blocked)
        num_rows = 41
        num_columns = num_rows
        grid = np.zeros((num_rows, num_columns))

        if args.display == 1:
            # initialize pygame
            pygame.init()

            # congiguration of the window
            WINDOW_SIZE = [535, 535]
            screen = pygame.display.set_mode(WINDOW_SIZE)
            # screen title
            pygame.display.set_caption(f"Generating Maze {maze+1}/{args.num_mazes}...")

            done = False # loop until done
            run = False # when run = True start running the algorithm

            clock = pygame.time.Clock() # to manage how fast the screen updates

            idx_to_color = [black, white, green, red, blue]

            # initialize curr_pos variable. Its the starting point for the algorithm
            curr_pos = (0, 0)
            pos_visited = []
            pos_visited.append(curr_pos)
            back_tracks = 0

            # define start and goal
            grid[0, 0] = 2 # (0,0)
            grid[-1, -1] = 3 # (num_rows-1, num_rows-1)

            # main program
            while not done:
                for event in pygame.event.get():
                    if event.type == pygame.QUIT:
                        done = True   
                    # wait for user to press RETURN key to start    
                    elif event.type == pygame.KEYDOWN:
                        if event.key==pygame.K_RETURN:
                            run = True
                
                screen.fill(grey) # fill background in grey
                    
                # draw
                for row in range(num_rows):
                    for column in range(num_columns):
                        color = idx_to_color[int(grid[row, column])]
                        pygame.draw.rect(screen, color, [(margin + width) * column + margin, (margin + height) * row + margin,width, height])

                # set limit to 60 frames per second
                clock.tick(60)
            
                # update screen
                pygame.display.flip()
            
                if run == True:
                    # feed the algorithm the last updated position and the grid
                    grid, curr_pos, back_tracks, done = generate_move(grid, curr_pos, pos_visited, back_tracks)
                    if curr_pos not in pos_visited:
                        pos_visited.append(curr_pos)
                    sleep(0.01)

            close = False
            while not close:
                for event in pygame.event.get():
                    if event.type == pygame.QUIT:
                        close = True
                        pygame.quit()
                    # wait for user to press any key to start    
                    if event.type == pygame.KEYDOWN:
                        close = True
                        pygame.quit()
        else:
            print(f"Generating Maze {maze}/{args.num_mazes}...", end=" ")
            done = False # loop until done
            # initialize curr_pos variable. Its the starting point for the algorithm
            curr_pos = (0, 0)
            pos_visited = []
            pos_visited.append(curr_pos)
            back_tracks = 0
            # define start and goal
            grid[0, 0] = 2 # (0,0)
            grid[-1, -1] = 3 # (num_rows-1, num_rows-1)

            while not done:
                # feed the algorithm the last updated position and the grid
                grid, curr_pos, back_tracks, done = generate_move(grid, curr_pos, pos_visited, back_tracks)
                if curr_pos not in pos_visited:
                    pos_visited.append(curr_pos)
                    
        # export maze to .csv file
        with open(f"mazes_input/maze_{maze}.csv", "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerows(grid)
            print(f"{time.time()-start:.3f} s")

    print(f"--- finished {time.time()-start_time:.3f} s---")
    exit(0)
