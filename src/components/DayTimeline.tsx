import React from 'react';
import { clsx } from 'clsx';

export const DayTimeline: React.FC = () => {
  // Generate hours from 00:00 to 24:00 (25 points for 24 intervals)
  const hours = Array.from({ length: 25 }, (_, i) => i);

  return (
    <div className="flex flex-col bg-slate-950 border-r border-slate-800 h-full overflow-y-auto w-20 shrink-0 zen-scrollbar select-none">
      <div className="relative flex flex-col">
        {hours.map((hour) => (
          <div 
            key={hour} 
            className="h-16 border-b border-slate-900/50 relative flex items-start justify-center group transition-all cursor-pointer hover:bg-slate-900/40"
          >
            {/* Left Accent Bar on Hover */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-cyan-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300 z-20" />

            {/* Hour Label - Positioned to align with the top tick */}
            <div className="absolute -top-2.5 left-0 right-0 flex justify-center z-10">
              <span className={clsx(
                "text-[10px] font-mono font-medium px-1 bg-slate-950 transition-colors group-hover:text-cyan-300",
                hour === 24 ? "text-cyan-500/50" : "text-slate-500"
              )}>
                {hour === 24 ? "00:00" : `${hour.toString().padStart(2, '0')}:00`}
              </span>
            </div>
            
            {/* Vertical Accent Line (Right) */}
            <div className="absolute right-0 top-0 w-[2px] h-full bg-slate-800/20 group-hover:bg-cyan-500/40 transition-colors" />
            
            {/* Major Tick (Hour) */}
            <div className="absolute top-0 right-0 w-3 h-[1px] bg-slate-700 group-hover:bg-cyan-500/60 transition-colors" />
            
            {/* Minor Tick (Half-hour) - Only show if not the last marker */}
            {hour < 24 && (
              <div className="absolute top-1/2 right-0 w-1.5 h-[1px] bg-slate-800/50" />
            )}
            
            {/* Pronounced Hover Background Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-500/[0.02] via-transparent to-cyan-500/[0.08] transition-opacity pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayTimeline;
