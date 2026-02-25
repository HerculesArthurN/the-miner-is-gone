import React from 'react';
import { motion } from 'motion/react';
import { Activity, ShieldAlert, Cpu, Zap, Code, Binary } from 'lucide-react';

const stats = [
    {
        label: 'VELOCIDADE_DE_COMPILAÇÃO',
        value: '0.8s',
        sub: 'Build Incremental',
        icon: Zap,
        color: 'text-neon-cyan',
        bgColor: 'bg-neon-cyan/5',
        borderColor: 'border-neon-cyan/20',
        neonVar: 'cyan'
    },
    {
        label: 'MODO_ESTRITO',
        value: 'ATIVADO',
        sub: 'Sem implicit any',
        icon: ShieldAlert,
        color: 'text-neon-amber',
        bgColor: 'bg-neon-amber/5',
        borderColor: 'border-neon-amber/20',
        neonVar: 'amber'
    },
    {
        label: 'COBERTURA_DE_TIPOS',
        value: '100%',
        sub: 'Lógica Pura',
        icon: Code,
        color: 'text-neon-green',
        bgColor: 'bg-neon-green/5',
        borderColor: 'border-neon-green/20',
        neonVar: 'green'
    },
    {
        label: 'CICLO_DE_TICK',
        value: '12ms',
        sub: 'Buffer de Latência',
        icon: Cpu,
        color: 'text-slate-200',
        bgColor: 'bg-slate-200/5',
        borderColor: 'border-slate-200/20',
        neonVar: 'cyan' // Fallback to cyan
    }
];

export const BentoGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className={`relative p-6 ${stat.bgColor} border ${stat.borderColor} hud-border hud-border-tl hud-border-br overflow-hidden group`}
                >
                    <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <stat.icon size={48} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <stat.icon size={16} className={stat.color} />
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">
                                {stat.label}
                            </span>
                        </div>
                        <div className={`text-3xl font-bold font-mono ${stat.color} mb-1`}>
                            {stat.value}
                        </div>
                        <div className="text-xs text-slate-400 font-mono italic">
                            {stat.sub}
                        </div>
                    </div>

                    {/* Animated Background Line */}
                    <motion.div
                        animate={{ x: ['100%', '-100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-current to-transparent opacity-20"
                        style={{ color: `var(--color-neon-${(stat as any).neonVar || 'cyan'})` }}
                    />
                </motion.div>
            ))}
        </div>
    );
};
