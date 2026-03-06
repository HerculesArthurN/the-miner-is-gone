import React from 'react';
import { motion } from 'motion/react';
import { Flame, Clock, ShieldCheck, Cpu } from 'lucide-react';

const scribeStats = [
    {
        label: 'FORGE_HEAT',
        value: '2.4s',
        sub: 'TS Compilation Speed',
        icon: Flame,
        valueColor: 'text-[#ff5500]',
        bgGlow: 'from-[#ff5500]/10',
    },
    {
        label: 'GUILD_PURITY',
        value: '100%',
        sub: 'Zero \'any\' usage',
        icon: ShieldCheck,
        valueColor: 'text-[#39ff14]',
        bgGlow: 'from-[#39ff14]/10',
    },
    {
        label: 'STAMINA_TICKS',
        value: '12ms',
        sub: 'Core Loop Execution',
        icon: Clock,
        valueColor: 'text-[#00f2ff]',
        bgGlow: 'from-[#00f2ff]/10',
    },
    {
        label: 'RUNE_COMPAT',
        value: 'MAX',
        sub: 'Type Coverage Level',
        icon: Cpu,
        valueColor: 'text-[#e5d8b5]',
        bgGlow: 'from-[#e5d8b5]/10',
    }
];

export const BentoGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {scribeStats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className={`relative p-8 bg-[#1a1412] border-[2px] border-[#3e342f] group overflow-hidden`}
                    style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}
                >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${stat.bgGlow} to-transparent opacity-20 group-hover:opacity-40 transition-opacity`} />
                    
                    <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-30 transition-opacity">
                        <stat.icon size={64} className={stat.valueColor} strokeWidth={1} />
                    </div>

                    <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <stat.icon size={18} className={stat.valueColor} />
                            <span className="text-xs uppercase tracking-[0.2em] text-[#8c7a6b] font-mono leading-none">
                                {stat.label}
                            </span>
                        </div>
                        
                        <div>
                            <div className={`text-4xl font-bold font-mono tracking-tighter ${stat.valueColor} mb-2 leading-none drop-shadow-[0_0_10px_currentColor]`}>
                                {stat.value}
                            </div>
                            <div className="text-[11px] text-[#8c7a6b] font-mono italic tracking-wide uppercase">
                                // {stat.sub}
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
