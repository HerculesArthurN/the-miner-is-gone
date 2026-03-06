import React from 'react';
import { Cell, DroneState, CellType } from '../types/game';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle } from 'lucide-react';

// ─── Cell Visual Config ───────────────────────────────────────────────────────

interface CellStyle {
  bg: string;
  border: string;
  image?: string;
  icon?: React.ReactNode;
  label: string;
  glow?: string;
}

function getCellStyle(cell: Cell): CellStyle {
  switch (cell.type) {
    case 'iron':
      return {
        bg: 'bg-transparent',
        border: 'border-transparent',
        image: '/assets/iron_ore.png',
        label: 'Ferro',
      };
    case 'gold':
      return {
        bg: 'bg-transparent',
        border: 'border-transparent',
        image: '/assets/gold_ore.png',
        label: 'Ouro',
        glow: 'drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]',
      };
    case 'crystal':
      return {
        bg: 'bg-transparent',
        border: 'border-transparent',
        image: '/assets/mana_crystal.png',
        label: 'Cristal',
        glow: 'drop-shadow-[0_0_8px_rgba(0,242,255,0.6)]',
      };
    case 'isotope':
      return {
        bg: 'bg-transparent',
        border: 'border-transparent',
        image: '/assets/dark_isotope.png',
        label: 'Isótopo',
        glow: 'drop-shadow-[0_0_10px_rgba(168,85,247,0.7)]',
      };
    case 'wall':
      return {
        bg: 'bg-transparent',
        border: 'border-transparent',
        image: '/assets/ancient_wall.png',
        label: 'Parede',
      };
    case 'hazard':
      return {
        bg: 'bg-transparent',
        border: 'border-transparent',
        image: '/assets/lava.png',
        label: 'Perigo',
        glow: 'drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]',
      };
    case 'fog':
      return {
        bg: 'bg-[#3e2723]',
        border: 'border-[#2d1b14]',
        icon: <HelpCircle size={20} className="text-[#8d6e63]" strokeWidth={2.5} />,
        label: '???',
      };
    case 'portal':
      return {
        bg: 'bg-transparent',
        border: 'border-transparent',
        image: '/assets/portal.png',
        label: 'Portal',
        glow: 'drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]', /* Using purple/magenta for portal */
      };
    default: // empty
      return {
        bg: 'bg-[#5d4037]/50',
        border: 'border-[#4e342e]/50',
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
                  'flex items-center justify-center relative transition-all duration-300 rounded-[4px]',
                  'border-2 shadow-sm',
                  style.bg,
                  style.border,
                  isDroneHere && 'border-transparent', // Handled by drone outline
                  isFog && 'opacity-90',
                )}
              >
                {/* Coordinates (small) */}
                <span className="absolute top-1 left-1.5 text-[10px] text-[#e6c280] font-mono leading-none select-none opacity-40 font-bold">
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
                      className={clsx("flex flex-col flex-1 items-center justify-center w-full h-full p-2", style.glow)}
                    >
                      {style.image ? (
                         <img src={style.image} alt={style.label} className="w-full h-full object-contain filter drop-shadow hover:scale-110 transition-transform" style={{ imageRendering: 'pixelated' }} />
                      ) : style.icon}
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
                      className="absolute z-10 w-full h-full flex items-center justify-center -translate-y-1"
                    >
                      {/* Pulse ring replacing original ring */}
                      <motion.div
                        className="absolute inset-[0px] rounded-sm border-4 border-[#1b5e20]/40 z-0 bg-[#e6c280]/20"
                        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      />
                      <img src="/assets/runic_golem.png" alt="Runic Golem" className="relative z-10 w-[120%] h-[120%] object-contain drop-shadow-[0_4px_10px_rgba(62,39,35,0.8)]" style={{ imageRendering: 'pixelated' }} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Danger indicator */}
                {cell.dangerLevel && cell.dangerLevel > 0 && !isDroneHere && (
                  <div className={clsx(
                    'absolute top-1 right-1 w-2.5 h-2.5 rounded-sm shadow-md border border-[#fdf6e3]',
                    cell.dangerLevel > 70 ? 'bg-[#b71c1c]' :
                      cell.dangerLevel > 40 ? 'bg-[#ff5500]' :
                        'bg-[#e6c280]'
                  )} />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-5 justify-center bg-[#fdf6e3] px-6 py-3 rounded-sm border-2 border-[#8d6e63] shadow-md z-10 relative">
        {[
          { type: 'iron' as CellType, label: 'Ferro', img: '/assets/iron_ore.png' },
          { type: 'gold' as CellType, label: 'Ouro', img: '/assets/gold_ore.png' },
          { type: 'crystal' as CellType, label: 'Cristal', img: '/assets/mana_crystal.png' },
          { type: 'isotope' as CellType, label: 'Isótopo', img: '/assets/dark_isotope.png' },
          { type: 'hazard' as CellType, label: 'Lava', img: '/assets/lava.png' },
          { type: 'wall' as CellType, label: 'Parede Antiga', img: '/assets/ancient_wall.png' },
        ].filter(item => grid.flat().some(c => c.type === item.type)).map(item => {
          return (
            <div key={item.type} className="flex items-center gap-2 text-sm text-[#5d4037] font-serif font-bold uppercase tracking-widest drop-shadow-sm">
              <img src={item.img} alt={item.label} className="w-5 h-5 filter drop-shadow-sm" style={{ imageRendering: 'pixelated' }} />
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};
