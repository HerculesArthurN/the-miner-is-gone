import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Database, Box, Layers, Workflow, GitMerge, ShieldCheck, Terminal, BrainCircuit } from 'lucide-react';

const acts = [
    { id: 1, title: 'Ato I: A Superfície', icon: Terminal, desc: 'Domine tipos de variáveis, interfaces e assinaturas de funções na forja básica.' },
    { id: 2, title: 'Ato II: O Labirinto', icon: ShieldCheck, desc: 'Técnicas de narrowing, união e intersecção para guiar o golem no subsolo.' },
    { id: 3, title: 'Ato III: A Câmara Modular', icon: Box, desc: 'Extraia o poder dos Generics. Construa sistemas adaptativos e cofres seguros.' },
    { id: 4, title: 'Ato IV: A Linhagem', icon: Layers, desc: 'Arquitetura avançada. Herança, classes abstratas e controle de visibilidade arcana.' },
    { id: 5, title: 'Ato V: O Arquiteto', icon: BrainCircuit, desc: 'Ginástica de Tipos pura. Mapped Types e manipulação condicional no cume da montanha.' },
];

export const SkillTree: React.FC = () => {
    return (
        <div className="relative py-20 px-4">
            <div className="max-w-4xl mx-auto space-y-16">
                {acts.map((act, i) => (
                    <motion.div
                        key={act.id}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: i * 0.15 }}
                        viewport={{ once: true }}
                        className={`flex items-start gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                    >
                        {/* Node timeline center */}
                        <div className="hidden md:flex flex-col items-center justify-center relative translate-y-4">
                            <div className="w-16 h-16 bg-[#1a1412] border-[2px] border-[#3e342f] flex items-center justify-center relative z-10" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
                                <act.icon size={24} className="text-[#e5d8b5]" />
                            </div>
                            {i < acts.length - 1 && (
                                <div className="absolute top-16 w-[2px] h-32 bg-gradient-to-b from-[#3e342f] to-transparent" />
                            )}
                        </div>

                        {/* Node Card */}
                        <div className={`flex-1 p-8 border-[2px] border-[#3e342f] bg-[#1a1412] relative group hover:border-[#5c4d3c] transition-colors`} style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-mono text-[#00f2ff]/60 tracking-widest uppercase">
                                    [ RUNE_UNLOCK_{act.id} ]
                                </span>
                                <ChevronRight size={14} className="text-[#8c7a6b] group-hover:text-[#00f2ff] transition-colors" />
                            </div>
                            <h3 className="text-2xl font-bold font-rajdhani text-[#e5d8b5] mb-3 uppercase tracking-tight">
                                {act.title}
                            </h3>
                            <p className="text-sm text-[#8c7a6b] font-mono leading-relaxed">
                                {act.desc}
                            </p>
                            
                            {/* Hover Runic Glow */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-[#1a1412] -z-10" />
        </div>
    );
};
