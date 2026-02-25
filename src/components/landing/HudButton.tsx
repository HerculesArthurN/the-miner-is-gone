import { motion, HTMLMotionProps } from 'motion/react';
import { clsx } from 'clsx';

interface HudButtonProps extends HTMLMotionProps<'button'> {
    variant?: 'cyan' | 'amber' | 'green' | 'slate';
    size?: 'sm' | 'md' | 'lg';
    glow?: boolean;
}

export const HudButton = ({
    children,
    className,
    variant = 'cyan',
    size = 'md',
    glow = true,
    ...props
}: HudButtonProps) => {
    const variants = {
        cyan: 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10',
        amber: 'border-neon-amber text-neon-amber hover:bg-neon-amber/10',
        green: 'border-neon-green text-neon-green hover:bg-neon-green/10',
        slate: 'border-slate-700 text-slate-400 hover:bg-slate-700/20',
    };

    const sizes = {
        sm: 'px-3 py-1 text-xs',
        md: 'px-6 py-2 text-sm',
        lg: 'px-8 py-3 text-base',
    };

    const glows = {
        cyan: 'shadow-[0_0_15px_rgba(0,242,255,0.3)] hover:shadow-[0_0_25px_rgba(0,242,255,0.5)]',
        amber: 'shadow-[0_0_15px_rgba(255,184,0,0.3)] hover:shadow-[0_0_25px_rgba(255,184,0,0.5)]',
        green: 'shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_25px_rgba(57,255,20,0.5)]',
        slate: 'shadow-none',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={clsx(
                'relative font-mono font-bold uppercase tracking-widest transition-all duration-300',
                'border bg-transparent clip-path-hud',
                variants[variant],
                sizes[size],
                glow && glows[variant],
                className
            )}
            {...props}
        >
            <span className="relative z-10">{children}</span>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </motion.button>
    );
};
