"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import {
    Users,
    Smile,
    Camera,
    Smartphone,
    BrainCircuit,
    BarChart,
    FileText
} from "lucide-react";

const features = [
    {
        title: "Student Engagement Detection",
        description: "Analyze attention levels and body language to gauge classroom engagement in real-time.",
        icon: Users,
        color: "from-blue-500 to-cyan-400"
    },
    {
        title: "Emotion Recognition",
        description: "Detect student sentiments (confusion, happiness, boredom) to adjust teaching pace.",
        icon: Smile,
        color: "from-purple-500 to-pink-400"
    },
    {
        title: "Automatic Attendance",
        description: "Lightning-fast facial recognition for hands-free, accurate attendance tracking.",
        icon: Camera,
        color: "from-amber-500 to-orange-400"
    },
    {
        title: "Mobile Phone Detection",
        description: "Identify unauthorized phone usage and provide non-intrusive alerts to educators.",
        icon: Smartphone,
        color: "from-red-500 to-rose-400"
    },
    {
        title: "Confusion Detection",
        description: "AI specifically tuned to recognize quizzical expressions and micro-expressions of doubt.",
        icon: BrainCircuit,
        color: "from-emerald-500 to-teal-400"
    },
    {
        title: "Analytics Dashboard",
        description: "Deep dive into classroom performance with interactive charts and historical data.",
        icon: BarChart,
        color: "from-indigo-500 to-blue-400"
    },
    {
        title: "AI Generated Reports",
        description: "Receive automated session summaries with actionable insights for improvement.",
        icon: FileText,
        color: "from-violet-500 to-purple-400"
    }
];

export default function FeaturesPage() {
    return (
        <div className="pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 font-outfit">Core Features</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Our state-of-the-art AI pipeline provides unmatched insights into the modern classroom experience.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <GlassCard key={i} delay={i * 0.1} className="group h-full flex flex-col">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                <feature.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white font-outfit">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                {feature.description}
                            </p>
                            <div className="mt-auto pt-4 border-t border-white/5 flex items-center text-accent text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                VIEW DOCUMENTATION →
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </div>
    );
}
