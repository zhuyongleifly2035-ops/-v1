import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Timer, 
  RotateCcw, 
  Play, 
  Pause, 
  Home,
  ChevronRight,
  Calculator,
  Zap
} from 'lucide-react';
import { useGameLogic, GRID_COLS, GRID_ROWS, GameMode } from './useGameLogic';

export default function App() {
  const {
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
    reset
  } = useGameLogic();

  const currentSum = grid
    .filter((b) => selectedIds.includes(b.id))
    .reduce((acc, b) => acc + b.value, 0);

  if (!mode) {
    return (
      <div className="min-h-screen flex flex-items-center justify-center p-6 bg-zinc-950">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8 text-center"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <Calculator className="w-10 h-10 text-emerald-500" />
            </div>
            <h1 className="text-5xl font-display font-bold tracking-tight text-white">
              数字 <span className="text-emerald-500">求和</span>
            </h1>
            <p className="text-zinc-400 text-lg">
              组合数字以达到目标。不要让方块堆积到顶部！
            </p>
          </div>

          <div className="grid gap-4">
            <button
              onClick={() => startGame('classic')}
              className="group relative flex items-center justify-between p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-all hover:bg-zinc-800/50"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg text-white">经典模式</h3>
                  <p className="text-sm text-zinc-500">无尽生存挑战</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
            </button>

            <button
              onClick={() => startGame('time')}
              className="group relative flex items-center justify-between p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-all hover:bg-zinc-800/50"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Timer className="w-6 h-6 text-amber-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg text-white">计时模式</h3>
                  <p className="text-sm text-zinc-500">快节奏倒计时</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-amber-500 transition-colors" />
            </button>
          </div>

          <div className="pt-8 text-xs text-zinc-600 font-mono uppercase tracking-widest">
            使用 React & Tailwind 构建
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center p-4 md:p-8 select-none">
      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={reset}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <Home className="w-5 h-5" />
          </button>
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">得分</p>
            <p className="text-2xl font-display font-bold text-white">{score}</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">目标</p>
          <div className="w-20 h-20 rounded-3xl bg-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <span className="text-4xl font-display font-bold text-zinc-950">{target}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right space-y-1">
            {mode === 'time' ? (
              <>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">时间</p>
                <p className={`text-2xl font-display font-bold ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                  {timeLeft}秒
                </p>
              </>
            ) : (
              <>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">模式</p>
                <p className="text-lg font-display font-bold text-zinc-400 capitalize">
                  {mode === 'classic' ? '经典' : '计时'}
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => !gameOver && !isPaused && addRow()}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
              title="Add Row"
            >
              <ChevronRight className="w-4 h-4 rotate-90" />
            </button>
            <button 
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative w-full max-w-lg aspect-[7/10] bg-zinc-900/50 rounded-3xl border border-white/5 overflow-hidden p-2">
        {/* Grid Background */}
        <div 
          className="absolute inset-0 grid opacity-10"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`
          }}
        >
          {Array.from({ length: GRID_COLS * GRID_ROWS }).map((_, i) => (
            <div key={i} className="border border-white/10" />
          ))}
        </div>

        {/* Blocks */}
        <AnimatePresence>
          {grid.map((block) => {
            const isSelected = selectedIds.includes(block.id);
            return (
              <motion.button
                key={block.id}
                layoutId={block.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  x: `${block.col * 100}%`,
                  y: `${block.row * 100}%`,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={() => toggleBlock(block.id)}
                className={`absolute w-[calc(100%/${GRID_COLS})] h-[calc(100%/${GRID_ROWS})] p-1 z-10`}
              >
                <div className={`
                  w-full h-full rounded-xl flex items-center justify-center text-2xl font-display font-bold transition-all duration-200
                  ${isSelected 
                    ? 'bg-emerald-500 text-zinc-950 scale-90 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                    : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-white/5 shadow-lg'
                  }
                `}>
                  {block.value}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {/* Current Sum Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className={`
            px-6 py-2 rounded-full backdrop-blur-xl border transition-all duration-300 flex items-center gap-2
            ${currentSum === target 
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500 scale-110' 
              : currentSum > target
                ? 'bg-red-500/20 border-red-500 text-red-500'
                : 'bg-white/5 border-white/10 text-zinc-400'
            }
          `}>
            <Zap className={`w-4 h-4 ${currentSum === target ? 'fill-current' : ''}`} />
            <span className="font-display font-bold text-lg">{currentSum} / {target}</span>
          </div>
        </div>

        {/* Pause Overlay */}
        <AnimatePresence>
          {isPaused && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="text-center space-y-6">
                <h2 className="text-4xl font-display font-bold text-white">已暂停</h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-zinc-950 hover:scale-110 transition-transform"
                >
                  <Play className="w-8 h-8 fill-current" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over Overlay */}
        <AnimatePresence>
          {gameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-8"
            >
              <div className="text-center space-y-8 max-w-xs w-full">
                <div className="space-y-2">
                  <h2 className="text-5xl font-display font-bold text-white">游戏结束</h2>
                  <p className="text-zinc-500 font-mono uppercase tracking-widest text-xs">最终得分</p>
                  <p className="text-6xl font-display font-bold text-emerald-500">{score}</p>
                </div>
                
                <div className="grid gap-3">
                  <button 
                    onClick={() => startGame(mode)}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-emerald-500 text-zinc-950 font-bold text-lg hover:bg-emerald-400 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    再试一次
                  </button>
                  <button 
                    onClick={reset}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-bold text-lg hover:bg-zinc-800 transition-colors"
                  >
                    <Home className="w-5 h-5" />
                    主菜单
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      <div className="mt-8 w-full max-w-lg p-6 rounded-3xl glass text-center">
        <p className="text-zinc-400 text-sm leading-relaxed">
          选择方块使其总和等于 <span className="text-emerald-500 font-bold">目标数字</span>。 
          {mode === 'classic' 
            ? " 每次成功都会增加新的一行。" 
            : " 在时间耗尽前清除它们！"}
        </p>
      </div>
    </div>
  );
}
