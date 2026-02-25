import React from 'react';
import { motion } from 'motion/react';
import { TerminalSim } from './TerminalSim';
import { HudButton } from './HudButton';
import { BentoGrid } from './BentoGrid';
import { SkillTree } from './SkillTree';
import { Terminal, Shield, Activity, Search, Map as MapIcon, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const onStart = () => navigate('/play');
    return (
        <div className="min-h-screen bg-slate-950 selection:bg-neon-cyan/30 text-slate-300 overflow-x-hidden">
            {/* BACKGROUND EFFECTS */}
            <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.05)_0%,transparent_70%)] pointer-events-none" />
            <div className="fixed inset-0 scanline opacity-20 pointer-events-none" />

            {/* HEADER / NAVIGATION */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-neon-cyan/50 p-1.5 flex items-center justify-center glow-cyan">
                        <img src="/logo-favicon.svg" alt="Logo" className="w-full h-full object-contain invert" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-bold font-rajdhani tracking-tighter text-lg leading-none uppercase">
                            The Miner is Gone
                        </span>
                        <span className="text-[10px] font-mono text-neon-cyan/60 tracking-[0.2em] font-bold">
                            SYS_VER: 2.0.4-STABLE
                        </span>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-8 text-[11px] font-mono font-bold tracking-widest uppercase text-slate-500">
                    <a href="#features" className="hover:text-neon-cyan transition-colors">// FUNCIONALIDADES</a>
                    <a href="#diagnostics" className="hover:text-neon-cyan transition-colors">// DIAGNÓSTICOS</a>
                    <a href="#skill-tree" className="hover:text-neon-cyan transition-colors">// CURRÍCULO</a>
                </div>
                <HudButton size="sm" variant="cyan" onClick={onStart}>
                    [ INICIALIZAR PROTOCOLO ]
                </HudButton>
            </nav>

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-neon-amber/10 border border-neon-amber/30 text-neon-amber text-[10px] font-mono font-bold tracking-widest uppercase"
                        >
                            <Activity size={12} className="animate-pulse" />
                            STATUS_DO_SISTEMA: ONLINE | ENG_CHEFE: DESAPARECIDO
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-8xl font-bold font-rajdhani text-white leading-tight uppercase tracking-tighter"
                        >
                            Domine o <span className="text-neon-cyan text-glow-cyan">Typescript</span> <br />
                            No Vácuo.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-xl text-lg text-slate-400 font-mono leading-relaxed"
                        >
                            O ano é 2142. Um drone de mineração rebelde está isolado no Setor 7G.
                            Apenas código estrito e type-safe pode reconstruir sua matriz de navegação.
                            Sem espaço para erros de <code className="bg-red-500/20 text-red-400 px-1 px-1 py-0.5 rounded-none border border-red-500/30 font-bold">any</code>.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-4 pt-4"
                        >
                            <HudButton size="lg" variant="cyan" onClick={onStart}>
                                EXECUTAR DEPLOY
                            </HudButton>
                            <HudButton size="lg" variant="slate" onClick={() => window.open('https://www.typescriptlang.org/docs/handbook/intro.html', '_blank')}>
                                &gt; ACESSAR MANUAL
                            </HudButton>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-12 xl:col-span-5 relative"
                    >
                        <TerminalSim />
                    </motion.div>
                </div>
            </section>

            {/* METRICS SECTION */}
            <section id="diagnostics" className="py-20 border-y border-white/5 bg-slate-900/30">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold font-rajdhani text-white uppercase tracking-widest">&gt; DIAGNÓSTICOS_DO_SISTEMA</h2>
                        <p className="text-slate-500 font-mono text-sm uppercase">Métricas de compilação e validação em tempo real</p>
                    </div>
                    <BentoGrid />
                </div>
            </section>

            {/* FEATURES / PREVIEW */}
            <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 border border-neon-cyan/20 hud-border hud-border-tl hud-border-br pointer-events-none" />
                        <div className="bg-slate-900 border border-slate-700 overflow-hidden shadow-2xl relative">
                            <div className="p-2 border-b border-slate-700 bg-slate-800 flex items-center justify-between">
                                <div className="flex gap-1.5 ml-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-600" />
                                    <div className="w-2 h-2 rounded-full bg-slate-600" />
                                    <div className="w-2 h-2 rounded-full bg-slate-600" />
                                </div>
                                <div className="text-[9px] font-mono text-slate-500">LIVE_PREVIEW.JSX</div>
                                <div className="w-10" />
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000"
                                alt="Game Preview"
                                className="w-full h-auto opacity-80 grayscale group-hover:grayscale-0 transition-all"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                            {/* UI Brackets */}
                            <div className="absolute top-8 left-8 text-neon-cyan/50 font-mono text-xl">[ ]</div>
                            <div className="absolute top-8 right-8 text-neon-cyan/50 font-mono text-xl">[ ]</div>
                            <div className="absolute bottom-8 left-8 text-neon-cyan/50 font-mono text-xl">[ ]</div>
                            <div className="absolute bottom-8 right-8 text-neon-cyan/50 font-mono text-xl">[ ]</div>
                        </div>
                    </motion.div>

                    <div className="space-y-8">
                        <h2 className="text-4xl font-bold font-rajdhani text-white uppercase tracking-tight">
                            Feito para a <br />
                            <span className="text-neon-amber">Elite Técnica</span>
                        </h2>
                        <div className="space-y-6">
                            {[
                                { title: "Feedback em Tempo Real", desc: "Editor Monaco integrado com definições de tipo personalizadas para cada nível.", icon: Terminal },
                                { title: "Conformidade Estrita", desc: "Política de tolerância zero para 'any' e tipos fracos. O compilador é seu juiz.", icon: Shield },
                                { title: "Lógica Visual", desc: "Veja seu código animar um grid 2D em tempo real. Depure através do movimento.", icon: MapIcon },
                            ].map((f, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="mt-1 p-2 bg-slate-800 border border-slate-700 text-neon-cyan">
                                        <f.icon size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold font-mono text-sm tracking-wide uppercase">{f.title}</h4>
                                        <p className="text-slate-400 text-xs font-mono leading-relaxed mt-1">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <HudButton variant="amber" onClick={onStart}>
                            [ INICIAR DESAFIOS DO MANUAL ]
                        </HudButton>
                    </div>
                </div>
            </section>

            {/* SKILL TREE SECTION */}
            <section id="skill-tree" className="py-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-4 mb-20 px-6">
                        <h2 className="text-3xl font-bold font-rajdhani text-white uppercase tracking-widest">&gt; O_CURRÍCULO</h2>
                        <p className="text-slate-500 font-mono text-sm uppercase">Do Capítulo 1: O Básico ao Capítulo 8: Ginástica de Tipos</p>
                    </div>
                    <SkillTree />
                </div>
            </section>

            {/* TESTIMONIALS / LOGS */}
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <div className="space-y-12">
                    <h2 className="text-center text-3xl font-bold font-rajdhani text-white uppercase tracking-widest">&gt; COMUNICAÇÕES_INTERCEPTADAS</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { user: "dev_x86", msg: "The 'Conditional Types' level actually helped me refactor our company's design system. Game-changer." },
                            { user: "type_safe_miner", msg: "I used to think 'any' was okay. After Chapter 4, I can't look at it without shaking." },
                            { user: "algo_queen", msg: "Type Gymnastics levels are harder than most LeetCode Hard problems. 10/10 challenge." },
                        ].map((log, i) => (
                            <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 font-mono space-y-4 hover:border-neon-cyan/30 transition-colors">
                                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                    <Terminal size={12} />
                                    RECEBENDO DE: {log.user.toUpperCase()}
                                </div>
                                <p className="text-sm text-slate-300 italic leading-relaxed">
                                    "{log.msg}"
                                </p>
                                <div className="flex justify-end">
                                    <span className="text-[10px] text-neon-cyan opacity-40">TIMESTAMP: 2142.08.12</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-20 border-t border-white/5 bg-slate-950">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 border border-neon-cyan/50 p-2 flex items-center justify-center glow-cyan">
                            <img src="/logo-favicon.svg" alt="Logo" className="w-full h-full object-contain invert" />
                        </div>
                        <h1 className="text-2xl font-bold font-rajdhani text-white uppercase tracking-widest">The Miner is Gone</h1>
                    </div>
                    <p className="text-slate-500 font-mono text-xs max-w-lg text-center leading-relaxed">
                        Uma iniciativa educacional para engenheiros de software. Desenvolvido para garantir a segurança de tipos nos confins do cinturão de asteroides. Nenhum minerador foi ferido durante a compilação.
                    </p>
                    <div className="text-[10px] font-mono text-slate-700 tracking-widest">
                        © 2026 HERCULES ARTHUR NARDELLI | TODOS OS DIREITOS RESERVADOS
                    </div>
                </div>
            </footer>
        </div>
    );
};
