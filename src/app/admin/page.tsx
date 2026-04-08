"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import GlowingButton from "@/components/GlowingButton";
import {
    Users,
    Video,
    Activity,
    Smartphone,
    Swords, // for fighting
    Moon, // for sleeping
    ShieldAlert,
    Camera,
    Brain,
    Database,
    Zap,
    Crosshair
} from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";

interface TelemetryPoint {
    time: string;
    attentive: number;
    sleeping: number;
    fighting: number;
    phone: number;
}

interface EventLog {
    id: string;
    timestamp: string;
    type: "critical" | "warning" | "info";
    message: string;
}

export default function AdminCommandCenter() {
    // Enrollment state
    const [enrollName, setEnrollName] = useState("");
    const [enrollUsn, setEnrollUsn] = useState("");
    const [enrollDept, setEnrollDept] = useState("CSE");
    const [enrollSem, setEnrollSem] = useState("5");
    const [isEnrolling, setIsEnrolling] = useState(false);

    // AI Telemetry State
    const [cameraActive, setCameraActive] = useState(false);
    const [lowLightMode, setLowLightMode] = useState(true);
    const [telemetry, setTelemetry] = useState<TelemetryPoint[]>([]);
    const [eventLogs, setEventLogs] = useState<EventLog[]>([]);
    const [cameraStatus, setCameraStatus] = useState("STANDBY - ROOT OVERRIDE");
    const videoRef = useRef<HTMLVideoElement>(null);

    // Initial dummy data for the chart to look cool instantly
    useEffect(() => {
        const initialData = Array.from({ length: 15 }).map((_, i) => ({
            time: `-${15 - i}s`,
            attentive: Math.floor(Math.random() * 30) + 70,
            sleeping: Math.floor(Math.random() * 5),
            fighting: 0,
            phone: Math.floor(Math.random() * 10)
        }));
        setTelemetry(initialData);
        
        setEventLogs([
            { id: "1", timestamp: new Date().toLocaleTimeString(), type: "info", message: "System initialized. Max cluster capacity: 150 nodes." },
            { id: "2", timestamp: new Date().toLocaleTimeString(), type: "info", message: "Low-Light Enhancement Modules ready." }
        ]);
    }, []);

    // Telemetry Generator Loop
    useEffect(() => {
        if (!cameraActive) return;

        const interval = setInterval(() => {
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            
            // Advanced Chaos Simulation
            const rand = Math.random();
            const fightingSpike = rand > 0.95 ? Math.floor(Math.random() * 15) + 5 : 0; // Rare fighting
            const phoneSpike = rand > 0.8 ? Math.floor(Math.random() * 20) + 10 : Math.floor(Math.random() * 5);
            const sleepingSpike = rand > 0.85 ? Math.floor(Math.random() * 25) + 5 : Math.floor(Math.random() * 5);
            const attentiveSpike = 100 - (fightingSpike + phoneSpike + sleepingSpike);

            setTelemetry(prev => {
                const newData = [...prev, {
                    time: timeStr,
                    attentive: Math.max(0, attentiveSpike),
                    sleeping: sleepingSpike,
                    fighting: fightingSpike,
                    phone: phoneSpike
                }];
                if (newData.length > 20) newData.shift();
                return newData;
            });

            // Textual Event Logging
            if (fightingSpike > 0) {
                logEvent("critical", `AGGRESSION DETECTED: Physical altercation match probability 87% at Sector B.`);
            }
            if (phoneSpike > 15) {
                logEvent("warning", `DEVICE USAGE DETECTED: Multiple unauthorized localized radio frequencies.`);
            }
            if (sleepingSpike > 15) {
                logEvent("warning", `FATIGUE ALERT: Posture degradation and eye-closure thresholds exceeded.`);
            }
        }, 1500);

        return () => clearInterval(interval);
    }, [cameraActive]);

    const logEvent = (type: "critical" | "warning" | "info", message: string) => {
        setEventLogs(prev => {
            const newLogs = [{ id: Math.random().toString(), timestamp: new Date().toLocaleTimeString(), type, message }, ...prev];
            return newLogs.slice(0, 50); // Keep last 50
        });
    };

    const toggleCamera = async () => {
        if (!cameraActive) {
            setCameraStatus("INITIALIZING AI TENSORS...");
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setCameraActive(true);
                setCameraStatus("LIVE - DEEP INFERENCE ACTIVE");
                logEvent("info", "Biometric camera matrix brought online. Low-Light Neural Enhancers active.");
            } catch (err) {
                console.error(err);
                logEvent("critical", "Root Access Denied: Hardware camera missing or blocked.");
                setCameraStatus("HARDWARE FAILURE");
            }
        } else {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
            setCameraActive(false);
            setCameraStatus("STANDBY - ROOT OVERRIDE");
            logEvent("info", "Camera feed terminated by Admin.");
        }
    };

    const handleEnroll = (e: React.FormEvent) => {
        e.preventDefault();
        setIsEnrolling(true);
        setTimeout(() => {
            logEvent("info", `NEW BIOMETRIC VECTOR SAVED: ${enrollName} (${enrollUsn}) secured in Dept ${enrollDept} Sem ${enrollSem}.`);
            setIsEnrolling(false);
            setEnrollName("");
            setEnrollUsn("");
        }, 1500);
    };

    return (
        <div className="pt-24 pb-20 px-4 md:px-6 min-h-screen bg-black/50">
            <div className="max-w-[1600px] mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-end mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black font-outfit text-white tracking-widest uppercase flex items-center gap-3">
                            <Crosshair className="w-8 h-8 text-red-500 animate-pulse" /> 
                            Admin Command Center <span className="text-red-500 text-sm ml-2 px-2 py-1 bg-red-500/20 rounded border border-red-500/50">ROOT</span>
                        </h1>
                        <p className="text-gray-400 font-mono text-sm mt-2">
                            Advanced Multi-Node Attendance & Behavioral Telemetry Tracker v3.0 // Low-Light Ready
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 font-mono text-sm">
                            Students Onboarded: 4,092
                        </div>
                        <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 font-mono text-sm">
                            System Load: 12%
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* LEFT COLUMN: ENROLLMENT & ACTIONS */}
                    <div className="xl:col-span-1 space-y-6">
                        <GlassCard className="p-6 border-white/10 bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/80 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-primary"></div>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Database className="w-5 h-5 text-accent" /> Live Enrollment Node
                            </h3>
                            <form onSubmit={handleEnroll} className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-wider">Full Name</label>
                                    <input required value={enrollName} onChange={e=>setEnrollName(e.target.value)} type="text" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm mt-1 focus:border-accent outline-none" placeholder="Target Name" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-wider">USN / ID</label>
                                    <input required value={enrollUsn} onChange={e=>setEnrollUsn(e.target.value)} type="text" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm mt-1 focus:border-accent outline-none" placeholder="1BM20CS..." />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase tracking-wider">Dept</label>
                                        <select value={enrollDept} onChange={e=>setEnrollDept(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm mt-1 focus:border-accent outline-none">
                                            <option>CSE</option><option>ECE</option><option>AIML</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase tracking-wider">Sem</label>
                                        <select value={enrollSem} onChange={e=>setEnrollSem(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm mt-1 focus:border-accent outline-none">
                                            <option>1</option><option>3</option><option>5</option><option>7</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <GlowingButton variant="outline" className="w-full justify-center flex items-center gap-2 text-sm border-dashed" disabled={isEnrolling}>
                                        <Camera className="w-4 h-4" /> {isEnrolling ? "Saving Matrix..." : "Capture Face & Enroll"}
                                    </GlowingButton>
                                </div>
                            </form>
                        </GlassCard>

                        <GlassCard className="p-6 h-[400px] flex flex-col border-white/10 relative overflow-hidden bg-black/40">
                            <h3 className="text-md font-bold text-gray-300 mb-4 flex items-center gap-2 uppercase tracking-wide text-xs">
                                <Activity className="w-4 h-4 text-primary" /> Advanced Real-Time Logs
                            </h3>
                            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                <AnimatePresence>
                                    {eventLogs.map(log => (
                                        <motion.div 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            key={log.id} 
                                            className={`p-3 rounded border text-xs font-mono 
                                                ${log.type === 'critical' ? 'bg-red-500/10 border-red-500/30 text-red-300' : 
                                                log.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 
                                                'bg-white/5 border-white/10 text-gray-400'}`}
                                        >
                                            <span className="opacity-50 mr-2">[{log.timestamp}]</span>
                                            {log.message}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </GlassCard>
                    </div>

                    {/* MIDDLE COLUMN: CAMERA FEED AND RADAR */}
                    <div className="xl:col-span-2 space-y-6">
                        <GlassCard className="flex flex-col relative overflow-hidden border-white/10 p-1">
                            {/* HUD Overlays */}
                            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
                                <div className={`px-3 py-1.5 rounded bg-black/60 border backdrop-blur-md text-xs font-mono font-bold flex items-center gap-2 
                                    ${cameraActive ? 'border-red-500/50 text-red-500' : 'border-gray-500/50 text-gray-500'}`}>
                                    <div className={`w-2 h-2 rounded-full ${cameraActive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
                                    {cameraStatus}
                                </div>
                                {lowLightMode && cameraActive && (
                                    <div className="px-3 py-1.5 rounded bg-black/60 border border-emerald-500/50 text-emerald-400 backdrop-blur-md text-xs font-mono flex items-center gap-2">
                                        <Zap className="w-3 h-3" /> LOW-LIGHT ISO ENHANCED
                                    </div>
                                )}
                            </div>
                            
                            <div className="absolute top-4 right-4 z-20 pointer-events-none">
                                 <div className="px-3 py-1.5 rounded bg-black/60 border border-accent/50 text-accent backdrop-blur-md text-xs font-mono">
                                    CAPACITY: 100+ NODES DETECTED
                                </div>
                            </div>

                            <div className="aspect-[16/9] w-full bg-slate-900 rounded-xl overflow-hidden relative border border-white/5 group">
                                {!cameraActive && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <Camera className="w-16 h-16 text-white/10 mb-4" />
                                        <button onClick={toggleCamera} className="px-6 py-3 bg-red-500/20 border border-red-500/50 text-red-500 hover:bg-red-500/30 rounded font-mono font-bold transition-all">
                                            INITIALIZE OVERRIDE FEED
                                        </button>
                                    </div>
                                )}
                                <video ref={videoRef} autoPlay muted playsInline className={`w-full h-full object-cover transition-opacity duration-1000 ${cameraActive ? 'opacity-100' : 'opacity-0'} ${lowLightMode ? 'contrast-125 brightness-110 saturate-50' : ''}`} />
                                
                                {/* Sci-fi crosshair overlay */}
                                {cameraActive && (
                                    <div className="absolute inset-0 pointer-events-none opacity-30">
                                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-red-500/50"></div>
                                        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-red-500/50"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-red-500/50 rounded-full border-dashed animate-[spin_10s_linear_infinite]"></div>
                                    </div>
                                )}
                            </div>

                            {cameraActive && (
                                <div className="p-4 grid grid-cols-4 gap-4 bg-black/40 border-t border-white/5">
                                    <div className="text-center">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Target</p>
                                        <button onClick={toggleCamera} className="w-full py-1.5 bg-red-500/20 text-red-500 rounded text-xs font-mono hover:bg-red-500/40 border border-red-500/20">KILL FEED</button>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Vision Mode</p>
                                        <button onClick={() => setLowLightMode(!lowLightMode)} className={`w-full py-1.5 rounded text-xs font-mono border ${lowLightMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-white/10 text-gray-400 border-white/10 hover:bg-white/20'}`}>
                                            NIGHT SIGHT
                                        </button>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Auto-Attendance</p>
                                        <button className="w-full py-1.5 bg-accent/20 text-accent rounded text-xs font-mono hover:bg-accent/40 border border-accent/20">SYNC NOW</button>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Alerts</p>
                                        <button className="w-full py-1.5 bg-blue-500/20 text-blue-400 rounded text-xs font-mono hover:bg-blue-500/40 border border-blue-500/20">BROADCAST</button>
                                    </div>
                                </div>
                            )}
                        </GlassCard>
                    </div>

                    {/* RIGHT COLUMN: GRAPHICS AND METRICS */}
                    <div className="xl:col-span-1 space-y-6">
                        <GlassCard className="p-5 border-white/10">
                            <h3 className="text-xs font-bold text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
                                <Brain className="w-4 h-4 text-purple-400" /> Behavioral Vectors
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-300 font-mono">Aggression / Fighting</span>
                                        <span className="text-red-400 font-mono font-bold animate-pulse">{telemetry[telemetry.length - 1]?.fighting || 0}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div className="h-full bg-red-500" animate={{ width: `${telemetry[telemetry.length - 1]?.fighting || 0}%` }} transition={{ duration: 0.5 }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-300 font-mono">Device Usage</span>
                                        <span className="text-amber-400 font-mono font-bold">{telemetry[telemetry.length - 1]?.phone || 0}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div className="h-full bg-amber-500" animate={{ width: `${telemetry[telemetry.length - 1]?.phone || 0}%` }} transition={{ duration: 0.5 }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-300 font-mono">Fatigue / Sleeping</span>
                                        <span className="text-blue-400 font-mono font-bold">{telemetry[telemetry.length - 1]?.sleeping || 0}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div className="h-full bg-blue-500" animate={{ width: `${telemetry[telemetry.length - 1]?.sleeping || 0}%` }} transition={{ duration: 0.5 }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-300 font-mono">Total Attendance Sync</span>
                                        <span className="text-emerald-400 font-mono font-bold">100 / 100</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div className="h-full bg-emerald-500" animate={{ width: "100%" }} transition={{ duration: 0.5 }} />
                                    </div>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard className="p-4 border-white/10 h-[280px] flex flex-col">
                            <h3 className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-2 uppercase tracking-widest">
                                <Activity className="w-4 h-4 text-accent" /> Telemetry Trajectory
                            </h3>
                            <div className="flex-1 w-full -ml-3">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={telemetry} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorAttentive" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorFight" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                        <XAxis dataKey="time" stroke="#ffffff50" fontSize={9} tickMargin={5} />
                                        <YAxis stroke="#ffffff50" fontSize={9} width={30} />
                                        <Tooltip contentStyle={{ backgroundColor: "#000000dd", border: "1px solid #333", fontSize: "12px", fontFamily: "monospace" }} />
                                        <Area type="monotone" dataKey="attentive" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAttentive)" isAnimationActive={false} />
                                        <Area type="stepAfter" dataKey="fighting" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorFight)" isAnimationActive={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
