import { useState, useEffect, useCallback, useRef } from 'react';

export type GameMode = 'classic' | 'time';

export interface Block {
  id: string;
  value: number;
  row: number;
  col: number;
}

export const GRID_COLS = 7;
export const GRID_ROWS = 10;
export const INITIAL_ROWS = 4;
export const MAX_VALUE = 9;

export function useGameLogic() {
  const [grid, setGrid] = useState<Block[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [target, setTarget] = useState<number>(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [mode, setMode] = useState<GameMode | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPaused, setIsPaused] = useState(false);

  // Generate a new target
  const generateTarget = useCallback(() => {
    // Target between 10 and 25 for early game, maybe scaling later
    const newTarget = Math.floor(Math.random() * 16) + 10;
    setTarget(newTarget);
  }, []);

  // Initialize game
  const startGame = (selectedMode: GameMode) => {
    const initialGrid: Block[] = [];
    for (let r = 0; r < INITIAL_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        initialGrid.push({
          id: Math.random().toString(36).substr(2, 9),
          value: Math.floor(Math.random() * MAX_VALUE) + 1,
          row: GRID_ROWS - 1 - r,
          col: c,
        });
      }
    }
    setGrid(initialGrid);
    setScore(0);
    setGameOver(false);
    setMode(selectedMode);
    setSelectedIds([]);
    setTimeLeft(10);
    generateTarget();
  };

  // Add a new row at the bottom
  const addRow = useCallback(() => {
    setGrid((prev) => {
      // Check if any block is at row 0 (top)
      const isFull = prev.some((b) => b.row === 0);
      if (isFull) {
        setGameOver(true);
        return prev;
      }

      // Move existing blocks up
      const movedGrid = prev.map((b) => ({ ...b, row: b.row - 1 }));

      // Add new row at the bottom (GRID_ROWS - 1)
      const newRow: Block[] = [];
      for (let c = 0; c < GRID_COLS; c++) {
        newRow.push({
          id: Math.random().toString(36).substr(2, 9),
          value: Math.floor(Math.random() * MAX_VALUE) + 1,
          row: GRID_ROWS - 1,
          col: c,
        });
      }

      return [...movedGrid, ...newRow];
    });
    
    if (mode === 'time') {
      setTimeLeft(10);
    }
  }, [mode]);

  // Handle block click
  const toggleBlock = (id: string) => {
    if (gameOver || isPaused) return;
    
    // Safety check: ensure block still exists
    if (!grid.some(b => b.id === id)) return;
    
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      return [...prev, id];
    });
  };

  // Check sum
  useEffect(() => {
    if (selectedIds.length === 0 || gameOver || isPaused) return;

    const selectedBlocks = grid.filter((b) => selectedIds.includes(b.id));
    const currentSum = selectedBlocks.reduce((acc, b) => acc + b.value, 0);

    if (currentSum === target && target > 0) {
      // Success!
      setScore((s) => s + (selectedIds.length * 10));
      
      // Clear selection immediately to prevent re-triggering the effect
      setSelectedIds([]);
      
      setGrid((prev) => {
        // 1. Remove selected blocks
        const remaining = prev.filter((b) => !selectedIds.includes(b.id));
        
        // 2. Apply gravity to remaining blocks (compact to bottom)
        const afterGravity: Block[] = [];
        for (let c = 0; c < GRID_COLS; c++) {
          const colBlocks = remaining
            .filter((b) => b.col === c)
            .sort((a, b) => b.row - a.row); // Sort from bottom to top
          
          colBlocks.forEach((b, index) => {
            afterGravity.push({
              ...b,
              row: GRID_ROWS - 1 - index
            });
          });
        }

        // 3. If classic mode, shift everything up and add a new row
        if (mode === 'classic') {
          // Check if we can shift up (is any block at the very top?)
          const isFull = afterGravity.some((b) => b.row === 0);
          if (isFull) {
            setGameOver(true);
            return afterGravity;
          }

          // Shift all blocks up by 1
          const shifted = afterGravity.map(b => ({ ...b, row: b.row - 1 }));
          
          // Add new row at the bottom
          const newRow: Block[] = [];
          for (let c = 0; c < GRID_COLS; c++) {
            newRow.push({
              id: Math.random().toString(36).substr(2, 9),
              value: Math.floor(Math.random() * MAX_VALUE) + 1,
              row: GRID_ROWS - 1,
              col: c,
            });
          }
          return [...shifted, ...newRow];
        }

        return afterGravity;
      });

      generateTarget();
      
      if (mode === 'time') {
        setTimeLeft(10); // Reset timer on success in time mode
      }
    }
  }, [selectedIds, target, grid, generateTarget, mode, gameOver, isPaused]);

  // Timer for Time Mode
  useEffect(() => {
    if (mode !== 'time' || gameOver || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          addRow();
          return 10;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, gameOver, isPaused, addRow]);

  return {
    grid,
    selectedIds,
    target,
    score,
    gameOver,
    mode,
    timeLeft,
    isPaused,
    setIsPaused,
    startGame,
    toggleBlock,
    addRow,
    reset: () => setMode(null),
  };
}
