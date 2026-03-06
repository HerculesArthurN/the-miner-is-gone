import React from 'react';
import { motion } from 'motion/react';
import { TerminalSim } from './TerminalSim';
import { HudButton } from './HudButton';
import { BentoGrid } from './BentoGrid';
import { SkillTree } from './SkillTree';
import { Scroll, Shield, Flame, Map as MapIcon, ChevronRight, Pickaxe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const onStart = () => navigate('/play');
    
    return (
        <div className="min-h-screen bg-[#fdf6e3] selection:bg-[#e6c280]/50 text-[#3e2723] overflow-x-hidden relative font-mono">
           
            {/* BACKGROUND EFFECTS */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(45deg,#3e2723_25%,transparent_25%,transparent_75%,#3e2723_75%,#3e2723),linear-gradient(45deg,#3e2723_25%,transparent_25%,transparent_75%,#3e2723_75%,#3e2723)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,162,97,0.1)_0%,transparent_80%)] pointer-events-none" />

            {/* HEADER / NAVIGATION */}
            <nav className="fixed top-0 w-full z-50 border-b-8 border-[#5d4037] bg-[#f4ebd8]/95 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-[0_6px_25px_rgba(93,64,55,0.4)]">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 border-4 border-[#8d6e63] p-2 flex items-center justify-center bg-[#e6c280] rounded shadow-[inset_0_0_10px_rgba(93,64,55,0.5)]">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(62,39,35,0.8)]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#b71c1c] font-bold font-serif text-2xl leading-none uppercase drop-shadow-sm tracking-widest">
                            The Master is Gone
                        </span>
                        <span className="text-[11px] font-mono text-[#8d6e63] tracking-[0.2em] font-bold pt-1">
                            SCRIBE_VER: 2.0.4-RUNIC
                        </span>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-10 text-[12px] font-mono font-bold tracking-[0.2em] uppercase text-[#5d4037]">
                    <a href="#features" className="hover:text-[#b71c1c] transition-all relative group">
                        [ O_RITUAL ]
                        <span className="absolute -bottom-2 left-0 w-0 h-[3px] bg-[#b71c1c] group-hover:w-full transition-all duration-300 shadow-sm" />
                    </a>
                    <a href="#diagnostics" className="hover:text-[#b71c1c] transition-all relative group">
                        [ A_FORJA ]
                        <span className="absolute -bottom-2 left-0 w-0 h-[3px] bg-[#b71c1c] group-hover:w-full transition-all duration-300 shadow-sm" />
                    </a>
                    <a href="#skill-tree" className="hover:text-[#b71c1c] transition-all relative group">
                        [ OS_CÂNTICOS ]
                        <span className="absolute -bottom-2 left-0 w-0 h-[3px] bg-[#b71c1c] group-hover:w-full transition-all duration-300 shadow-sm" />
                    </a>
                </div>
                <HudButton size="sm" variant="primary" onClick={onStart}>
                    DESPERTAR GOLEM
                </HudButton>
            </nav>

            {/* HERO SECTION */}
            <section className="relative pt-44 pb-24 px-6 max-w-[90rem] mx-auto z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-6 xl:col-span-7 space-y-10">
                        {/* Status Wax Seal */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#e6c280] border-4 border-[#b71c1c] text-[#b71c1c] text-[12px] font-serif font-bold tracking-[0.1em] uppercase shadow-[4px_4px_0_rgba(183,28,28,0.2)]"
                        >
                            <div className="bg-[#b71c1c] p-1.5 rounded-full text-amber-50 shadow-inner">
                                <Flame size={14} className="animate-pulse" />
                            </div>
                            <span><span className="text-[#8d6e63]">STATUS:</span> FORJA ATIVA | <span className="text-[#8d6e63]">MESTRE DA GUILDA:</span> DESAPARECIDO</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-[5.5rem] font-bold font-serif text-[#1b5e20] leading-[0.95] uppercase tracking-wide drop-shadow-[2px_4px_0_rgba(27,94,32,0.15)]"
                        >
                            A Guilda <br />
                            <span className="text-[#b71c1c] drop-shadow-[2px_4px_0_rgba(183,28,28,0.15)]">Precisa de um</span> <br />
                            Novo Mestre.
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-2xl space-y-6"
                        >
                            <p className="text-xl text-[#3e2723] font-serif italic leading-relaxed bg-[#f4ebd8] p-6 border-4 border-[#8d6e63] shadow-inner drop-shadow-md relative">
                                Domine TypeScript controlando Golems mineradores em um mundo medieval. Do básico aos algoritmos complexos (LeetCode Hard), escreva feitiços de código estritamente tipados.
                                {/* Decorative corners */}
                                <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#5d4037] border-2 border-[#8d6e63] rounded-full" />
                                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#5d4037] border-2 border-[#8d6e63] rounded-full" />
                            </p>
                            <p className="border-l-8 border-[#b71c1c] pl-5 text-[#b71c1c] font-bold text-base font-serif bg-[#fdf6e3] py-4 shadow-[4px_4px_0_rgba(183,28,28,0.1)]">
                                O uso da magia sombria <code className="text-[#fdf6e3] line-through font-mono font-bold px-2 bg-[#b71c1c] mx-1 rounded-sm">any</code> é estritamente proibido.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-6 pt-8"
                        >
                            <HudButton size="lg" variant="primary" onClick={onStart}>
                                DESPERTAR GOLEM
                            </HudButton>
                            <HudButton size="lg" variant="secondary" onClick={() => window.open('https://www.typescriptlang.org/docs/handbook/intro.html', '_blank')}>
                                &gt; LER OS PERGAMINHOS
                            </HudButton>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-6 xl:col-span-5 relative"
                    >
                        <TerminalSim />
                    </motion.div>
                </div>
            </section>

            {/* METRICS SECTION - Omitted dark backgrounds, replaced with royal blue/stone motif */}
            <section id="diagnostics" className="py-24 border-y-8 border-[#5d4037] bg-[#e6c280] relative z-10 shadow-[inner_0_10px_30px_rgba(93,64,55,0.2)]">
                <div className="max-w-[90rem] mx-auto space-y-16">
                    <div className="text-center justify-center flex flex-col items-center space-y-4">
                        <div className="h-2 w-32 bg-[#b71c1c] mb-2 shadow-sm" />
                        <h2 className="text-4xl font-bold font-serif text-[#1b5e20] uppercase tracking-widest drop-shadow-md">DIAGNÓSTICOS DA FORJA</h2>
                        <p className="text-[#8d6e63] font-serif text-lg italic tracking-[0.1em] max-w-lg font-bold">Métricas de runas em tempo real e telemetria mágica</p>
                    </div>
                    {/* BentoGrid will look fine since its children can adapt, but we might need to overwrite BentoGrid styles later if it is too dark */}
                    <div className="opacity-90 grayscale shadow-xl mix-blend-multiply">
                        <BentoGrid />
                    </div>
                </div>
            </section>

            {/* FEATURES / PREVIEW (COMPLETELY REWRITTEN SECTION) */}
            <section id="features" className="py-32 px-6 max-w-[90rem] mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    
                    {/* The Wood Framed Image Container */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative group p-4 bg-[#5d4037] border-8 border-[#3e2723] rounded-sm shadow-[10px_10px_0_rgba(62,39,35,0.3)]"
                    >
                        <div className="bg-[#fdf6e3] border-4 border-[#e6c280] p-2 relative overflow-hidden">
                            {/* Inner wooden border looking like a painting */}
                            <img
                                src="/assets/golem_feature.png"
                                alt="Golem Working on a Bright Cave"
                                className="w-full h-auto object-cover border-4 border-[#3e2723] rounded-[2px] transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Scroll ornaments */}
                            <div className="absolute top-4 left-4 text-[#b71c1c]/40 font-serif text-4xl font-bold">⚜</div>
                            <div className="absolute bottom-4 right-4 text-[#b71c1c]/40 font-serif text-4xl font-bold rotate-180">⚜</div>
                        </div>
                    </motion.div>

                    {/* Features Description */}
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-5xl font-bold font-serif text-[#1b5e20] uppercase tracking-tight drop-shadow-sm leading-tight">
                                A Magia Antiga da <br />
                                <span className="text-[#b71c1c] drop-shadow-md">Tipagem Estrita</span>
                            </h2>
                            <p className="text-[#3e2723] font-serif text-xl leading-relaxed italic border-l-8 border-[#e6c280] pl-6 py-2 mt-4">
                                A magia não é caos, é ordem. Na Guilda, nós não controlamos nossos Golems com comandos soltos; nós os programamos usando a linguagem dos Deuses Antigos: TypeScript.
                            </p>
                        </div>
                        
                        <div className="space-y-10 mt-10">
                            {[
                                { title: "A Forja não Mente (Validações Estáticas)", desc: "Se o seu feitiço tiver falhas lógicas, o Golem não vai se mover. O ambiente detecta erros antes mesmo da picareta bater na pedra.", icon: Shield },
                                { title: "Economia de Estamina (Big O Notation)", desc: "Código ruim gasta energia. Um loop infinito ou uma busca O(n²) vai sobreaquecer as runas do seu Golem. Aprenda a otimizar sua lógica.", icon: Flame },
                                { title: "O Grimório Oficial", desc: "Cada missão está diretamente conectada aos Pergaminhos Oficiais (TypeScript Handbook). Você joga melhor lendo a documentação.", icon: Scroll },
                            ].map((f, i) => (
                                <div key={i} className="flex gap-6 items-start group">
                                    {/* Wax Seal Icon */}
                                    <div className="mt-1 w-16 h-16 rounded-full bg-[#b71c1c] text-[#fdf6e3] border-4 border-[#e6c280] shadow-[4px_4px_0_rgba(183,28,28,0.2)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <f.icon size={26} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h4 className="text-[#1b5e20] font-bold font-serif text-2xl tracking-wide uppercase mb-2">{f.title}</h4>
                                        <p className="text-[#5d4037] text-lg font-serif leading-relaxed bg-[#f4ebd8] p-4 border-2 border-[#e6c280] shadow-sm">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SKILL TREE SECTION */}
            <section id="skill-tree" className="py-24 border-y-8 border-[#5d4037] bg-[#f4ebd8] relative z-10 shadow-[inner_0_5px_15px_rgba(93,64,55,0.1)]">
                <div className="max-w-[90rem] mx-auto">
                    <div className="text-center flex flex-col items-center space-y-5 mb-16 px-6">
                         <div className="h-2 w-32 bg-[#1b5e20] mb-2 shadow-sm" />
                        <h2 className="text-4xl font-bold font-serif text-[#b71c1c] uppercase tracking-widest drop-shadow-sm">O CAMINHO DO ARQUIMAGO</h2>
                        <p className="text-[#5d4037] font-serif text-xl italic font-bold">Ascenda do Ato I ao Ato V na Torre do Scriptorium</p>
                    </div>
                    {/* Overwriting SkillTree background colors inside */}
                    <div className="[&>div]:bg-transparent">
                         <SkillTree />
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS / LOGS */}
            <section className="py-32 px-6 max-w-[90rem] mx-auto relative z-10">
                <div className="space-y-16">
                    <div className="text-center flex flex-col items-center space-y-5">
                         <div className="h-2 w-32 bg-[#e6c280] mb-2 shadow-sm" />
                        <h2 className="text-4xl font-bold font-serif text-[#1b5e20] uppercase tracking-widest drop-shadow-sm">PERGAMINHOS INTERCEPTADOS</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { user: "aprendiz_js", msg: "Eu costumava usar any quando os feitiços davam errado. Depois de passar pelo Ato III, meu Golem agora lida com interfaces complexas e Discriminated Unions sem quebrar a forja." },
                            { user: "mestre_sênior", msg: "O Desafio da Mochila no Ato IV fritou minha mente. Aprender Generics aplicando em um inventário com limite de peso foi a melhor aula de Estruturas que já tive." },
                            { user: "rainha_algo", msg: "As provações em Tipagem Avançada são mais difíceis que os pergaminhos míticos do LeetCode. Um teste impecável de lógica rítmica e paciência." },
                        ].map((log, i) => (
                            <div key={i} className="bg-[#fdf6e3] border-4 border-[#8d6e63] p-8 font-serif space-y-6 shadow-[6px_6px_0_rgba(141,110,99,0.2)] hover:-translate-y-2 hover:shadow-[10px_10px_0_rgba(183,28,28,0.2)] transition-all relative group group-hover:border-[#b71c1c]">
                                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#1b5e20] border-4 border-[#e6c280]" />
                                <div className="absolute top-0 right-0 w-16 h-16 bg-[#b71c1c]/5 pointer-events-none group-hover:bg-[#b71c1c]/10 transition-all" />
                                
                                <div className="flex items-center gap-3 text-[12px] text-[#b71c1c] tracking-widest font-bold">
                                    <Scroll size={18} strokeWidth={2.5} />
                                    <span>{log.user.toUpperCase()}</span>
                                </div>
                                <p className="text-lg text-[#3e2723] italic leading-relaxed font-semibold">
                                    "{log.msg}"
                                </p>
                                <div className="flex justify-end pt-4 border-t-2 border-[#e6c280] border-dashed">
                                    <span className="text-[11px] text-[#5d4037] font-bold tracking-[0.2em] font-mono">ERA: 1042.08.12</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER & FINAL CTA */}
            <footer className="py-24 border-t-8 border-[#5d4037] bg-[#e6c280] relative z-20 shadow-[inner_0_20px_30px_rgba(93,64,55,0.2)]">
                <div className="max-w-[90rem] mx-auto px-6 flex flex-col items-center space-y-12">
                    
                    {/* Final CTA Block (Wood Plank Base) */}
                    <div className="w-full max-w-4xl bg-[#fdf6e3] border-8 border-[#8d6e63] p-12 text-center flex flex-col items-center justify-center space-y-8 shadow-[12px_12px_0_rgba(93,64,55,0.3)] mb-12 relative overflow-hidden">
                        <Pickaxe size={64} className="text-[#b71c1c]/80 drop-shadow-sm absolute -right-6 top-6 rotate-45" />
                        <h2 className="text-4xl md:text-5xl font-bold font-serif text-[#1b5e20] uppercase tracking-widest z-10">
                            A Picareta Está no Chão
                        </h2>
                        <p className="text-[#5d4037] font-serif text-xl max-w-2xl leading-relaxed italic font-bold z-10 border-b-4 border-[#e6c280] pb-6">
                            A mina não vai se explorar sozinha. Abra o editor, invoque seus tipos e prove que você é digno de liderar a Guilda.
                        </p>
                        <div className="pt-2 z-10 text-xl">
                            <HudButton size="lg" variant="primary" onClick={onStart}>
                                ASSUMIR O COMANDO DA MINA
                            </HudButton>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 border-4 border-[#5d4037] p-4 flex items-center justify-center bg-[#fdf6e3] rounded shadow-[4px_4px_0_rgba(93,64,55,0.4)]">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain filter drop-shadow hover:scale-105 transition-transform" />
                        </div>
                        <h1 className="text-4xl font-bold font-serif text-[#b71c1c] uppercase tracking-[0.2em] drop-shadow-sm">The Master is Gone</h1>
                    </div>
                    <p className="text-[#5d4037] font-serif text-lg max-w-2xl text-center leading-relaxed font-semibold">
                        Uma forja educacional para engenheiros soberanos. Nossos Golems não sofrem dano durante as compilações, apenas arranhões nas pedras.
                    </p>
                    <div className="w-32 h-[4px] bg-[#8d6e63] my-6 rounded" />
                    <div className="text-[12px] font-mono text-[#5d4037] tracking-[0.3em] font-bold">
                        © 2026 HERCULES ARTHUR NARDELLI | A GUILDA MANTÉM OS DIREITOS
                    </div>
                </div>
            </footer>
        </div>
    );
};
