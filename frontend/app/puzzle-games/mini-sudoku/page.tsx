"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import StarfieldBackground from "@/components/background/StarfieldBackground";
import "../puzzle-games.css";
import GlareHover from "@/components/ui/GlareHover";
import { Puzzle, RefreshCcw, Undo2, Lightbulb, Trophy, Clock, Sparkles, Lock } from "lucide-react";
import { useAuth } from "@backend/AuthProvider";
import { getDailyPuzzle, logPuzzleSolve, checkPuzzleSolved } from "@backend/db";

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const initialSudokuBoard = [
  ['5','3','0','0','7','0','0','0','0'],
  ['6','0','0','1','9','5','0','0','0'],
  ['0','9','8','0','0','0','0','6','0'],
  ['8','0','0','0','6','0','0','0','3'],
  ['4','0','0','8','0','3','0','0','1'],
  ['7','0','0','0','2','0','0','0','6'],
  ['0','6','0','0','0','0','2','8','0'],
  ['0','0','0','4','1','9','0','0','5'],
  ['0','0','0','0','8','0','0','7','9']
];
const solutionSudokuBoard = [
  ['5','3','4','6','7','8','9','1','2'],
  ['6','7','2','1','9','5','3','4','8'],
  ['1','9','8','3','4','2','5','6','7'],
  ['8','5','9','7','6','1','4','2','3'],
  ['4','2','6','8','5','3','7','9','1'],
  ['7','1','3','9','2','4','8','5','6'],
  ['9','6','1','5','3','7','2','8','4'],
  ['2','8','7','4','1','9','6','3','5'],
  ['3','4','5','2','8','6','1','7','9']
];

export default function MiniSudokuPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [board, setBoard] = useState<string[][]>(initialSudokuBoard.map(r => [...r]));
  const [initialBoard, setInitialBoard] = useState<string[][]>(initialSudokuBoard.map(r => [...r]));
  const [solutionBoard, setSolutionBoard] = useState<string[][]>(solutionSudokuBoard.map(r => [...r]));
  const [puzzleTag, setPuzzleTag] = useState<string>("#0");
  
  const [history, setHistory] = useState<string[][][]>([]);
  const [win, setWin] = useState(false);
  const [isAlreadySolved, setIsAlreadySolved] = useState(false);
  const [timePassed, setTimePassed] = useState(0);
  const [hintCooldown, setHintCooldown] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [gameLoading, setGameLoading] = useState(true);

  // Fetch daily puzzle and check solved status
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setGameLoading(false);
      return;
    }

    const initGame = async () => {
      try {
        const daily = await getDailyPuzzle("sudoku") as any;
        if (daily) {
          const solvedData = await checkPuzzleSolved(user.uid, daily.tag, "sudoku");
          
          if (solvedData) {
            // Already solved: Load win state
            setWin(true);
            setIsAlreadySolved(true);
            setTimePassed(solvedData.stats.duration);
            setHintsUsed(solvedData.stats.hintsUsed);
            
            // Set board to solution so it looks finished
            setBoard(daily.data.solution.map((r: any) => [...r]));
          } else {
            setBoard(daily.data.initial.map((r: any) => [...r]));
          }

          setInitialBoard(daily.data.initial);
          setSolutionBoard(daily.data.solution);
          setPuzzleTag(daily.tag);
        }
      } catch (err) {
        console.error("Failed to load daily puzzle:", err);
      } finally {
        setGameLoading(false);
      }
    };

    initGame();
  }, [user, authLoading]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!win && !gameLoading && user) {
      interval = setInterval(() => {
        setTimePassed(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [win, gameLoading, user]);

  useEffect(() => {
    (window as any).solveSudoku = () => setWin(true);
    return () => { delete (window as any).solveSudoku; };
  }, []);

  const handleChange = (r: number, c: number, v: string) => {
    if (initialBoard[r][c] !== '0' || win) return;
    if (!/^[1-9]?$/.test(v)) return;
    
    setHistory(prev => [...prev, board.map(row => [...row])]);
    
    const newBoard = [...board.map(row => [...row])];
    newBoard[r][c] = v || '0';
    setBoard(newBoard);
    
    let isWin = true;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (newBoard[i][j] !== solutionBoard[i][j]) {
          isWin = false;
        }
      }
    }
    
    if (isWin) {
      setWin(true);
      if (user) {
        logPuzzleSolve(user.uid, puzzleTag, "sudoku", {
          duration: timePassed,
          hintsUsed: hintsUsed
        });
      }
    }
  };

  const handleUndo = () => {
    if (win || history.length === 0) return;
    const previousBoard = history[history.length - 1];
    setHistory(prev => prev.slice(0, prev.length - 1));
    setBoard(previousBoard);
  };

  const handleHint = () => {
    if (win || hintCooldown) return;
    let emptyCells: {r:number, c:number}[] = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (initialBoard[i][j] === '0' && board[i][j] !== solutionBoard[i][j]) {
          emptyCells.push({r: i, c: j});
        }
      }
    }
    if (emptyCells.length > 0) {
      setHintCooldown(true);
      setHintsUsed(h => h + 1);
      setTimeout(() => setHintCooldown(false), 4000);
      const target = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      setHistory(prev => [...prev, board.map(row => [...row])]);
      const newBoard = [...board.map(row => [...row])];
      newBoard[target.r][target.c] = solutionBoard[target.r][target.c];
      setBoard(newBoard);
      
      let isWin = true;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (newBoard[i][j] !== solutionBoard[i][j]) {
            isWin = false;
          }
        }
      }
      if (isWin) {
        setWin(true);
        if (user) {
          logPuzzleSolve(user.uid, puzzleTag, "sudoku", {
            duration: timePassed,
            hintsUsed: hintsUsed
          });
        }
      }
    }
  };

  const checkError = (r: number, c: number) => {
    const val = board[r][c];
    if (val === '0') return false;

    // Check row conflict
    for (let j = 0; j < 9; j++) {
      if (j !== c && board[r][j] === val) return true;
    }

    // Check column conflict
    for (let i = 0; i < 9; i++) {
      if (i !== r && board[i][c] === val) return true;
    }

    // Check 3x3 grid conflict
    const startRow = Math.floor(r / 3) * 3;
    const startCol = Math.floor(c / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if ((i !== r || j !== c) && board[i][j] === val) return true;
      }
    }

    return false;
  };

  const reset = () => {
    setBoard(initialBoard.map(r => [...r]));
    setHistory([]);
    setWin(false);
  };

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
        {!user && !authLoading ? (
          <div className="flex flex-col items-center max-w-[480px] w-full bg-[#0a0e1a]/80 p-10 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md text-center">
            <div className="puzzle-card__icon bg-linear-to-br from-amber-400/20 to-orange-400/20 border-amber-400/30 mb-6">
              <Lock className="h-8 w-8 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Login Required</h2>
            <p className="text-white/60 mb-8">You must be logged in to access the daily puzzles and track your progress.</p>
            <Link href="/auth" className="win-card__btn win-card__btn--primary w-full">
              SIGN IN TO PLAY
            </Link>
          </div>
        ) : gameLoading ? (
          <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
             <p className="text-blue-400 font-medium tracking-widest uppercase text-xs">Syncing Daily Grid...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center max-w-[540px] w-full bg-[#0a0e1a]/80 p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md">
          <div className="flex items-center w-full justify-between mb-8">
            <div className="flex items-center gap-3">
               <div className="puzzle-card__icon shadow-none" style={{ marginBottom: 0, "--icon-accent": "#3b82f6" } as React.CSSProperties}>
                  <Puzzle className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-linear-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">Sudoku</h1>
                </div>
            </div>
            {/* Timer component */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1 font-bold">Timer</span>
              <div className="font-mono text-xl font-medium text-white/90 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 shadow-inner">
                {formatTime(timePassed)}
              </div>
            </div>
          </div>

          <div className="sudoku-container w-full">
            <div className="flex w-full justify-between px-2 mb-3 text-sm font-medium text-white/60">
              <span>Hints Used: {hintsUsed}</span>
            </div>
            <div className={`sudoku-grid mb-8 ${win ? 'sudoku-grid--win' : ''}`}>
              {[0, 1, 2].map(blockRow => (
                [0, 1, 2].map(blockCol => (
                  <div key={`${blockRow}-${blockCol}`} className="sudoku-block">
                    {[0, 1, 2].map(rowOffset => (
                      [0, 1, 2].map(colOffset => {
                        const r = blockRow * 3 + rowOffset;
                        const c = blockCol * 3 + colOffset;
                        const val = board[r][c];
                        return (
                          <input
                            key={`${r}-${c}`}
                            type="text"
                            className={`sudoku-cell ${initialBoard[r][c] !== '0' ? 'readonly' : ''} ${checkError(r,c) ? 'error' : ''}`}
                            value={val === '0' ? '' : val}
                            readOnly={initialBoard[r][c] !== '0' || win}
                            onChange={e => handleChange(r, c, e.target.value)}
                            maxLength={1}
                          />
                        );
                      })
                    ))}
                  </div>
                ))
              ))}
            </div>

            <div className="game-status text-emerald-400 mb-6 h-6">{win ? "Puzzle Solved! Great job." : ""}</div>
            
            <div className="flex w-full items-center justify-center gap-3 flex-wrap">
              <button 
                onClick={handleUndo} 
                disabled={history.length === 0 || win} 
                className="flex items-center gap-2 game-btn m-0 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Undo2 className="h-4 w-4" /> Undo
              </button>
              <button 
                onClick={handleHint} 
                disabled={win || hintCooldown} 
                className="relative overflow-hidden flex items-center gap-2 game-btn m-0 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
              >
                {hintCooldown && <div className="hint-fill" style={{ animationDuration: '4s' }} />}
                <div className="relative z-10 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-emerald-400" /> Hint
                </div>
              </button>
              <button 
                onClick={reset} 
                disabled={isAlreadySolved}
                className="flex items-center gap-2 game-btn m-0 disabled:opacity-30"
              >
                <RefreshCcw className="h-4 w-4 text-cyan-400" /> Restart
              </button>
            </div>
          </div>
        </div>
      )}
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

              <h2 className="win-card__title">Victory!</h2>
              <p className="win-card__subtitle">"The logic is sound. The grid is complete. You have mastered the numbers."</p>
              
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
