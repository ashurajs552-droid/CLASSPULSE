"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/GlassCard";
import { motion } from "framer-motion";
import { Activity, User as UserIcon, BookOpen, Layers, Phone, PhoneCall } from "lucide-react";

export default function OnboardingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        usn: "",
        sem: "",
        dept: "",
        mobile: "+91 ",
        parents_no: "+91 "
    });

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/");
                return;
            }
            setUserId(session.user.id);
            setFormData(prev => ({ ...prev, name: session.user.user_metadata?.full_name || "" }));

            // Check if already onboarded
            const { data, error } = await supabase
                .from("students")
                .select("*")
                .eq("auth_id", session.user.id)
                .single();

            if (data) {
                // User already exists in students table
                router.push("/dashboard");
            }
        };
        checkUser();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Note: Since RLS might block this if not properly configured,
            // we'll attempt a direct insert. If it fails due to RLS,
            // you'll need to set up RLS policies in Supabase to allow
            // INSERT for authenticated users using their auth.uid()
            const { error } = await supabase
                .from("students")
                .insert([
                    {
                        auth_id: userId,
                        name: formData.name,
                        roll_number: formData.usn, // Reusing roll_number for USN to match existing schema
                        usn: formData.usn,
                        sem: formData.sem,
                        dept: formData.dept,
                        mobile: formData.mobile,
                        parents_no: formData.parents_no
                    }
                ]);

            if (error) {
                console.error("Error saving profile:", error);
                alert("Error saving profile. Check console.");
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!userId) return null; // loading auth

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
            <GlassCard className="max-w-2xl w-full p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-3xl rounded-full" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full" />
                
                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-accent/20 mx-auto flex items-center justify-center mb-4">
                            <Activity className="text-accent w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-black font-outfit text-white mb-2">Complete Your Profile</h1>
                        <p className="text-gray-400">ClassPulse AI needs a few more details to set up your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                    <UserIcon className="w-4 h-4" /> Full Name
                                </label>
                                <input 
                                    required
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" /> USN (University Registration Details)
                                </label>
                                <input 
                                    required
                                    type="text" 
                                    value={formData.usn}
                                    onChange={(e) => setFormData({...formData, usn: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent uppercase transition-colors"
                                    placeholder="1RV21CS001"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                    <Layers className="w-4 h-4" /> Department
                                </label>
                                <select 
                                    required
                                    value={formData.dept}
                                    onChange={(e) => setFormData({...formData, dept: e.target.value})}
                                    className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors appearance-none"
                                >
                                    <option value="" disabled>Select Department</option>
                                    <option value="CSE">Computer Science</option>
                                    <option value="ISE">Information Science</option>
                                    <option value="ECE">Electronics & Communication</option>
                                    <option value="ME">Mechanical</option>
                                    <option value="CE">Civil</option>
                                    <option value="AIML">AIML</option>
                                    <option value="DS">DS</option>
                                    <option value="Cyber security">Cyber security</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                    <Layers className="w-4 h-4" /> Semester
                                </label>
                                <select 
                                    required
                                    value={formData.sem}
                                    onChange={(e) => setFormData({...formData, sem: e.target.value})}
                                    className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors appearance-none"
                                >
                                    <option value="" disabled>Select Semester</option>
                                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                    <Phone className="w-4 h-4" /> Student Mobile
                                </label>
                                <input 
                                    required
                                    type="tel" 
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                    <PhoneCall className="w-4 h-4" /> Parent&apos;s Mobile
                                </label>
                                <input 
                                    required
                                    type="tel" 
                                    value={formData.parents_no}
                                    onChange={(e) => setFormData({...formData, parents_no: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-accent text-slate-900 font-bold py-4 rounded-xl mt-8 hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? "Saving Profile..." : "Complete Setup"} 
                            {!loading && <Activity className="w-5 h-5" />}
                        </button>
                    </form>
                </div>
            </GlassCard>
        </div>
    );
}
