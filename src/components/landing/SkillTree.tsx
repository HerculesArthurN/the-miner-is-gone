import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Database, Box, Layers, Workflow, GitMerge, ShieldCheck, Terminal, BrainCircuit } from 'lucide-react';

const chapters = [
    { id: 1, title: 'O Básico', icon: Terminal, desc: 'Domine tipos de variáveis, interfaces e assinaturas de funções no vácuo.' },
    { id: 2, title: 'União e Intersecção', icon: GitMerge, desc: 'Componha lógica complexa mesclando fluxos de dados díspares.' },
    { id: 3, title: 'Uniões Discriminadas', icon: ShieldCheck, desc: 'Implemente máquinas de estado à prova de falhas para a navegação do drone.' },
    { id: 4, title: 'Generics', icon: Box, desc: 'Construa sistemas de automação reutilizáveis que se adaptam a qualquer recurso.' },
    { id: 5, title: 'Tipos de Utilidade', icon: Layers, desc: 'Extraia e transforme estruturas existentes com operadores de alto nível.' },
    { id: 6, title: 'Tipos Condicionais', icon: Workflow, desc: 'Programe lógica reativa que se ramifica durante a compilação.' },
    { id: 7, title: 'Literais de Template', icon: Database, desc: 'Analise strings e schemas complexos em nível de tipo.' },
    { id: 8, title: 'Ginástica de Tipos', icon: BrainCircuit, desc: 'Resolva desafios de nível LeetCode usando apenas o compilador TS.' },
];

export const SkillTree: React.FC = () => {
    return (
        <div className="relative py-20 px-4">
            <div className="max-w-4xl mx-auto space-y-12">
                {chapters.map((chapter, i) => (
                    <motion.div
                        key={chapter.id}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className={`flex items-center gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                    >
                        <div className="hidden md:flex flex-col items-center justify-center">
                            <div className="w-12 h-12 rounded-none border border-neon-cyan flex items-center justify-center bg-neon-cyan/10 glow-cyan">
                                <chapter.icon size={24} className="text-neon-cyan" />
                            </div>
                            {i < chapters.length - 1 && (
                                <div className="w-[1px] h-12 bg-gradient-to-b from-neon-cyan to-transparent mt-4" />
                            )}
                        </div>

                        <div className={`flex-1 p-6 border border-slate-800 bg-slate-900/50 hud-border ${i % 2 === 0 ? 'hud-border-tr hud-border-bl' : 'hud-border-tl hud-border-br'} backdrop-blur-md hover:border-slate-700 transition-colors group`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-mono text-neon-cyan/60 tracking-widest uppercase">
                                    Capítulo 0{chapter.id}
                                </span>
                                <ChevronRight size={14} className="text-slate-600 group-hover:text-neon-cyan transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold font-rajdhani text-white mb-2 uppercase tracking-tight">
                                {chapter.title}
                            </h3>
                            <p className="text-sm text-slate-400 font-mono leading-relaxed">
                                {chapter.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-slate-800 -z-10" />
        </div>
    );
};
