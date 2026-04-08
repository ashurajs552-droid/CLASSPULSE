"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import GlowingButton from "@/components/GlowingButton";
import GlassCard from "@/components/GlassCard";
import { useRouter } from "next/navigation";
import { User as UserIcon, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<"student" | "teacher" | null>(null);
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
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        usn: "",
        mobile: ""
    });

    const handleRoleSelect = (selectedRole: "student" | "teacher") => {
        setRole(selectedRole);
        setError(null);
    };

    const nextStep = () => {
        if (!role) {
            setError("Please select a role to continue.");
            return;
        }
        setError(null);
        setStep(2);
    };

    const validateForm = () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
            return "Please fill in all required fields.";
        }
        
        if (role === 'student' && (!formData.usn || !formData.mobile)) {
            return "Please fill in all student details.";
        }
        
        if (formData.password !== formData.confirmPassword) {
            return "Passwords do not match.";
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            return "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
        }

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }
        
        setLoading(true);
        setError(null);

        try {
            // Register user with Supabase
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: `${formData.firstName} ${formData.lastName}`,
                        role: role
                    }
                }
            });

            if (signUpError) throw signUpError;

            // If user is student, we can insert into our custom students table
            if (role === 'student' && data.user) {
                const { error: insertError } = await supabase.from('students').insert({
                    auth_id: data.user.id,
                    name: `${formData.firstName} ${formData.lastName}`,
                    usn: formData.usn,
                    mobile: formData.mobile
                });
                
                if (insertError) {
                    console.error("Error inserting student record:", insertError);
                    // It might fail if USN is duplicate, we should display the error
                    throw insertError;
                }
            }

            // Successfully registered
            localStorage.setItem('user_role', role!);
            router.push('/dashboard');
            
        } catch (err: any) {
             setError(err.message || "An error occurred during sign up.");
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
                    <h1 className="text-3xl font-bold font-outfit mb-2">Create an Account</h1>
                    <p className="text-gray-400">Join the AI-powered future of education</p>
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

                {step === 1 && (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-lg font-medium text-center mb-4">I am a...</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleRoleSelect("student")}
                                className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all ${
                                    role === "student" 
                                    ? "bg-primary/20 border-primary" 
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                }`}
                            >
                                <UserIcon className={`w-8 h-8 mb-3 ${role === 'student' ? 'text-primary' : 'text-gray-400'}`} />
                                <span className={`font-medium ${role === 'student' ? 'text-white' : 'text-gray-400'}`}>Student</span>
                            </button>
                            <button
                                onClick={() => handleRoleSelect("teacher")}
                                className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all ${
                                    role === "teacher" 
                                    ? "bg-accent/20 border-accent" 
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                }`}
                            >
                                <BookOpen className={`w-8 h-8 mb-3 ${role === 'teacher' ? 'text-accent' : 'text-gray-400'}`} />
                                <span className={`font-medium ${role === 'teacher' ? 'text-white' : 'text-gray-400'}`}>Teacher</span>
                            </button>
                        </div>
                        <div className="pt-4 space-y-4">
                            <GlowingButton 
                                variant={role === 'student' ? 'primary' : 'outline'} 
                                onClick={nextStep} 
                                className={`w-full ${role === 'teacher' && 'border-accent/50 text-accent'} ${!role && 'opacity-50 cursor-not-allowed'}`}
                            >
                                Continue with Email
                            </GlowingButton>

                            <div className="flex items-center gap-4 my-4">
                                <div className="h-px bg-white/10 flex-1"></div>
                                <span className="text-sm text-gray-500">OR</span>
                                <div className="h-px bg-white/10 flex-1"></div>
                            </div>

                            <button 
                                type="button"
                                onClick={async () => {
                                    if (!role) {
                                        setError("Please select a role first.");
                                        return;
                                    }
                                    localStorage.setItem('user_role', role);
                                    const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/onboarding` : process.env.NEXT_PUBLIC_SITE_URL + '/onboarding';
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
                            Already have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link>
                        </p>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.form 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-medium">
                                {role === 'student' ? 'Student Details' : 'Teacher Details'}
                            </h2>
                            <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-white transition-colors">
                                Change Role
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm text-gray-400 ml-1">First Name</label>
                                <input
                                    type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="John"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm text-gray-400 ml-1">Last Name</label>
                                <input
                                    type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        {role === 'student' && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400 ml-1">USN</label>
                                    <input
                                        type="text" name="usn" value={formData.usn} onChange={handleInputChange} required
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                                        placeholder="1BM20CS000"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400 ml-1">Mobile Number</label>
                                    <input
                                        type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} required
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                            </>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm text-gray-400 ml-1">Email ID</label>
                            <input
                                type="email" name="email" value={formData.email} onChange={handleInputChange} required
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-gray-400 ml-1">Password</label>
                            <input
                                type="password" name="password" value={formData.password} onChange={handleInputChange} required
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="••••••••"
                            />
                            <p className="text-xs text-gray-500 mt-1 ml-1 leading-snug">
                                Min 8 chars, 1 uppercase, 1 lowercase, 1 number, & 1 special char.
                            </p>
                        </div>
                        
                        <div className="space-y-1">
                            <label className="text-sm text-gray-400 ml-1">Confirm Password</label>
                            <input
                                type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                                    role === 'student' 
                                        ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25" 
                                        : "bg-transparent border border-accent text-accent hover:bg-accent hover:text-slate-900 shadow-lg shadow-accent/25"
                                } ${loading ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </div>
                    </motion.form>
                )}
            </GlassCard>
        </div>
    );
}
