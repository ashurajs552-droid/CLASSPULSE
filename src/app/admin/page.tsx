"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import {
    Users,
    UserPlus,
    Settings,
    Shield,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Edit2,
    Trash2,
    Video,
    FileText,
    Clock,
    Database
} from "lucide-react";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("students");
    const [students, setStudents] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);

    useEffect(() => {
        const fetchStudents = async () => {
            const { supabase } = await import('@/lib/supabase');
            const { data } = await supabase.from('students').select('*');
            if (data) {
                const formatted = data.map(s => ({
                    name: s.name,
                    roll: s.usn || s.roll_number,
                    attendance: "Onboarded", 
                    status: "Active"
                }));
                setStudents(formatted);
            }
        };
        fetchStudents();
    }, []);

    return (
        <div className="pt-32 pb-20 px-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6"
                >
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black font-outfit mb-4 text-center md:text-left">Control Panel</h1>
                        <p className="text-gray-400">Manage students, verify sessions, and export global reports.</p>
                    </div>
                </motion.div>

                {/* Global Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: "Total Students", value: "248", icon: Users, color: "text-blue-400" },
                        { label: "AI Sessions", value: "1,402", icon: Video, color: "text-accent" },
                        { label: "Reports Auto-Generated", value: "1,390", icon: FileText, color: "text-emerald-400" },
                        { label: "System Health", value: "100%", icon: Shield, color: "text-purple-400" },
                    ].map((stat, i) => (
                        <GlassCard key={i} delay={i * 0.1} className="flex items-center gap-4 p-4">
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white leading-tight">{stat.value}</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.label}</p>
                            </div>
                        </GlassCard>
                    ))}
                </div>

                <div className="flex space-x-1 border-b border-white/10 mb-8 overflow-x-auto">
                    {[
                        { id: "students", label: "Student Roster", icon: Users },
                        { id: "sessions", label: "Live & Past Sessions", icon: Clock },
                        { id: "reports", label: "System Reports", icon: Database }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative ${
                                activeTab === tab.id ? "text-accent" : "text-gray-500 hover:text-white"
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="admin-tab-underline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                                />
                            )}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === "students" && (
                        <motion.div
                            key="students"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <GlassCard>
                                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                                    <h3 className="text-2xl font-bold text-white">Student Directory</h3>
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="relative flex-1 md:w-64">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input type="text" placeholder="Search students..." className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/20 border border-white/5 text-white focus:border-accent/50 outline-none transition-all" />
                                        </div>
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/20 text-accent font-bold hover:bg-accent/20 transition-all">
                                            <UserPlus className="w-4 h-4" /> Add
                                        </button>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-gray-500 text-sm border-b border-white/5">
                                                <th className="px-6 py-4">Student Name</th>
                                                <th className="px-6 py-4">Roll Number</th>
                                                <th className="px-6 py-4">Avg Attendance</th>
                                                <th className="px-6 py-4">Primary Status</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-6 text-white font-bold">{student.name}</td>
                                                    <td className="px-6 py-6 font-mono text-sm text-gray-400">{student.roll}</td>
                                                    <td className="px-6 py-6 text-emerald-400">{student.attendance}</td>
                                                    <td className="px-6 py-6">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${student.status === 'Attentive' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                                student.status === 'Distracted' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                                    'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                            }`}>
                                                            {student.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <div className="flex items-center justify-end gap-3 text-gray-500">
                                                            <button className="hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                            <button className="hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === "sessions" && (
                        <motion.div
                            key="sessions"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <GlassCard>
                                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                                    <h3 className="text-2xl font-bold text-white">Monitoring Sessions</h3>
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold hover:bg-emerald-500/30 transition-all">
                                        <Video className="w-4 h-4" /> Start New Session
                                    </button>
                                </div>
                                <div className="grid gap-4">
                                    {sessions.map((session, i) => (
                                        <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/5 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-white/10 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${session.status === 'Live' ? 'bg-red-500/20 text-red-500' : 'bg-gray-500/20 text-gray-500'}`}>
                                                    <Video className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold">{session.class}</h4>
                                                    <p className="text-sm text-gray-400">{session.id} • {session.instructor}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-white">{session.date}</p>
                                                    <p className="text-xs text-gray-500">{session.duration}</p>
                                                </div>
                                                {session.status === 'Live' ? (
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-red-500/20 text-red-500 border border-red-500/30 animate-pulse">Live Now</span>
                                                ) : (
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-gray-500/20 text-gray-400 border border-gray-500/30">Ended</span>
                                                )}
                                                <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === "reports" && (
                        <motion.div
                            key="reports"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <GlassCard className="flex flex-col items-center justify-center py-20 text-center">
                                <Database className="w-16 h-16 text-primary/50 mb-6" />
                                <h3 className="text-2xl font-bold text-white mb-2">Centralized Reports Hub</h3>
                                <p className="text-gray-400 max-w-md mb-8">All session reports and database backups are synced to the cloud. You can export total aggregations here.</p>
                                <button className="px-6 py-3 rounded-xl bg-accent text-slate-900 font-bold hover:bg-accent/90 transition-all flex items-center gap-2">
                                    <FileText className="w-5 h-5" /> Export All Data CSV
                                </button>
                            </GlassCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
