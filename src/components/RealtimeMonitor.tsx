"use client";

import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import { AlertCircle, Camera, Activity, Power } from "lucide-react";

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

interface RealtimeMonitorProps {
    onTelemetryData: (data: TelemetryData) => void;
    sessionId?: string;
}

export default function RealtimeMonitor({ onTelemetryData, sessionId }: RealtimeMonitorProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [status, setStatus] = useState("Loading AI models...");

    useEffect(() => {
        const loadModels = async () => {
            try {
                setStatus("Loading AI models (TinyFaceDetector, Landmarks, Expressions)...");
                const MODEL_URL = "/models";
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
                ]);
                setIsModelsLoaded(true);
                setStatus("Models loaded. Ready to start.");
            } catch (err) {
                console.error("Error loading models:", err);
                setErrorMsg("Failed to load AI models. Check console for details.");
            }
        };

        if (typeof window !== "undefined") {
            loadModels();
        }
    }, []);

    const startVideo = async () => {
        setIsActive(true);
        setStatus("Accessing camera...");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error(err);
            setErrorMsg("Camera access denied or missing.");
            setIsActive(false);
        }
    };

    const stopVideo = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsActive(false);
        setStatus("Camera stopped.");
    };

    const handleVideoPlay = () => {
        setStatus("Processing live feed...");
        let interval: NodeJS.Timeout;
        if (videoRef.current && canvasRef.current && isModelsLoaded) {
            const displaySize = { 
                width: videoRef.current.videoWidth, 
                height: videoRef.current.videoHeight 
            };
            faceapi.matchDimensions(canvasRef.current, displaySize);

            interval = setInterval(async () => {
                if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;

                const detections = await faceapi
                    .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceExpressions();

                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                
                // Clear canvas
                if (canvasRef.current) {
                    const ctx = canvasRef.current.getContext("2d");
                    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    
                    // Draw bounding boxes instead of full meshes to match futuristic UI
                    resizedDetections.forEach((det) => {
                        const box = det.detection.box;
                        if(ctx) {
                            ctx.strokeStyle = "#0ea5e9";
                            ctx.lineWidth = 2;
                            ctx.strokeRect(box.x, box.y, box.width, box.height);
                            // Draw corner brackets for sci-fi look
                            const len = 15;
                            ctx.beginPath();
                            ctx.moveTo(box.x, box.y + len); ctx.lineTo(box.x, box.y); ctx.lineTo(box.x + len, box.y);
                            ctx.moveTo(box.x + box.width - len, box.y); ctx.lineTo(box.x + box.width, box.y); ctx.lineTo(box.x + box.width, box.y + len);
                            ctx.moveTo(box.x, box.y + box.height - len); ctx.lineTo(box.x, box.y + box.height); ctx.lineTo(box.x + len, box.y + box.height);
                            ctx.moveTo(box.x + box.width - len, box.y + box.height); ctx.lineTo(box.x + box.width, box.y + box.height); ctx.lineTo(box.x + box.width, box.y + box.height - len);
                            ctx.stroke();
                        }
                    });
                }

                // Calculate Telemetry logic
                let avgEngagement = 0;
                let avgConfusion = 0;
                let aggregatedEmotions = {
                    attentive: 0,
                    sleepy: 0,
                    confused: 0,
                    distracted: 0,
                };
                let simulatedPhoneUsage = 0; // Randomly simulate phone usage for demo purposes ~5%

                if (detections.length > 0) {
                    let totalNeutral = 0;
                    let totalHappy = 0;
                    let totalSad = 0;
                    let totalAngry = 0; // We map angry/sad to confused/frustrated for class context

                    detections.forEach((d) => {
                        totalNeutral += d.expressions.neutral;
                        totalHappy += d.expressions.happy;
                        totalSad += d.expressions.sad;
                        totalAngry += d.expressions.angry;
                        
                        // Fake head pose rotation based on landmarks width/height ratio (rough estimation)
                        const nose = d.landmarks.getNose();
                        const jaw = d.landmarks.getJawOutline();
                        // If nose is too far to the left or right relative to jaw, likely distracted
                        const noseMid = nose[0].x;
                        const jawMid = (jaw[0].x + jaw[jaw.length - 1].x) / 2;
                        if (Math.abs(noseMid - jawMid) > 20) {
                            aggregatedEmotions.distracted++;
                        } else if (d.expressions.neutral > 0.6) {
                            // If eyes are closed, but we don't have iris detection, we rely on high neutral/sad
                            // For simplicity, map some to attentive
                            aggregatedEmotions.attentive++;
                        }
                    });

                    // Fake phone logic - roughly 5% chance varying gradually
                    simulatedPhoneUsage = Math.floor(Math.random() * 10); 
                    
                    // Simple heuristic mapping
                    avgEngagement = Math.min(100, Math.max(0, (totalNeutral / detections.length) * 100));
                    avgConfusion = Math.min(100, Math.max(0, ((totalSad + totalAngry) / detections.length) * 100));
                    
                    if(avgConfusion > 30) aggregatedEmotions.confused++;
                    if(avgEngagement < 40) aggregatedEmotions.sleepy++;
                } else {
                    avgEngagement = 0; // Nobody engaged if nobody there
                }

                const payload: TelemetryData = {
                    engagement: Math.round(avgEngagement),
                    phoneUsage: simulatedPhoneUsage,
                    confusion: Math.round(avgConfusion),
                    emotions: aggregatedEmotions,
                    facesCount: detections.length
                };

                onTelemetryData(payload);
            }, 1000); // 1-second interval
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    };

    return (
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0f172a] group">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
                    {isActive ? "LIVE INFERENCE" : "CAMERA OFF"}
                </div>
            </div>

            <div className="aspect-video relative bg-slate-900/50 flex flex-col items-center justify-center">
                {!isActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 z-10 p-6 text-center">
                        <Camera className="w-12 h-12 mb-4 opacity-50" />
                        <p className="mb-4">{errorMsg || status}</p>
                        {isModelsLoaded && (
                            <button 
                                onClick={startVideo}
                                className="px-6 py-3 rounded-xl bg-accent text-slate-900 font-bold hover:bg-accent/90 transition-colors flex items-center gap-2"
                            >
                                <Power className="w-4 h-4" /> Start AI Camera
                            </button>
                        )}
                    </div>
                )}
                
                {/* Video element must be block and w-full h-full to fit */}
                <video
                    ref={videoRef}
                    onPlay={handleVideoPlay}
                    muted
                    autoPlay
                    playsInline
                    className={`w-full h-full object-cover transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                />
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />

                {isActive && (
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div className="bg-black/50 backdrop-blur pb-2 pt-2 px-4 rounded-lg text-xs font-medium text-white/80 h-max">
                           <Activity className="w-4 h-4 inline mr-2 text-primary" /> {status}
                        </div>
                        <button 
                            onClick={stopVideo}
                            className="bg-red-500/20 text-red-500 hover:bg-red-500/40 p-2 rounded-lg backdrop-blur transition-colors"
                        >
                            <Power className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
