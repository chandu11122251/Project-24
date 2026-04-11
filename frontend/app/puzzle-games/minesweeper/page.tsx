"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import StarfieldBackground from "@/components/background/StarfieldBackground";
import { Library, RefreshCcw, Lightbulb, Trophy, Clock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import "../puzzle-games.css";
import GlareHover from "@/components/ui/GlareHover";

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const MS_ROWS = 8;
const MS_COLS = 8;
const MS_MINES = 10;

type CellData = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

type GameState = {
  grid: CellData[][];
  flags: number;
};

export default function MinesweeperPage() {
  const [grid, setGrid] = useState<CellData[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [flags, setFlags] = useState(MS_MINES);
  const [timePassed, setTimePassed] = useState(0);
  const [hintCooldown, setHintCooldown] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);


  useEffect(() => {
    initGrid();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    // Don't start timer until grid is generated
    if (grid.length > 0 && !gameOver && !win) {
      interval = setInterval(() => {
        setTimePassed(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [grid.length, gameOver, win]);

  useEffect(() => {
    (window as any).solveMinesweeper = () => setWin(true);
    return () => { delete (window as any).solveMinesweeper; };
  }, []);

  const initGrid = () => {
    let newGrid: CellData[][] = Array(MS_ROWS).fill(null).map(() => 
      Array(MS_COLS).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );
    let placed = 0;
    while(placed < MS_MINES) {
      let r = Math.floor(Math.random() * MS_ROWS);
      let c = Math.floor(Math.random() * MS_COLS);
      if(!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        placed++;
      }
    }
    for(let r=0; r<MS_ROWS; r++) {
      for(let c=0; c<MS_COLS; c++) {
        if(!newGrid[r][c].isMine) {
          let count = 0;
          for(let dr=-1; dr<=1; dr++){
            for(let dc=-1; dc<=1; dc++){
              if(dr===0 && dc===0) continue;
              let nr = r + dr, nc = c + dc;
              if(nr>=0 && nr<MS_ROWS && nc>=0 && nc<MS_COLS && newGrid[nr][nc].isMine) {
                count++;
              }
            }
          }
          newGrid[r][c].neighborMines = count;
        }
      }
    }
    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
    setFlags(MS_MINES);
  };

  const handleReveal = (r: number, c: number) => {
    if (gameOver || win || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

    let newGrid = grid.map(row => row.map(cell => ({ ...cell })));

    if (newGrid[r][c].isMine) {
      for (let i = 0; i < MS_ROWS; i++) {
        for (let j = 0; j < MS_COLS; j++) {
          if (newGrid[i][j].isMine) {
            newGrid[i][j].isRevealed = true;
          }
        }
      }
      setGrid(newGrid);
      setGameOver(true);
      return;
    }

    const floodFill = (row: number, col: number) => {
      if (row < 0 || row >= MS_ROWS || col < 0 || col >= MS_COLS) return;
      if (newGrid[row][col].isRevealed || newGrid[row][col].isFlagged) return;
      
      newGrid[row][col].isRevealed = true;
      if (newGrid[row][col].neighborMines === 0 && !newGrid[row][col].isMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr !== 0 || dc !== 0) {
              floodFill(row + dr, col + dc);
            }
          }
        }
      }
    };

    floodFill(r, c);
    setGrid(newGrid);

    let revealed = 0;
    for (let i = 0; i < MS_ROWS; i++) {
      for (let j = 0; j < MS_COLS; j++) {
        if (newGrid[i][j].isRevealed && !newGrid[i][j].isMine) revealed++;
      }
    }
    if (revealed === MS_ROWS * MS_COLS - MS_MINES) {
      setWin(true);
    }
  };

  const handleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || win || grid[r][c].isRevealed) return;

    let newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    if (!newGrid[r][c].isFlagged && flags > 0) {
      newGrid[r][c].isFlagged = true;
      setFlags(f => f - 1);
    } else if (newGrid[r][c].isFlagged) {
      newGrid[r][c].isFlagged = false;
      setFlags(f => f + 1);
    }
    setGrid(newGrid);
  };

  const handleHint = () => {
    if (gameOver || win || hintCooldown) return;
    
    // Find a safe cell that isn't revealed yet, or unflagged mine to flag. 
    // Usually hints just reveal one safe square for you, or safely flag an obvious mine.
    let safeCells: {r:number, c:number}[] = [];
    for (let i = 0; i < MS_ROWS; i++) {
      for (let j = 0; j < MS_COLS; j++) {
        if (!grid[i][j].isMine && !grid[i][j].isRevealed) {
          safeCells.push({r: i, c: j});
        }
      }
    }
    
    if (safeCells.length > 0) {
      setHintCooldown(true);
      setHintsUsed(prev => prev + 1);
      setTimeout(() => setHintCooldown(false), 5000);
      let newGrid = grid.map(row => row.map(cell => ({ ...cell })));
      // Prefer zero neighbor cells if possible for a better hint spread
      const zeroCells = safeCells.filter(cell => newGrid[cell.r][cell.c].neighborMines === 0);
      const targetList = zeroCells.length > 0 ? zeroCells : safeCells;
      const target = targetList[Math.floor(Math.random() * targetList.length)];
      
      // Auto-reveal it safely by directly replacing internal call
      const floodFill = (row: number, col: number) => {
        if (row < 0 || row >= MS_ROWS || col < 0 || col >= MS_COLS) return;
        if (newGrid[row][col].isRevealed || newGrid[row][col].isFlagged) return;
        
        newGrid[row][col].isRevealed = true;
        if (newGrid[row][col].neighborMines === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr !== 0 || dc !== 0) {
                floodFill(row + dr, col + dc);
              }
            }
          }
        }
      };
      
      floodFill(target.r, target.c);
      setGrid(newGrid);
      
      // check win
      let revealed = 0;
      for (let i = 0; i < MS_ROWS; i++) {
        for (let j = 0; j < MS_COLS; j++) {
          if (newGrid[i][j].isRevealed && !newGrid[i][j].isMine) revealed++;
        }
      }
      if (revealed === MS_ROWS * MS_COLS - MS_MINES) {
        setWin(true);
      }
    }
  };

  if(!grid.length) return null;

  return (
    <StarfieldBackground className="relative min-h-screen w-full overflow-hidden bg-[#06070f] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-[#06070f]/60 border-b border-white/5">
        <Link
          href="/puzzle-games"
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Puzzle Games
        </Link>
      </nav>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center pt-24 pb-12 px-4">
        <div className="flex flex-col items-center max-w-[540px] w-full bg-[#0a0e1a]/80 p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md">
          <div className="flex items-center w-full justify-between mb-10">
            <div className="flex items-center gap-3">
               <div className="puzzle-card__icon shadow-none" style={{ marginBottom: 0, "--icon-accent": "#ec4899" } as React.CSSProperties}>
                  <Library className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-linear-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent">Booksweeper</h1>
                </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1 font-bold">Timer</span>
              <div className="font-mono text-xl font-medium text-white/90 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 shadow-inner">
                {formatTime(timePassed)}
              </div>
            </div>
          </div>

          <div className="minesweeper-container w-full">
            <div className="minesweeper-stats mb-4 text-sm px-4">
              <span>Books: {MS_MINES}</span>
              <span>Flags: {flags}</span>
              <span>Hints: {hintsUsed}</span>
            </div>
            
            <div className="minesweeper-grid mb-8" onContextMenu={(e) => e.preventDefault()}>
              {grid.map((row, r) =>
                row.map((cell, c) => (
                  <div
                    key={`${r}-${c}`}
                    className={`ms-cell ${cell.isRevealed ? 'revealed' : ''} ${cell.isRevealed && cell.isMine ? 'mine' : ''} ${cell.isFlagged && !cell.isRevealed ? 'flag' : ''}`}
                    onClick={() => handleReveal(r, c)}
                    onContextMenu={(e) => handleFlag(e, r, c)}
                  >
                    {cell.isRevealed ? (
                      cell.isMine ? '📚' : (cell.neighborMines > 0 ? <span className={`ms-num-${cell.neighborMines}`}>{cell.neighborMines}</span> : '')
                    ) : (
                      cell.isFlagged ? '🚩' : ''
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="game-status text-emerald-400 mb-6 h-6">
              {win ? "Library Cleared! Well done." : ""}
              {gameOver ? <span className="text-red-400">You disturbed a stack of books!</span> : ""}
            </div>
            
            <div className="flex w-full items-center justify-center gap-3 flex-wrap">
              <button 
                onClick={handleHint} 
                disabled={win || gameOver || hintCooldown} 
                className="relative overflow-hidden flex items-center gap-2 game-btn m-0 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
              >
                {hintCooldown && <div className="hint-fill" style={{ animationDuration: '5s' }} />}
                <div className="relative z-10 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-emerald-400" /> Hint
                </div>
              </button>
              <button 
                onClick={initGrid} 
                className="flex items-center gap-2 game-btn m-0"
              >
                <RefreshCcw className="h-4 w-4 text-rose-400" /> Restart
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {win && (
          <div className="win-overlay px-4">
            <GlareHover
              glareColor="#fbbf24"
              glareOpacity={0.4}
              glareAngle={-30}
              glareSize={300}
              borderRadius="32px"
              className="w-full max-w-[540px]"
            >
              <motion.div 
                initial={{ y: 100, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 100, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="win-card"
              >
              {/* Particles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="celebration-particle"
                  initial={{ 
                    x: Math.random() * 500 - 250, 
                    y: -100, 
                    opacity: 0,
                    scale: Math.random() * 0.5 + 0.5 
                  }}
                  animate={{ 
                    y: 800, 
                    opacity: [0, 1, 1, 0],
                    rotate: 360
                  }}
                  transition={{ 
                    duration: Math.random() * 2 + 2, 
                    repeat: Infinity,
                    delay: Math.random() * 2 
                  }}
                >
                  <Sparkles size={Math.random() * 12 + 8} className="text-yellow-400/30" />
                </motion.div>
              ))}

              <div className="win-card__trophy">
                <Trophy size={80} className="text-yellow-400" />
              </div>

              <h2 className="win-card__title">Library Cleared!</h2>
              <p className="win-card__subtitle">"Every book is in its place. The silence is preserved. You are the ultimate curator."</p>
              
              <div className="win-card__stats">
                <div className="win-stat">
                  <Clock className="win-stat__icon" size={24} />
                  <span className="win-stat__label">Duration</span>
                  <span className="win-stat__value">{formatTime(timePassed)}</span>
                </div>
                <div className="win-stat">
                  <Lightbulb className="win-stat__icon" size={24} />
                  <span className="win-stat__label">Hints</span>
                  <span className="win-stat__value">{hintsUsed}</span>
                </div>
              </div>

              <div className="win-card__actions">
                <Link href="/puzzle-games" className="win-card__btn win-card__btn--primary">
                  BACK TO ARENA
                </Link>
              </div>
            </motion.div>
            </GlareHover>
          </div>
        )}
      </AnimatePresence>
    </StarfieldBackground>
  );
}
