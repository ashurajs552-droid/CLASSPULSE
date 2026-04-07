"use client";

import { motion } from "framer-motion";
import {
    Camera,
    Scan,
    Smile,
    UserCheck,
    Smartphone,
    BrainCircuit,
    BarChart,
    FileText,
    ArrowDown
} from "lucide-react";
import GlassCard from "@/components/GlassCard";

const pipelineSteps = [
    { id: 1, title: "Camera Input", icon: Camera, color: "text-blue-400" },
    { id: 2, title: "Face Detection", icon: Scan, color: "text-cyan-400" },
    { id: 3, title: "Emotion Recognition", icon: Smile, color: "text-purple-400" },
    { id: 4, title: "Head Pose & Attention", icon: UserCheck, color: "text-emerald-400" },
    { id: 5, title: "Object Detection (YOLO)", icon: Smartphone, color: "text-red-400" },
    { id: 6, title: "Engagement Analysis", icon: BrainCircuit, color: "text-amber-400" },
    { id: 7, title: "Analytics Engine", icon: BarChart, color: "text-indigo-400" },
    { id: 8, title: "Dashboard & AI Reports", icon: FileText, color: "text-rose-400" },
];

export default function ArchitecturePage() {
    return (
        <div className="pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 font-outfit">AI Workflow</h1>
                    <p className="text-xl text-gray-400">
                        The end-to-end pipeline that powers ClassPulse AI, from raw camera pixels to actionable classroom reports.
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {pipelineSteps.map((step, i) => (
                        <div key={step.id} className="flex flex-col items-center">
                            <GlassCard
                                delay={i * 0.1}
                                className="w-full max-w-lg cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${step.color}`}>
                                        <step.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white">{step.title}</h3>
                                        <p className="text-sm text-gray-400">Step {step.id} of the AI Pipeline</p>
                                    </div>
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="text-accent font-bold"
                                    >
                                        ACTIVE
                                    </motion.div>
                                </div>
                            </GlassCard>

                            {i < pipelineSteps.length - 1 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 40 }}
                                    transition={{ delay: i * 0.1 + 0.3 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="w-0.5 h-full bg-gradient-to-b from-accent to-transparent"></div>
                                    <ArrowDown className="w-5 h-5 text-accent -mt-2" />
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
