"use client";

import { motion } from "framer-motion";
import { ReactNode, ButtonHTMLAttributes } from "react";

interface GlowingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "outline";
    className?: string;
}

export default function GlowingButton({ children, variant = "primary", className = "", ...props }: GlowingButtonProps) {
    // Destructure to avoid passing incompatible props to motion.button
    const { onDrag, onDragStart, onDragEnd, ...rest } = props as any;

    const variants = {
        primary: "bg-primary text-white border-primary/20 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]",
        secondary: "bg-accent text-slate-900 border-accent/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]",
        outline: "bg-transparent text-white border-white/20 hover:border-white/40",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`glow-button px-6 py-3 rounded-full font-bold border transition-all duration-300 ${variants[variant]} ${className}`}
            {...rest}
        >
            {children}
        </motion.button>
    );
}
