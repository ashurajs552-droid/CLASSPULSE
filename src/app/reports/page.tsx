"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import {
    TrendingUp,
    TrendingDown,
    Target,
    Smartphone,
    Clock,
    Download,
    Share2
} from "lucide-react";

export default function ReportsPage() {
    const reports = [
        {
            id: "R-8492",
            session: "Grade 10 - Mathematics",
            date: "Oct 12, 2024",
            engagement: "84%",
            status: "High Engagement",
            color: "text-emerald-400"
        },
        {
            id: "R-8491",
            session: "Grade 11 - Physics",
            date: "Oct 11, 2024",
            engagement: "62%",
            status: "Needs Attention",
            color: "text-amber-400"
        },
        {
            id: "R-8490",
            session: "Grade 10 - History",
            date: "Oct 10, 2024",
            engagement: "45%",
            status: "Low Engagement",
            color: "text-red-400"
        }
    ];

    return (
        <div className="pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
                >
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black font-outfit mb-4">AI Reports</h1>
                        <p className="text-gray-400">Comprehensive session summaries and automated classroom insights.</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-slate-900 font-bold hover:bg-accent/90 transition-colors">
                        <Download className="w-5 h-5" /> Download All Reports
                    </button>
                </motion.div>

                {/* Featured Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <GlassCard className="lg:col-span-2">
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <span className="text-accent text-xs font-black tracking-widest uppercase mb-2 block">Latest Summary</span>
                                <h2 className="text-3xl font-bold text-white">Mathematics Session Insights</h2>
                            </div>
                            <Share2 className="text-gray-500 cursor-pointer hover:text-white transition-colors" />
                        </div>
                        <div className="p-6 bg-white/5 rounded-2xl mb-8 leading-relaxed text-gray-300 italic border-l-4 border-accent">
                            "Students showed high engagement during the first half of the lecture. Attention dropped after 30 minutes and phone usage increased by 15% towards the end. Specific confusion detected during the 'Quadratic Equations' segment."
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <p className="text-gray-500 text-sm">Most Attentive</p>
                                <p className="font-bold text-white">Sarah Jenkins (Row 2)</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-500 text-sm">Most Distracted</p>
                                <p className="font-bold text-white">Alex Wong (Row 5)</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-500 text-sm">Target Area</p>
                                <p className="font-bold text-accent">Engagement Post-break</p>
                            </div>
                        </div>
                    </GlassCard>

                    <div className="space-y-8">
                        <GlassCard className="bg-primary/5 border-primary/20">
                            <div className="flex items-center gap-4 mb-4">
                                <Clock className="text-primary w-6 h-6" />
                                <h4 className="font-bold text-white">Attention Peak</h4>
                            </div>
                            <p className="text-3xl font-black text-white">10:15 AM</p>
                            <p className="text-sm text-gray-400 mt-2">Maximum focus period detected.</p>
                        </GlassCard>
                        <GlassCard className="bg-red-500/5 border-red-500/20">
                            <div className="flex items-center gap-4 mb-4">
                                <Smartphone className="text-red-500 w-6 h-6" />
                                <h4 className="font-bold text-white">Drop-off Point</h4>
                            </div>
                            <p className="text-3xl font-black text-white">10:45 AM</p>
                            <p className="text-sm text-gray-400 mt-2">Significant decline in attention.</p>
                        </GlassCard>
                    </div>
                </div>

                {/* Reports Table */}
                <h3 className="text-2xl font-bold text-white mb-6">Past Sessions</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-4">
                        <thead>
                            <tr className="text-gray-500 text-sm uppercase tracking-wider">
                                <th className="px-6 py-2">Session ID</th>
                                <th className="px-6 py-2">Class Name</th>
                                <th className="px-6 py-2">Date</th>
                                <th className="px-6 py-2">Engagement</th>
                                <th className="px-6 py-2">Status</th>
                                <th className="px-6 py-2 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report.id} className="group">
                                    <td className="px-6 py-4 glass-card rounded-l-xl border-r-0 font-mono text-xs">{report.id}</td>
                                    <td className="px-6 py-4 glass-card border-x-0 font-bold text-white">{report.session}</td>
                                    <td className="px-6 py-4 glass-card border-x-0 text-gray-400 text-sm">{report.date}</td>
                                    <td className="px-6 py-4 glass-card border-x-0">
                                        <span className={report.color}>{report.engagement}</span>
                                    </td>
                                    <td className="px-6 py-4 glass-card border-x-0">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${report.color.replace('text', 'border').replace('400', '400/30')} ${report.color.replace('text', 'bg').replace('400', '400/10')}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 glass-card rounded-r-xl border-l-0 text-right">
                                        <button className="text-accent underline font-bold text-sm">VIEW</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
