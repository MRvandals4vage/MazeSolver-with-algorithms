import React, { useState, useEffect, useRef } from 'react';
import { Play, Settings, RefreshCw, Box, Terminal, Zap, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import './index.css';

function App() {
  const [mazes, setMazes] = useState([]);
  const [selectedMaze, setSelectedMaze] = useState('');
  const [algorithm, setAlgorithm] = useState('astar');
  const [numMazes, setNumMazes] = useState(1);
  const [display, setDisplay] = useState(true);
  
  const [logs, setLogs] = useState([{ type: 'info', text: 'Maze AI System Initialized.' }]);
  const [status, setStatus] = useState('idle'); // idle, running, error
  const logsEndRef = useRef(null);
  const canvasRef = useRef(null);
  const [gridData, setGridData] = useState(null);

  // Colors based on main.py
  const idxToColor = [
    '#000000', // 0: black (wall)
    '#ffffff', // 1: white (space)
    '#32cd32', // 2: green (start)
    '#ff6347', // 3: red (goal)
    '#99ffff', // 4: blue (current/explored)
    '#ff00ff'  // 5: magenta (solution)
  ];

  useEffect(() => {
    if (gridData && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const numRows = gridData.length;
      const numCols = gridData[0].length;
      
      const width = 12;
      const height = 12;
      const margin = 1;
      
      canvas.width = (width + margin) * numCols + margin;
      canvas.height = (height + margin) * numRows + margin;
      
      // Background (grey like Pygame)
      ctx.fillStyle = '#d3d3d3';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const val = gridData[r][c];
          ctx.fillStyle = idxToColor[val] || '#000000';
          ctx.fillRect(
            margin + (width + margin) * c,
            margin + (height + margin) * r,
            width, height
          );
        }
      }
    }
  }, [gridData]);

  useEffect(() => {
    fetchMazes();
  }, []);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const addLog = (text, type = 'info') => {
    setLogs(prev => [...prev, { text, type }]);
  };

  const fetchMazes = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/mazes');
      const data = await res.json();
      setMazes(data);
      if (data.length > 0 && !selectedMaze) {
        setSelectedMaze(data[0]);
      }
    } catch (err) {
      addLog('Failed to fetch maze list.', 'error');
    }
  };

  const handleGenerate = async () => {
    setStatus('running');
    addLog(`Generating ${numMazes} maze(s) ${display ? 'with display' : ''}...`);
    try {
      const res = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numMazes, display: display ? 1 : 0 })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      addLog(data.stdout || data.message, 'success');
      setStatus('idle');
      fetchMazes();
    } catch (err) {
      addLog(err.message, 'error');
      setStatus('error');
    }
  };

  const handleSolve = async () => {
    if (!selectedMaze) {
      addLog('Please select a maze first.', 'error');
      return;
    }
    setStatus('running');
    addLog(`Solving ${selectedMaze} using ${algorithm.toUpperCase()}...`);
    try {
      const res = await fetch('http://localhost:3001/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm, mazeFile: selectedMaze, display: display ? 1 : 0 })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      addLog(data.stdout || data.message, 'success');
      setStatus('idle');
    } catch (err) {
      addLog(err.message, 'error');
      setStatus('error');
    }
  };

  const handleVisualize = async (mode = 'original') => {
    if (!selectedMaze) {
      addLog('Please select a maze first.', 'error');
      return;
    }
    
    if (display) {
      setStatus('running');
      addLog(`Visualizing ${mode === 'solved' ? 'solved ' : ''}${selectedMaze} in Pygame...`);
      try {
        const algoParam = mode === 'solved' ? (algorithm === 'astar' ? 'aStar' : algorithm) : '';
        const res = await fetch('http://localhost:3001/api/visualize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ algorithm: algoParam, mazeFile: selectedMaze })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        addLog(data.stdout || data.message, 'success');
        setStatus('idle');
      } catch (err) {
        addLog(err.message, 'error');
        setStatus('error');
      }
    } else {
      setStatus('running');
      addLog(`Rendering ${mode === 'solved' ? 'solved ' : ''}${selectedMaze} natively...`);
      try {
        const algoParam = mode === 'solved' ? (algorithm === 'astar' ? 'aStar' : algorithm) : '';
        const queryParams = new URLSearchParams({ mazeFile: selectedMaze });
        if (algoParam) queryParams.append('algorithm', algoParam);
        
        const res = await fetch(`http://localhost:3001/api/grid?${queryParams}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        
        setGridData(data.grid);
        addLog('Successfully rendered maze.', 'success');
        setStatus('idle');
      } catch (err) {
        addLog(err.message, 'error');
        setStatus('error');
      }
    }
  };

  const getStatusIcon = () => {
    if (status === 'running') return <RefreshCw className="animate-spin" size={16} />;
    if (status === 'error') return <AlertCircle size={16} />;
    return <CheckCircle2 size={16} />;
  };

  return (
    <>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      
      <div className="app-container">
        
        {/* Controls Sidebar */}
        <div className="panel side-panel">
          <div className="header">
            <h1>Maze AI</h1>
            <p>Control Interface</p>
            <div className={`status-badge ${status}`}>
              {getStatusIcon()}
              <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
            </div>
          </div>

          <div className="panel-title">
            <Settings size={20} />
            Global Settings
          </div>

          <div className="control-group">
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={display} 
                onChange={(e) => setDisplay(e.target.checked)} 
              />
              <span className="slider"></span>
              <span className="toggle-label">Enable Pygame Display</span>
            </label>
          </div>

          <div style={{ margin: '1rem 0', borderTop: '1px solid var(--panel-border)' }}></div>

          <div className="panel-title">
            <Box size={20} />
            Generation
          </div>
          
          <div className="control-group">
            <label className="control-label">Number of Mazes</label>
            <input 
              type="number" 
              className="input-box" 
              value={numMazes} 
              min="1" 
              onChange={(e) => setNumMazes(parseInt(e.target.value) || 1)}
            />
          </div>

          <button 
            className="btn btn-primary" 
            onClick={handleGenerate}
            disabled={status === 'running'}
          >
            <RefreshCw size={18} className={status === 'running' ? 'animate-spin' : ''} />
            Generate Maze(s)
          </button>

          <div style={{ margin: '1rem 0', borderTop: '1px solid var(--panel-border)' }}></div>

          <div className="panel-title">
            <Zap size={20} />
            Solving AI
          </div>

          <div className="control-group">
            <label className="control-label">Algorithm</label>
            <div className="options-grid">
              {['astar', 'bfs', 'dfs'].map((alg) => (
                <label key={alg} className={`radio-card ${algorithm === alg ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    name="algorithm" 
                    value={alg} 
                    checked={algorithm === alg} 
                    onChange={(e) => setAlgorithm(e.target.value)} 
                  />
                  {alg.toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          <div className="control-group" style={{ marginTop: '0.5rem' }}>
            <label className="control-label">Target Maze</label>
            <select 
              className="select-box"
              value={selectedMaze}
              onChange={(e) => setSelectedMaze(e.target.value)}
            >
              {mazes.length === 0 && <option value="">No mazes found</option>}
              {mazes.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <button 
            className="btn btn-success" 
            onClick={handleSolve}
            disabled={status === 'running' || !selectedMaze}
            style={{ marginTop: '0.5rem' }}
          >
            <Play size={18} />
            Solve Maze
          </button>
          
          <div className="options-grid" style={{ marginTop: '0.5rem' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => handleVisualize('original')}
              disabled={status === 'running' || !selectedMaze}
              style={{ fontSize: '0.9rem', padding: '0.6rem' }}
            >
              <Eye size={16} /> Original
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => handleVisualize('solved')}
              disabled={status === 'running' || !selectedMaze}
              style={{ fontSize: '0.9rem', padding: '0.6rem' }}
            >
              <Eye size={16} /> Solved
            </button>
          </div>

        </div>

        {/* Visualizer / Console Panel */}
        <div className="panel main-panel" style={{ height: '100%' }}>
          <div className="panel-title">
            <Terminal size={20} />
            System Console & Visualizer
          </div>
          
          {gridData && !display && (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0', overflow: 'auto' }}>
              <canvas 
                ref={canvasRef} 
                style={{ 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  backgroundColor: '#d3d3d3'
                }} 
              />
            </div>
          )}

          <div className="console-panel">
            {logs.map((log, i) => (
              <div key={i} className={`console-output ${log.type === 'error' ? 'error' : log.type === 'info' ? 'info' : ''}`} style={{ marginBottom: '8px' }}>
                <span style={{ opacity: 0.5, marginRight: '8px' }}>[{new Date().toLocaleTimeString()}]</span>
                {log.text}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
             Execution outputs and python script status appear here. Display windows will open externally.
          </div>
        </div>

      </div>
    </>
  );
}

export default App;
