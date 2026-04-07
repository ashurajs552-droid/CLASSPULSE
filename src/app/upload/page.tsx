"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import GlowingButton from "@/components/GlowingButton";
import { Upload, FileVideo, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function UploadPage() {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const simulateUpload = () => {
        setIsUploading(true);
        setIsComplete(false);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    setIsComplete(true);
                    return 100;
                }
                return prev + 5;
            });
        }, 150);
    };

    return (
        <div className="pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-black font-outfit mb-4">Upload Recording</h1>
                    <p className="text-gray-400">
                        Upload classroom sessions for offline AI analysis and report generation.
                    </p>
                </motion.div>

                <GlassCard className="border-dashed border-2 border-white/10 hover:border-accent/40 bg-white/5 py-20 transition-colors">
                    <div className="flex flex-col items-center text-center">
                        <AnimatePresence mode="wait">
                            {!isUploading && !isComplete && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="space-y-6"
                                >
                                    <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                                        <Upload className="w-12 h-12 text-accent" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Drag and drop your video here</h3>
                                    <p className="text-gray-400 max-w-sm mx-auto">
                                        Supported formats: MP4, MOV, AVI. Max file size: 2GB.
                                    </p>
                                    <GlowingButton onClick={simulateUpload} variant="secondary">
                                        Select File From Device
                                    </GlowingButton>
                                </motion.div>
                            )}

                            {isUploading && (
                                <motion.div
                                    key="uploading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full max-w-md space-y-8"
                                >
                                    <div className="relative w-40 h-40 mx-auto">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r="70"
                                                stroke="rgba(255,255,255,0.05)"
                                                strokeWidth="10"
                                                fill="transparent"
                                            />
                                            <motion.circle
                                                cx="80"
                                                cy="80"
                                                r="70"
                                                stroke="var(--accent)"
                                                strokeWidth="10"
                                                fill="transparent"
                                                strokeDasharray={440}
                                                strokeDashoffset={440 - (440 * progress) / 100}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-3xl font-black text-white">{progress}%</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
                                            <Loader2 className="w-6 h-6 animate-spin text-accent" />
                                            Uploading to Supabase...
                                        </h3>
                                        <p className="text-gray-400">Classroom_Session_2024_03_12.mp4</p>
                                    </div>
                                </motion.div>
                            )}

                            {isComplete && (
                                <motion.div
                                    key="complete"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-6 text-center"
                                >
                                    <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white">Upload Successful!</h3>
                                    <p className="text-gray-400 mb-8">
                                        Your video is now being processed by our AI engine. We'll notify you when the report is ready.
                                    </p>
                                    <div className="flex gap-4 justify-center">
                                        <GlowingButton onClick={() => setIsComplete(false)} variant="outline">
                                            Upload Another
                                        </GlowingButton>
                                        <GlowingButton variant="secondary">View Processing Status</GlowingButton>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </GlassCard>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    <GlassCard>
                        <div className="flex items-center gap-4 mb-4">
                            <FileVideo className="text-primary w-6 h-6" />
                            <h4 className="font-bold text-white">GPU Acceleration</h4>
                        </div>
                        <p className="text-gray-400 text-sm">We use dedicated H100 GPU clusters to process your classroom recordings 5x faster than real-time.</p>
                    </GlassCard>
                    <GlassCard>
                        <div className="flex items-center gap-4 mb-4">
                            <AlertCircle className="text-accent w-6 h-6" />
                            <h4 className="font-bold text-white">Privacy First</h4>
                        </div>
                        <p className="text-gray-400 text-sm">All faces are automatically anonymized in processed reports to ensure student privacy compliance.</p>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
