import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const scrollLines = [
    '// SCRIPTORIUM LOG START',
    'const runeForge = {',
    '  status: "ACTIVE",',
    '  location: "Ancient Sector 7G",',
    '  objective: "Automate Golem Scribe #42",',
    '  protocol: "Advanced TypeScript Implementation"',
    '};',
    '',
    'function awakenGolem(overseerId: string) {',
    '  if (overseerId === "MISSING") {',
    '    throw new Error("Operational Failure: Overseer not found.");',
    '  }',
    '  return "Awaiting Recruits...";',
    '}',
    '',
    'const awakeningStatus = awakenGolem("MISSING");',
    '// [CRITICAL ERROR: USE OF ANY FORBIDDEN]'
];

export const TerminalSim: React.FC = () => {
    const [displayedLines, setDisplayedLines] = useState<string[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);

    useEffect(() => {
        if (currentLineIndex < scrollLines.length) {
            const line = scrollLines[currentLineIndex];
            if (currentCharIndex < line.length) {
                const timeout = setTimeout(() => {
                    setDisplayedLines(prev => {
                        const next = [...prev];
                        if (!next[currentLineIndex]) next[currentLineIndex] = '';
                        next[currentLineIndex] += line[currentCharIndex];
                        return next;
                    });
                    setCurrentCharIndex(prev => prev + 1);
                }, 20 + Math.random() * 30);
                return () => clearTimeout(timeout);
            } else {
                const timeout = setTimeout(() => {
                    setCurrentLineIndex(prev => prev + 1);
                    setCurrentCharIndex(0);
                }, 200);
                return () => clearTimeout(timeout);
            }
        }
    }, [currentLineIndex, currentCharIndex]);

    return (
        <div className="bg-[#ebd5b3] backdrop-blur-xl border-[2px] border-[#5c4d3c] p-6 font-mono text-sm leading-relaxed shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group mix-blend-normal text-[#2a221f]">
            {/* Parchment Noise Overlay */}
            <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

            {/* Iron Corners */}
            <div className="absolute top-0 left-0 w-3 h-3 bg-[#3e342f] z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
            <div className="absolute top-0 right-0 w-3 h-3 bg-[#3e342f] z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />
            <div className="absolute bottom-0 left-0 w-3 h-3 bg-[#3e342f] z-10" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }} />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#3e342f] z-10" style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }} />

            {/* Editor Header */}
            <div className="flex items-center gap-2 mb-4 border-b-2 border-[#8c7a6b]/30 pb-2 relative z-10">
                <div className="flex gap-2 font-mono text-xs font-bold text-[#8c7a6b]">
                    <span className="text-[#8c7a6b]">[</span>
                    <span className="text-[#ff5500]">awaken_protocol.ts</span>
                    <span className="text-[#8c7a6b]">]</span>
                </div>
            </div>

            <div className="space-y-1 relative z-10">
                {displayedLines.map((line, i) => {
                    if (typeof line !== 'string') return null;
                    
                    let colorClass = 'text-[#3e342f] font-semibold';
                    let underlineContent = false;
                    
                    if (line.startsWith('//')) colorClass = 'text-[#8c7a6b] italic';
                    else if (line.includes('const') || line.includes('function') || line.includes('if') || line.includes('return') || line.includes('throw')) colorClass = 'text-[#0055ff] font-bold';
                    else if (line.includes('"')) {
                        colorClass = 'text-[#b34700]';
                        if (line.includes('MISSING')) underlineContent = true;
                    }

                    if (line.includes('CRITICAL')) colorClass = 'text-[#ff0000] font-bold uppercase';

                    return (
                        <div key={i} className="flex gap-4 group/line">
                            <span className="w-6 text-right text-[#5c4d3c] select-none text-[10px] tabular-nums opacity-60 font-bold">{i + 1}</span>
                            <span className={colorClass}>
                                {underlineContent && line.includes('MISSING') ? (
                                    <>
                                        {line.split('"MISSING"')[0]}
                                        <span className="text-[#ff0000] underline decoration-wavy decoration-[#ff0000]/70">"MISSING"</span>
                                        {line.split('"MISSING"')[1]}
                                    </>
                                ) : line}
                            </span>
                        </div>
                    );
                })}
                {currentLineIndex < scrollLines.length && (
                    <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-2 h-4 bg-[#ff5500] ml-1 translate-y-1"
                    />
                )}
            </div>
        </div>
    );
};
