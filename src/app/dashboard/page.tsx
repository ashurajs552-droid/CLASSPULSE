"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import GlassCard from "@/components/GlassCard";

const RealtimeMonitor = dynamic(() => import("@/components/RealtimeMonitor"), {
    ssr: false,
});
import {
    Users,
    Smartphone,
    AlertCircle,
    Activity,
    TrendingUp
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";

interface TelemetryData {
    engagement: number;
    phoneUsage: number;
    confusion: number;
    emotions: {
        attentive: number;
        sleepy: number;
        confused: number;
        distracted: number;
    };
    facesCount: number;
}

interface ChartDataPoint {
    time: string;
    engagement: number;
    phone: number;
    confusion: number;
}

export default function DashboardPage() {
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [currentStats, setCurrentStats] = useState({
        engagement: 0,
        phoneUsage: 0,
        confusion: 0,
        facesCount: 0
    });
    const [alert, setAlert] = useState<string | null>(null);

    const [studentId, setStudentId] = useState<string | null>(null);

    import("@/lib/supabase").then(({ supabase }) => {
        // Just setting up simple tracking interval outside of react cycle to prevent massive re-renders
        // A robust app would use an API route to abstract this
    });

    useEffect(() => {
        const init = async () => {
            const { supabase } = await import('@/lib/supabase');
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const { data } = await supabase.from('students').select('id').eq('auth_id', session.user.id).single();
                if (data) setStudentId(data.id);
            }
        };
        init();
    }, []);

    const handleTelemetryData = useCallback((data: TelemetryData) => {
        // Update current numbers
        setCurrentStats({
            engagement: data.engagement,
            phoneUsage: data.phoneUsage,
            confusion: data.confusion,
            facesCount: data.facesCount
        });

        // Generate alert if needed
        if (data.phoneUsage > 5) {
            setAlert("Live Alert: Possible phone usage detected in the classroom.");
        } else if (data.confusion > 40) {
            setAlert("Live Alert: High confusion detected among students.");
        } else {
            setAlert(null);
        }

        // Update chart over time (keep last 20 points)
        setChartData((prev) => {
            const now = new Date();
            const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            const newPoint = {
                time: timeString,
                engagement: data.engagement,
                phone: data.phoneUsage,
                confusion: data.confusion
            };
            const newData = [...prev, newPoint];
            if (newData.length > 20) newData.shift();
            return newData;
        });

        if (studentId) {
            import("@/lib/supabase").then(({ supabase }) => {
                supabase.from('engagement_data').insert({
                    student_id: studentId,
                    attention_score: data.engagement / 100.0,
                }).then();

                if (data.phoneUsage > 0) {
                    supabase.from('phone_detection').insert({
                        student_id: studentId,
                        detected: true
                    }).then();
                }
            });
        }
    }, [studentId]);

    const stats = [
        { label: "Class Engagement", value: `${currentStats.engagement}%`, icon: Activity, color: "text-emerald-400" },
        { label: "Faces Detected", value: `${currentStats.facesCount}`, icon: Users, color: "text-blue-400" },
        { label: "Phone Probablity", value: `${currentStats.phoneUsage}%`, icon: Smartphone, color: "text-red-400" },
        { label: "Confusion Level", value: `${currentStats.confusion}%`, icon: AlertCircle, color: "text-amber-400" },
    ];

    return (
        <div className="pt-32 pb-20 px-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black font-outfit mb-4">Real-time Analytics</h1>
                        <p className="text-gray-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            Live Active Session
                        </p>
                    </div>
                </div>

                {/* Top Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, i) => (
                        <GlassCard key={i} delay={i * 0.1}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1 font-medium">{stat.label}</p>
                                    <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Realtime Camera Column */}
                    <div className="lg:col-span-1 flex flex-col">
                        <GlassCard className="flex-1 flex flex-col p-4 w-full">
                            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                                <Activity className="text-primary w-5 h-5" /> Video Feed Setup
                            </h3>
                            <RealtimeMonitor onTelemetryData={handleTelemetryData} />
                            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                                Client-side inference powered by Face-API.js. All biometric data is analyzed locally and destroyed immediately. Only aggregated statistics are pushed to the server.
                            </p>
                        </GlassCard>
                    </div>

                    {/* Main Charts Column */}
                    <div className="lg:col-span-2 grid grid-rows-2 gap-8">
                        {/* Engagement Timeline */}
                        <GlassCard className="h-[300px] flex flex-col">
                            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                                <TrendingUp className="text-emerald-400 w-5 h-5" /> Live Engagement Pulse
                            </h3>
                            <div className="flex-1 w-full relative">
                                {chartData.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                                        Start camera to see live telemetry
                                    </div>
                                )}
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                        <XAxis dataKey="time" stroke="#475569" fontSize={10} />
                                        <YAxis stroke="#475569" fontSize={10} domain={[0, 100]} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#fff" }}
                                            itemStyle={{ color: "#fff" }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="engagement"
                                            stroke="#10b981"
                                            fillOpacity={1}
                                            fill="url(#colorEngage)"
                                            strokeWidth={3}
                                            isAnimationActive={false}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </GlassCard>

                        {/* Distraction & Confusion */}
                        <GlassCard className="h-[300px] flex flex-col">
                            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                                <AlertCircle className="text-red-400 w-5 h-5" /> Distractions & Confusion Signals
                            </h3>
                            <div className="flex-1 w-full relative">
                                {chartData.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                                        Start camera to see live telemetry
                                    </div>
                                )}
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                        <XAxis dataKey="time" stroke="#475569" fontSize={10} />
                                        <YAxis stroke="#475569" fontSize={10} domain={[0, 100]} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#fff" }}
                                        />
                                        <Line type="stepAfter" dataKey="phone" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
                                        <Line type="monotone" dataKey="confusion" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </GlassCard>
                    </div>
                </div>

                {/* Bottom Alert Section */}
                {alert && (
                    <GlassCard className="bg-red-500/10 border-red-500/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                                <AlertCircle className="w-8 h-8 text-red-500 animate-pulse" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white mb-1">Attention Required</h4>
                                <p className="text-gray-300">{alert}</p>
                            </div>
                            <button 
                                onClick={() => setAlert(null)}
                                className="ml-auto px-6 py-3 rounded-xl bg-red-500/20 text-red-400 font-bold hover:bg-red-500 hover:text-white transition-colors"
                            >
                                Acknowledge
                            </button>
                        </div>
                    </GlassCard>
                )}
            </div>
        </div>
    );
}
