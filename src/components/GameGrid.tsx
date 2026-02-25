import React from 'react';
import { Cell, Position } from '../types/game';
import { clsx } from 'clsx';
import { Box, Pickaxe } from 'lucide-react';
import { motion } from 'motion/react';

interface GameGridProps {
  grid: Cell[][];
  drone: Position;
}

export const GameGrid: React.FC<GameGridProps> = ({ grid, drone }) => {
  return (
    <div className="relative bg-slate-900 p-4 rounded-xl shadow-2xl border border-slate-700">
      <div className="grid grid-cols-5 gap-2">
        {grid.map((row, y) =>
          row.map((cell, x) => {
            const isDroneHere = drone.x === x && drone.y === y;
            const isIron = cell.type === 'iron';

            return (
              <div
                key={`${x}-${y}`}
                className={clsx(
                  "w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center relative transition-colors duration-300",
                  "border border-slate-700/50",
                  "bg-slate-800"
                )}
              >
                {/* Coordinates Label */}
                <span className="absolute top-1 left-1 text-[10px] text-slate-500 font-mono">
                  {x},{y}
                </span>

                {/* Iron Block */}
                {isIron && (
                  <div className="text-amber-500 animate-pulse">
                    <Box size={32} strokeWidth={2} />
                    <span className="absolute -bottom-1 text-[10px] font-bold w-full text-center">Ferro</span>
                  </div>
                )}

                {/* Drone */}
                {isDroneHere && (
                  <motion.div
                    layoutId="drone"
                    className="absolute z-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                    initial={false}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <div className="relative">
                      <div className="absolute -inset-2 bg-cyan-500/20 rounded-full blur-sm"></div>
                      <Pickaxe size={40} />
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
