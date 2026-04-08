"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/GlassCard";
import { useRouter } from "next/navigation";
import { AlertCircle, LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Ensure session cache is cleared on mount so the user starts fresh
    useEffect(() => {
        const clearSession = async () => {
            await supabase.auth.signOut();
            localStorage.removeItem('user_role');
        };
        clearSession();
    }, []);
    
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            setError("Please enter both email and password.");
            return;
        }
        
        setLoading(true);
        setError(null);

        // Special Admin Bypass Check
        if (formData.email === 'ashurajs558@gmail.com' && formData.password === '123456789') {
            if (typeof window !== 'undefined') {
                localStorage.setItem('admin_bypass', 'true');
                localStorage.setItem('user_role', 'admin');
            }
            router.push('/admin');
            setLoading(false);
            return;
        }

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (signInError) throw signInError;

            // Successfully logged in
            // Make sure role is set from user metadata if possible
            if (data.user?.user_metadata?.role) {
                localStorage.setItem('user_role', data.user.user_metadata.role);
            }
            
            router.push('/dashboard');
            
        } catch (err: any) {
             setError(err.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-hero-glow z-0 pointer-events-none opacity-50"></div>
            
            <GlassCard className="w-full max-w-md relative z-10 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-outfit mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Log in to your ClassPulse AI account</p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-200">{error}</p>
                    </motion.div>
                )}

                <motion.form 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div className="space-y-1">
                        <label className="text-sm text-gray-400 ml-1">Email ID</label>
                        <input
                            type="email" name="email" value={formData.email} onChange={handleInputChange} required
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-gray-400 ml-1">Password</label>
                        <input
                            type="password" name="password" value={formData.password} onChange={handleInputChange} required
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="pt-4 space-y-4">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 ${loading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" /> Log In
                                </>
                            )}
                        </button>

                        <div className="flex items-center gap-4 my-4">
                            <div className="h-px bg-white/10 flex-1"></div>
                            <span className="text-sm text-gray-500">OR</span>
                            <div className="h-px bg-white/10 flex-1"></div>
                        </div>

                        <button 
                            type="button"
                            onClick={async () => {
                                // determine absolute url for Vercel friendliness
                                const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : process.env.NEXT_PUBLIC_SITE_URL + '/dashboard';
                                await supabase.auth.signInWithOAuth({ 
                                    provider: 'google', 
                                    options: { 
                                        redirectTo: redirectUrl,
                                        queryParams: {
                                            prompt: 'select_account' // Forces the account selection screen
                                        }
                                    } 
                                });
                            }}
                            className="w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                <path fill="none" d="M1 1h22v22H1z" />
                            </svg>
                            Continue with Google
                        </button>
                    </div>
                    
                    <p className="text-center text-sm text-gray-400 mt-6">
                        Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
                    </p>
                </motion.form>
            </GlassCard>
        </div>
    );
}
