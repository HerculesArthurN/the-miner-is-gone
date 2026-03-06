import React from 'react';
import { motion } from 'motion/react';
import { TerminalSim } from './TerminalSim';
import { HudButton } from './HudButton';
import { BentoGrid } from './BentoGrid';
import { SkillTree } from './SkillTree';
import { Terminal, Shield, Activity, Map as MapIcon, ChevronRight, PenTool } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const onStart = () => navigate('/play');
    return (
        <div className="min-h-screen bg-[#0d0a09] selection:bg-[#00f2ff]/30 text-[#e5d8b5] overflow-x-hidden relative font-mono">
            {/* BACKGROUND EFFECTS */}
            <div className="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(45deg,#1a1412_25%,transparent_25%,transparent_75%,#1a1412_75%,#1a1412),linear-gradient(45deg,#1a1412_25%,transparent_25%,transparent_75%,#1a1412_75%,#1a1412)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(92,77,60,0.15)_0%,transparent_80%)] pointer-events-none" />

            {/* HEADER / NAVIGATION */}
            <nav className="fixed top-0 w-full z-50 border-b-[2px] border-[#3e342f] bg-[#0d0a09]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 border-[2px] border-[#5c4d3c] p-2 flex items-center justify-center bg-[#1a1412] relative group">
                        <div className="absolute inset-0 bg-[#e5d8b5]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <img src="/logo-favicon.svg" alt="Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_5px_rgba(229,216,181,0.5)] brightness-150 contrast-125 sepia hover:sepia-0 transition-all" />
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#00f2ff] shadow-[0_0_5px_#00f2ff]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#e5d8b5] font-bold font-rajdhani tracking-tighter text-xl leading-none uppercase drop-shadow-md">
                            The Miner is Gone
                        </span>
                        <span className="text-[10px] font-mono text-[#8c7a6b] tracking-[0.2em] font-bold pt-1">
                            SCRIBE_VER: 2.0.4-RUNIC
                        </span>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-10 text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-[#8c7a6b]">
                    <a href="#features" className="hover:text-[#00f2ff] transition-colors relative group">
                        // O_RITUAL
                        <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#00f2ff] group-hover:w-full transition-all duration-300" />
                    </a>
                    <a href="#diagnostics" className="hover:text-[#00f2ff] transition-colors relative group">
                        // A_FORJA
                        <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#00f2ff] group-hover:w-full transition-all duration-300" />
                    </a>
                    <a href="#skill-tree" className="hover:text-[#00f2ff] transition-colors relative group">
                        // OS_CÂNTICOS
                        <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#00f2ff] group-hover:w-full transition-all duration-300" />
                    </a>
                </div>
                <HudButton size="sm" variant="primary" onClick={onStart}>
                    [ INITIALIZE PROTOCOL ]
                </HudButton>
            </nav>

            {/* HERO SECTION */}
            <section className="relative pt-40 pb-20 px-6 max-w-[90rem] mx-auto z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-6 xl:col-span-7 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-4 py-2 bg-[#ff5500]/10 border-[2px] border-[#ff5500]/30 text-[#ff5500] text-[11px] font-mono font-bold tracking-[0.2em] uppercase"
                            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                        >
                            <Activity size={14} className="animate-pulse" />
                            <span><span className="text-[#8c7a6b]">SYSTEM:</span> ONLINE | <span className="text-[#8c7a6b]">OVERSEER:</span> MISSING</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-[5.5rem] font-bold font-rajdhani text-[#e5d8b5] leading-[0.9] uppercase tracking-tighter drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
                        >
                            Forge The <br />
                            <span className="text-[#00f2ff] drop-shadow-[0_0_15px_rgba(0,242,255,0.4)]">Type Matrix</span> <br />
                            In The Dark.
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-2xl space-y-4"
                        >
                            <p className="text-lg text-[#8c7a6b] font-mono leading-relaxed">
                                A dormant mining golem awaits its master in Sector 7G. The ancient runes of TypeScript are your only tools to rewrite its navigation protocols.
                            </p>
                            <p className="border-l-4 border-[#ff0000] pl-4 text-[#e5d8b5] font-bold text-sm bg-[#ff0000]/10 py-2">
                                Golem Safety Dictate: Code containing <code className="text-[#ff0000] line-through font-bold">any</code> will trigger immediate cascade failure.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-6 pt-6"
                        >
                            <HudButton size="lg" variant="primary" onClick={onStart}>
                                EXECUTE DEPLOY
                            </HudButton>
                            <HudButton size="lg" variant="secondary" onClick={() => window.open('https://www.typescriptlang.org/docs/handbook/intro.html', '_blank')}>
                                &gt; ACCESS ARCHIVES
                            </HudButton>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-6 xl:col-span-5 relative"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-tr from-[#3e342f]/40 to-transparent blur-2xl -z-10" />
                        <TerminalSim />
                    </motion.div>
                </div>
            </section>

            {/* METRICS SECTION */}
            <section id="diagnostics" className="py-24 border-y-[2px] border-[#3e342f] bg-[#0a0807] relative z-10">
                <div className="max-w-[90rem] mx-auto space-y-16">
                    <div className="text-center justify-center flex flex-col items-center space-y-4">
                        <div className="h-1 w-24 bg-[#00f2ff] mb-2" />
                        <h2 className="text-4xl font-bold font-rajdhani text-[#e5d8b5] uppercase tracking-widest">&gt; THE_FORGE_DIAGNOSTICS</h2>
                        <p className="text-[#8c7a6b] font-mono text-sm uppercase tracking-[0.2em] max-w-lg">Real-time compiler metrics & validation telemetry</p>
                    </div>
                    <BentoGrid />
                </div>
            </section>

            {/* FEATURES / PREVIEW */}
            <section id="features" className="py-32 px-6 max-w-[90rem] mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative group"
                    >
                        {/* Iron Border Box */}
                        <div className="absolute -inset-2 border-[2px] border-[#5c4d3c]/50 transition-all duration-500 group-hover:border-[#00f2ff]/30" style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }} />
                        
                        <div className="bg-[#1a1412] border-[2px] border-[#3e342f] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
                            <div className="p-3 border-b-[2px] border-[#3e342f] bg-[#0d0a09] flex items-center justify-between">
                                <div className="flex gap-2 ml-2">
                                    <div className="w-2.5 h-2.5 bg-[#ff0000]/60" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                                    <div className="w-2.5 h-2.5 bg-[#ffb800]/60" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                                    <div className="w-2.5 h-2.5 bg-[#39ff14]/60" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                                </div>
                                <div className="text-[10px] font-mono tracking-widest text-[#8c7a6b]">GOLEM_TELEMETRY.TSX</div>
                                <div className="w-10" />
                            </div>
                            
                            <img
                                src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=1000"
                                alt="Game Preview"
                                className="w-full h-auto opacity-70 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-700"
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a09] via-transparent to-transparent opacity-80" />

                            {/* UI Brackets */}
                            <div className="absolute top-12 left-12 text-[#00f2ff]/40 font-mono text-2xl drop-shadow-[0_0_8px_#00f2ff]">「</div>
                            <div className="absolute bottom-12 right-12 text-[#00f2ff]/40 font-mono text-2xl drop-shadow-[0_0_8px_#00f2ff] rotate-180">「</div>
                        </div>
                    </motion.div>

                    <div className="space-y-12">
                        <h2 className="text-4xl lg:text-5xl font-bold font-rajdhani text-[#e5d8b5] uppercase tracking-tight drop-shadow-md">
                            Forged for the <br />
                            <span className="text-[#ff5500] drop-shadow-[0_0_15px_rgba(255,85,0,0.4)]">Type Vanguard</span>
                        </h2>
                        
                        <div className="space-y-8">
                            {[
                                { title: "Real-time Telemetry", desc: "Integrated Monaco Editor with parchment styling and level-specific type definitions.", icon: PenTool },
                                { title: "Strict Compliance Doctrine", desc: "Zero tolerance for weak typing. The TypeScript compiler is your unforgiving judge.", icon: Shield },
                                { title: "Visual Logic Manifestation", desc: "Watch your syntax animate a 2D grid in real-time. Debug through motion and ticks.", icon: MapIcon },
                            ].map((f, i) => (
                                <div key={i} className="flex gap-6 items-start group">
                                    <div className="mt-1 p-3 bg-[#1a1412] border-[2px] border-[#3e342f] text-[#w] text-[#00f2ff] group-hover:border-[#00f2ff] group-hover:bg-[#00f2ff]/10 transition-colors" style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}>
                                        <f.icon size={22} className="drop-shadow-[0_0_8px_#00f2ff]" />
                                    </div>
                                    <div>
                                        <h4 className="text-[#e5d8b5] font-bold font-mono text-base tracking-widest uppercase">{f.title}</h4>
                                        <p className="text-[#8c7a6b] text-sm font-mono leading-relaxed mt-2">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4">
                            <HudButton size="lg" variant="primary" onClick={onStart}>
                                [ BEGIN MANUAL CHALLENGES ]
                            </HudButton>
                        </div>
                    </div>
                </div>
            </section>

            {/* SKILL TREE SECTION */}
            <section id="skill-tree" className="py-24 border-t-[2px] border-[#3e342f] bg-[linear-gradient(180deg,#0a0807_0%,#0d0a09_100%)] relative z-10">
                <div className="max-w-[90rem] mx-auto">
                    <div className="text-center flex flex-col items-center space-y-4 mb-16 px-6">
                         <div className="h-1 w-24 bg-[#00f2ff] mb-2" />
                        <h2 className="text-4xl font-bold font-rajdhani text-[#e5d8b5] uppercase tracking-widest">&gt; THE_RUNIC_CURRICULUM</h2>
                        <p className="text-[#8c7a6b] font-mono text-sm uppercase tracking-[0.2em]">Ascend from Act I to Act V in the Scriptorium</p>
                    </div>
                    <SkillTree />
                </div>
            </section>

            {/* TESTIMONIALS / LOGS */}
            <section className="py-32 px-6 max-w-[90rem] mx-auto relative z-10">
                <div className="space-y-16">
                    <div className="text-center flex flex-col items-center space-y-4">
                         <div className="h-1 w-24 bg-[#ff5500] mb-2" />
                        <h2 className="text-3xl font-bold font-rajdhani text-[#e5d8b5] uppercase tracking-widest">&gt; INTERCEPTED_SCROLLS</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { user: "scribe_x86", msg: "The 'Conditional Types' runic challenge actually helped me refactor our guild's design system. Arcane magic." },
                            { user: "golem_tamer", msg: "I used to think 'any' was okay. After Act IV, I can't look at it without invoking a cleansing ritual." },
                            { user: "algo_queen", msg: "Type Gymnastics levels are harder than most LeetCode Hard problems. A flawless trial of logic." },
                        ].map((log, i) => (
                            <div key={i} className="bg-[#1a1412] border-[2px] border-[#3e342f] p-8 font-mono space-y-6 hover:border-[#00f2ff]/50 transition-colors relative group" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#00f2ff]/10 to-transparent pointer-events-none group-hover:from-[#00f2ff]/20 transition-all" />
                                
                                <div className="flex items-center gap-3 text-[10px] text-[#8c7a6b] tracking-widest">
                                    <Terminal size={14} className="text-[#00f2ff]" />
                                    <span>SCROLL ID: {log.user.toUpperCase()}</span>
                                </div>
                                <p className="text-sm text-[#e5d8b5] italic leading-relaxed">
                                    "{log.msg}"
                                </p>
                                <div className="flex justify-end pt-4 border-t-[2px] border-[#3e342f] border-dashed">
                                    <span className="text-[10px] text-[#ff5500] font-bold tracking-[0.2em]">EPOCH: 2142.08.12</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-24 border-t-[2px] border-[#3e342f] bg-[#0a0807] relative z-20">
                <div className="max-w-[90rem] mx-auto px-6 flex flex-col items-center space-y-10">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 border-[2px] border-[#5c4d3c] p-3 flex items-center justify-center bg-[#1a1412] shadow-[0_0_20px_rgba(92,77,60,0.3)]">
                            <img src="/logo-favicon.svg" alt="Logo" className="w-full h-full object-contain filter brightness-150 sepia contrast-125" />
                        </div>
                        <h1 className="text-3xl font-bold font-rajdhani text-[#e5d8b5] uppercase tracking-[0.2em]">The Miner is Gone</h1>
                    </div>
                    <p className="text-[#8c7a6b] font-mono text-sm max-w-2xl text-center leading-relaxed">
                        An educational forge for sovereign engineers. Developed to ensure type safety in the darkest depths of the asteroid belt. No golems were harmed during compilation.
                    </p>
                    <div className="w-24 h-[1px] bg-[#5c4d3c] my-4" />
                    <div className="text-[11px] font-mono text-[#5c4d3c] tracking-[0.3em] font-bold">
                        © 2026 HERCULES ARTHUR NARDELLI | THE GUILD MAINTAINS ALL RIGHTS
                    </div>
                </div>
            </footer>
        </div>
    );
};
