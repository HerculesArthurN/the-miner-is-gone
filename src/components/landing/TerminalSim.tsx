import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const lines = [
    '// INICIALIZANDO LEITURA DO SISTEMA...',
    'const missao = {',
    '  status: "CRÍTICO",',
    '  localizacao: "Setor 7G - Cinturão de Asteroides",',
    '  objetivo: "Automatizar Drone de Mineração #42",',
    '  protocolo: "Implementação Avançada de TypeScript"',
    '};',
    '',
    'function inicializarResgate(idEngenheiro: string) {',
    '  if (idEngenheiro === "DESAPARECIDO") {',
    '    throw new Error("Falha Operacional: Engenheiro não encontrado!");',
    '  }',
    '  return "Aguardando Recrutas...";',
    '}',
    '',
    'const status = inicializarResgate("DESAPARECIDO");',
    '// [ERRO CRÍTICO DETECTADO: USO DE ANY PROIBIDO]'
];

export const TerminalSim: React.FC = () => {
    const [displayedLines, setDisplayedLines] = useState<string[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);

    useEffect(() => {
        if (currentLineIndex < lines.length) {
            const line = lines[currentLineIndex];
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
        <div className="bg-[#1e1e1e]/80 backdrop-blur-xl border border-slate-700/50 p-6 font-mono text-sm leading-relaxed shadow-2xl relative overflow-hidden group">
            {/* HUD Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan/50" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-cyan/50" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-cyan/50" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-cyan/50" />

            {/* Editor Header */}
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-tighter ml-2">
                    sequencia-de-boot.ts — controle-do-drone
                </div>
            </div>

            <div className="space-y-1">
                {displayedLines.map((line, i) => {
                    if (typeof line !== 'string') return null;
                    let colorClass = 'text-slate-300';
                    if (line.startsWith('//')) colorClass = 'text-slate-600 italic';
                    else if (line.includes('const') || line.includes('function') || line.includes('if') || line.includes('return') || line.includes('throw')) colorClass = 'text-purple-400';
                    else if (line.includes('"')) colorClass = 'text-amber-200';

                    if (line.includes('CRÍTICO')) colorClass = 'text-red-400 font-bold';
                    if (line.includes('ANY PROIBIDO')) colorClass = 'text-red-500 font-bold bg-red-500/10 px-1';

                    return (
                        <div key={i} className="flex gap-4">
                            <span className="w-4 text-right text-slate-700 select-none text-[10px]">{i + 1}</span>
                            <span className={colorClass}>{line}</span>
                        </div>
                    );
                })}
                {currentLineIndex < lines.length && (
                    <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-2 h-4 bg-neon-cyan ml-1 translate-y-1"
                    />
                )}
            </div>

            {/* Decorative scanline overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        </div>
    );
};
