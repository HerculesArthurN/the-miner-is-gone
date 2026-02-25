import React from 'react';
import { Cell, DroneState, CellType } from '../types/game';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';
import { Pickaxe, Gem, Flame, Box, Lock, HelpCircle, Zap } from 'lucide-react';

// ─── Cell Visual Config ───────────────────────────────────────────────────────

interface CellStyle {
  bg: string;
  border: string;
  icon: React.ReactNode;
  label: string;
  glow?: string;
}

function getCellStyle(cell: Cell): CellStyle {
  switch (cell.type) {
    case 'iron':
      return {
        bg: 'bg-slate-700',
        border: 'border-slate-500',
        icon: <Box size={24} className="text-slate-300" strokeWidth={1.5} />,
        label: 'Ferro',
        glow: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
      };
    case 'gold':
      return {
        bg: 'bg-yellow-900/50',
        border: 'border-yellow-600/50',
        icon: <Box size={24} className="text-yellow-400" strokeWidth={1.5} />,
        label: 'Ouro',
        glow: 'shadow-[0_0_12px_rgba(234,179,8,0.3)]',
      };
    case 'crystal':
      return {
        bg: 'bg-blue-900/40',
        border: 'border-blue-500/50',
        icon: <Gem size={22} className="text-blue-300" strokeWidth={1.5} />,
        label: 'Cristal',
        glow: 'shadow-[0_0_12px_rgba(96,165,250,0.4)]',
      };
    case 'isotope':
      return {
        bg: 'bg-purple-900/40',
        border: 'border-purple-500/50',
        icon: <Zap size={22} className="text-purple-300" strokeWidth={1.5} />,
        label: 'Isótopo',
        glow: 'shadow-[0_0_12px_rgba(168,85,247,0.4)]',
      };
    case 'wall':
      return {
        bg: 'bg-slate-900',
        border: 'border-slate-700',
        icon: <Lock size={18} className="text-slate-600" strokeWidth={1.5} />,
        label: 'Parede',
      };
    case 'hazard':
      return {
        bg: 'bg-red-950/60',
        border: 'border-red-700/60',
        icon: <Flame size={22} className="text-red-400" strokeWidth={1.5} />,
        label: 'Perigo',
        glow: 'shadow-[0_0_10px_rgba(239,68,68,0.3)]',
      };
    case 'fog':
      return {
        bg: 'bg-slate-800/60',
        border: 'border-slate-700/40',
        icon: <HelpCircle size={18} className="text-slate-600" strokeWidth={1.5} />,
        label: '???',
      };
    case 'portal':
      return {
        bg: 'bg-cyan-900/30',
        border: 'border-cyan-500/40',
        icon: <Zap size={22} className="text-cyan-400" strokeWidth={1.5} />,
        label: 'Portal',
        glow: 'shadow-[0_0_14px_rgba(6,182,212,0.4)]',
      };
    default: // empty
      return {
        bg: 'bg-slate-800/30',
        border: 'border-slate-700/30',
        icon: null,
        label: '',
      };
  }
}

// ─── Grid Info ────────────────────────────────────────────────────────────────

function getGridCols(cols: number): string {
  const map: Record<number, string> = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
  };
  return map[cols] ?? 'grid-cols-5';
}

function getCellSize(cols: number): string {
  if (cols <= 5) return 'w-16 h-16 sm:w-[72px] sm:h-[72px]';
  if (cols <= 7) return 'w-12 h-12 sm:w-14 sm:h-14';
  return 'w-9 h-9 sm:w-11 sm:h-11';
}

// ─── Component ────────────────────────────────────────────────────────────────

interface GameGridProps {
  grid: Cell[][];
  drone: DroneState;
}

export const GameGrid: React.FC<GameGridProps> = ({ grid, drone }) => {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 5;
  const gridColsClass = getGridCols(cols);
  const cellSizeClass = getCellSize(cols);

  return (
    <div className="relative">
      {/* Grid container */}
      <div
        className={clsx('grid gap-1.5', gridColsClass)}
        role="grid"
        aria-label="Campo de mineração"
      >
        {grid.map((row, y) =>
          row.map((cell, x) => {
            const isDroneHere = drone.x === x && drone.y === y;
            const style = getCellStyle(cell);
            const isFog = cell.type === 'fog' && !cell.revealed;

            return (
              <div
                key={`${x}-${y}`}
                role="gridcell"
                aria-label={`[${x},${y}] ${cell.type}`}
                className={clsx(
                  cellSizeClass,
                  'rounded-lg flex items-center justify-center relative transition-all duration-300',
                  'border',
                  style.bg,
                  style.border,
                  style.glow,
                  isDroneHere && 'ring-1 ring-cyan-400/50',
                  isFog && 'opacity-60',
                )}
              >
                {/* Coordinates (small) */}
                <span className="absolute top-0.5 left-1 text-[8px] text-slate-600 font-mono leading-none select-none opacity-60">
                  {x},{y}
                </span>

                {/* Ore icon */}
                <AnimatePresence>
                  {!isDroneHere && cell.type !== 'empty' && (
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="flex flex-col items-center gap-0.5"
                    >
                      {style.icon}
                      {style.label && (
                        <span className="text-[8px] font-mono font-medium text-slate-400 leading-none">
                          {style.label}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Drone */}
                <AnimatePresence>
                  {isDroneHere && (
                    <motion.div
                      key="drone"
                      layoutId="drone-avatar"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="absolute z-10"
                    >
                      {/* Pulse ring */}
                      <motion.div
                        className="absolute -inset-2 rounded-full bg-cyan-500/20"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      />
                      <div className="relative text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
                        <Pickaxe
                          size={cols <= 5 ? 32 : cols <= 7 ? 24 : 18}
                          strokeWidth={1.5}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Danger indicator */}
                {cell.dangerLevel && cell.dangerLevel > 0 && !isDroneHere && (
                  <div className={clsx(
                    'absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full',
                    cell.dangerLevel > 70 ? 'bg-red-500' :
                      cell.dangerLevel > 40 ? 'bg-amber-500' :
                        'bg-yellow-500'
                  )} />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3 justify-center">
        {[
          { type: 'iron' as CellType, label: 'Ferro' },
          { type: 'gold' as CellType, label: 'Ouro' },
          { type: 'crystal' as CellType, label: 'Cristal' },
          { type: 'hazard' as CellType, label: 'Perigo' },
          { type: 'wall' as CellType, label: 'Parede' },
        ].filter(item => grid.flat().some(c => c.type === item.type)).map(item => {
          const s = getCellStyle({ x: 0, y: 0, type: item.type });
          return (
            <div key={item.type} className="flex items-center gap-1 text-[10px] text-slate-500">
              <div className={clsx('w-3 h-3 rounded border', s.bg, s.border)} />
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};
