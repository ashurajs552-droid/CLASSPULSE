"use client";

import { motion } from "framer-motion";
import GlowingButton from "@/components/GlowingButton";
import GlassCard from "@/components/GlassCard";
import { Brain, Shield, BarChart3, Users, Zap, ArrowRight, LogIn } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user || null);
            setLoading(false);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async (role: string = 'student') => {
        localStorage.setItem('user_role', role);
        await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } });
    };

  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full border border-primary/30 bg-primary/10 text-primary font-medium text-sm backdrop-blur-md"
          >
            AI-Powered Future of Education
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl font-black mb-6 font-outfit leading-tight"
          >
            ClassPulse <span className="text-accent underline decoration-accent/30">AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Empower educators with real-time AI insights. Monitor student engagement,
            detect distractions, and optimize classroom environments automatically.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {loading ? (
                <div className="w-48 h-14 bg-white/5 rounded-full animate-pulse border border-white/10" />
            ) : user ? (
                <Link href="/dashboard">
                  <GlowingButton variant="primary" className="w-full sm:w-auto text-lg flex items-center gap-2 pt-3 pb-3">
                    Enter Dashboard <ArrowRight className="w-5 h-5" />
                  </GlowingButton>
                </Link>
            ) : (
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <GlowingButton variant="primary" onClick={() => handleLogin('student')} className="w-full sm:w-auto text-lg flex items-center gap-2">
                        <LogIn className="w-5 h-5" /> Student Login
                    </GlowingButton>
                    <GlowingButton variant="outline" onClick={() => handleLogin('teacher')} className="w-full sm:w-auto text-lg flex items-center gap-2 bg-white/5 border-primary/20">
                        <LogIn className="w-5 h-5" /> Teacher Login
                    </GlowingButton>
                    <GlowingButton variant="outline" onClick={() => handleLogin('admin')} className="w-full sm:w-auto text-lg flex items-center gap-2 bg-white/5 border-accent/20">
                        <LogIn className="w-5 h-5" /> Admin Login
                    </GlowingButton>
                </div>
            )}
            {!user && <Link href="/features" className="hidden">
              <GlowingButton variant="outline" className="w-full sm:w-auto text-lg flex items-center gap-2">
                Explore Features <ArrowRight className="w-5 h-5" />
              </GlowingButton>
            </Link>}
          </motion.div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-hero-glow z-0"></div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20 bg-black/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Active Classrooms", value: "500+", icon: Users },
            { label: "AI Insights Generated", value: "1.2M", icon: Brain },
            { label: "Engagement Increase", value: "35%", icon: Zap },
          ].map((stat, i) => (
            <GlassCard key={i} delay={i * 0.1} className="text-center group">
              <stat.icon className="w-10 h-10 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-4xl font-black mb-2 text-white font-outfit">{stat.value}</h3>
              <p className="text-gray-400 font-medium">{stat.label}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Video Preview Section placeholder */}
      <section className="px-6 py-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 font-outfit">Platform Capabilities.</h2>
            <div className="space-y-6">
              {[
                { title: "Automated Attendance", desc: "Save valuable teaching time with intelligent face recognition tracking.", icon: Users },
                { title: "Real-time Telemetry Dashboard", desc: "Visualize engagement and confusion metrics instantly to adjust lecture pacing.", icon: BarChart3 },
                { title: "Distraction Alerts", desc: "Get real-time alerts for unauthorized phone usage and unusual behavior.", icon: Zap },
                { title: "Emotion & State Detection", desc: "Identify when and why students lose focus using private, on-device AI.", icon: Brain },
                { title: "Centralized Admin Control", desc: "Full oversight for administrators to manage student rosters and review logs.", icon: Shield },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1 text-white">{item.title}</h4>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
              )})}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-video glass-nav rounded-3xl border border-white/10 overflow-hidden relative shadow-2xl shadow-primary/20 backdrop-blur-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center shadow-accent/50 shadow-inner"
                >
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                    <Zap className="text-slate-900 fill-slate-900" />
                  </div>
                </motion.div>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-nav p-4 rounded-xl flex items-center justify-between border-white/5 bg-black/40">
                  <span className="text-sm font-bold text-accent">Real-time Analysis: Processing...</span>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 relative overflow-hidden">
        <GlassCard className="max-w-5xl mx-auto text-center py-16 bg-primary/5 border-primary/20 relative z-10" hover={false}>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-outfit">Ready to evolve your classroom?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join 500+ institutions using ClassPulse AI to enhance teaching quality and student focus.
          </p>
          <div className="flex gap-4 justify-center items-center h-[52px]">
            {loading ? <div className="w-32 bg-white/5 rounded-full animate-pulse border border-white/10" /> : user ? (
                <Link href="/dashboard">
                    <GlowingButton variant="secondary">Go to Dashboard</GlowingButton>
                </Link>
            ) : (
                <div className="flex gap-4">
                    <GlowingButton variant="secondary" onClick={() => handleLogin('student')}>Student Login</GlowingButton>
                    <GlowingButton variant="outline" onClick={() => handleLogin('admin')}>Teacher/Admin Login</GlowingButton>
                </div>
            )}
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
