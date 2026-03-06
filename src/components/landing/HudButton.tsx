import { motion, HTMLMotionProps } from 'motion/react';
import { clsx } from 'clsx';
import React from 'react';

interface HudButtonProps extends HTMLMotionProps<'button'> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    glow?: boolean;
}

export const HudButton = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    glow = true,
    ...props
}: HudButtonProps) => {
    const variants = {
        primary: 'border-[#5c4d3c] bg-[#1a1412]/80 text-[#00f2ff] hover:bg-[#2a221f] hover:border-[#00f2ff]/50',
        secondary: 'border-[#3e342f] bg-transparent text-[#e5d8b5] hover:bg-[#5c4d3c]/20 hover:border-[#e5d8b5]/50',
        ghost: 'border-transparent bg-transparent text-[#8c7a6b] hover:text-[#00f2ff]',
    };

    const sizes = {
        sm: 'px-4 py-1.5 text-xs',
        md: 'px-8 py-3 text-sm',
        lg: 'px-12 py-4 text-base',
    };

    const glows = {
        primary: 'shadow-[0_0_15px_rgba(0,242,255,0.15)] hover:shadow-[0_0_25px_rgba(0,242,255,0.3)]',
        secondary: 'shadow-[0_0_15px_rgba(229,216,181,0.05)] hover:shadow-[0_0_25px_rgba(229,216,181,0.15)]',
        ghost: 'shadow-none',
    };

    // polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px) - Chamfered corners
    const clipPath = variant !== 'ghost' ? { clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' } : {};

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={clsx(
                'relative font-mono font-bold uppercase tracking-widest transition-all duration-300',
                'border-[2px]',
                variants[variant],
                sizes[size],
                glow && glows[variant],
                className
            )}
            style={clipPath}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children as React.ReactNode}
            </span>
            {variant !== 'ghost' && (
                <div className="absolute inset-0 z-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_3s_linear_infinite]" />
            )}
        </motion.button>
    );
};
