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
        primary: 'bg-[#795548] text-amber-50 border-t-2 border-x-4 border-b-[6px] border-[#3e2723] hover:bg-[#5d4037] active:border-b-0 active:translate-y-1 shadow-xl',
        secondary: 'bg-[#f4a261] text-[#3e2723] border-t-2 border-x-4 border-b-[6px] border-[#e76f51] hover:bg-[#e76f51] hover:text-amber-50 active:border-b-0 active:translate-y-1 shadow-xl',
        ghost: 'border-transparent bg-transparent text-[#5d4037] hover:text-[#b71c1c]',
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-8 py-3 text-sm',
        lg: 'px-12 py-4 text-base tracking-widest',
    };

    return (
        <button // Note: Removed framer-motion here to allow CSS active states to work cleanly without conflict
            className={clsx(
                'relative font-serif font-bold uppercase transition-all duration-150 rounded-sm',
                variants[variant],
                sizes[size],
                className
            )}
            {...(props as any)} // Using as any since we switched to standard button
        >
            <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-md">
                {children as React.ReactNode}
            </span>
        </button>
    );
};
