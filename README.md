# AI Maze Solver

This project implements and compares different algorithms for maze solving, including brute force methods and AI heuristic techniques. It also provides a visual representation of the maze-solving process using Pygame.

## Features

- Maze generation using random functions with constraints to ensure solvability
- Implementation of multiple maze-solving algorithms:
  - Breadth First Search (BFS)
  - Depth First Search (DFS)
  - A* algorithm with Manhattan heuristic
  - A* algorithm with Euclidean heuristic
- Pygame GUI for visualizing the maze-solving process
- Performance comparison between different algorithms

## Algorithms

### Breadth First Search (BFS)
A brute force algorithm that explores all possible paths from the start node to the end node, expanding nodes level by level. It guarantees the shortest path but can be computationally expensive for larger mazes.

### Depth First Search (DFS)
Another brute force algorithm that traverses the maze depth-first, exploring each path as far as possible before backtracking. It's not guaranteed to find the shortest path but can be more efficient for larger mazes.

### A* Algorithm
An informed search algorithm that uses a heuristic function to guide its search towards the goal node. We implement A* with two heuristics:
- Manhattan distance
- Euclidean distance

## Visualization

The project includes a Pygame GUI that visualizes the maze-solving process, showing:
- The initial unsolved maze
- The exploration process of the chosen algorithm
- The final solved path

<p float="left">
  <img src="https://raw.githubusercontent.com/nabobery/MAZE-SOLVER-USING-AI/main/Examples/maze_unsolved.png" width="400" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/nabobery/MAZE-SOLVER-USING-AI/main/Examples/maze_solved.png" width="400" /> 
</p>

<p align="center">
  <em>Unsolved Maze (left) vs Solved Maze (right)</em>
</p>

## Performance Comparison

The project includes tools for comparing the performance of different algorithms:
- Time taken by each algorithm for solving multiple mazes
- Line plot comparison of solving times
- Bar plot comparison of average solving times

![An Example Graph](https://raw.githubusercontent.com/nabobery/MAZE-SOLVER-USING-AI/main/Examples/graph1.png)

## Requirements

- Python 3.x
- NumPy
- Pygame
- Matplotlib (for performance comparison plots)
- Node.js (for the Web Interface)

## Web Interface Dashboard

This project includes a React-based web interface to generate, solve, and natively visualize mazes directly in your browser without requiring a separate Pygame window.

To launch the web interface:

1. Navigate to the interface folder:
```bash
cd web-interface
```
2. Install the web dependencies:
```bash
npm install
```
3. Start the UI and API concurrently:
```bash
npm run dev
```
4. Open your browser and navigate to `http://localhost:5173`!

## Usage

1. Clone the repository:
```bash
git clone https://github.com/nabobery/MAZE-SOLVER-USING-AI.git
```
2. Install the required dependencies:
```bash
pip install numpy pygame matplotlib
```
3. Run the main script:
```bash
python main.py
```

## Learn More

For a more comprehensive understanding of the algorithms, implementation details, and performance analysis, please check the [`reports`](https://github.com/nabobery/MAZE-SOLVER-USING-AI/tree/main/Reports) folder in this repository. It contains detailed documentation on:

- Maze generation techniques
- Implementation of BFS, DFS, and A* algorithms
- Heuristic functions used in A* (Manhattan and Euclidean)
- Performance comparisons and analysis
- Visualization process using Pygame

The reports provide in-depth explanations and insights into the project's development and findings.

## Conclusion

Our analysis shows that the A* algorithm, using both Manhattan and Euclidean heuristics, significantly outperforms the brute-force BFS and DFS algorithms. This demonstrates the efficiency and effectiveness of intelligent AI search algorithms in solving complex maze navigation problems.

## License
This project is open source and available under the [GNU General Public License v3.0](LICENSE).
