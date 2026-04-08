"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, Cpu, Video, FileText, Settings, LogOut, User as UserIcon, Sun, Moon, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const publicNavItems: { name: string; path: string; icon: any }[] = [];

const protectedNavItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Reports", path: "/reports", icon: FileText },
];

const adminNavItems = [
    { name: "Admin", path: "/admin", icon: Settings },
];

const teacherNavItems = [
    { name: "Teacher Portal", path: "/teacher/dashboard", icon: LayoutDashboard },
];

export default function Navbar() {
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState("dark");
    const [role, setRole] = useState<string>("student");

    useEffect(() => {
        // Check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (typeof window !== "undefined" && localStorage.getItem('admin_bypass') === 'true') {
                 setUser({ email: 'ashurajs558@gmail.com', user_metadata: { full_name: 'Admin ROOT', role: 'admin' } } as any);
                 setRole('admin');
                 setLoading(false);
                 return;
            }

            setUser(session?.user || null);
            setLoading(false);
            if (typeof window !== "undefined") {
                setRole(localStorage.getItem('user_role') || "student");
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const toggleTheme = () => {
        if (theme === "dark") {
            document.documentElement.classList.add("light");
            setTheme("light");
        } else {
            document.documentElement.classList.remove("light");
            setTheme("dark");
        }
    };

    const clearCache = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
    };

    const handleLogin = async () => {
        // Fallback if accessed via Navbar
        localStorage.setItem('user_role', 'student');
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}`,
            },
        });
    };

    const handleLogout = async () => {
        if (typeof window !== 'undefined' && localStorage.getItem('admin_bypass') === 'true') {
             localStorage.removeItem('admin_bypass');
             localStorage.removeItem('user_role');
             setUser(null);
             window.location.href = '/';
             return;
        }
        await supabase.auth.signOut();
    };

    const role_navs = role === "admin" 
        ? [...protectedNavItems, ...adminNavItems] 
        : role === "teacher" 
            ? teacherNavItems 
            : protectedNavItems;
    const displayedNavItems = user ? [...publicNavItems, ...role_navs] : publicNavItems;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-nav px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                        <Activity className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 font-outfit">
                        ClassPulse AI
                    </span>
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    {displayedNavItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`relative px-3 py-2 transition-colors duration-300 font-medium ${isActive ? "text-white" : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <Icon className={`w-4 h-4 ${isActive ? "text-accent" : ""}`} />
                                    <span>{item.name}</span>
                                </div>
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-underline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                                        initial={false}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {!loading && (
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={clearCache}
                            className="p-2 glass-card rounded-full text-gray-400 hover:text-white transition-colors"
                            title="Clear Cache"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={toggleTheme} 
                            className="p-2 glass-card rounded-full text-gray-400 hover:text-white transition-colors"
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="hidden md:flex flex-col items-end">
                                    <span className="text-sm font-bold text-white leading-none">{user.user_metadata?.full_name || 'Student'}</span>
                                    <span className="text-xs text-gray-400">{user.email}</span>
                                </div>
                                {user.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-10 h-10 rounded-full border border-white/10" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <UserIcon className="w-5 h-5 text-gray-400" />
                                    </div>
                                )}
                                <button 
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link 
                                    href="/login"
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-lg font-medium transition-all"
                                >
                                    Login
                                </Link>
                                <Link 
                                    href="/signup"
                                    className="bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 px-4 py-2 rounded-lg font-medium transition-all"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
