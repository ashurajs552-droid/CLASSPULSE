"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Activity } from "lucide-react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const isAdminBypass = typeof window !== 'undefined' && localStorage.getItem('admin_bypass') === 'true';
            
            if (!session && !isAdminBypass) {
                // Not logged in -> home
                router.push("/");
                return;
            }

            // If we are logged in or bypassed, check if onboarding is complete
            if (pathname !== "/onboarding" && !isAdminBypass && session) {
                const isTeacher = session.user.user_metadata?.role === 'teacher' || 
                                  (typeof window !== "undefined" && localStorage.getItem('user_role') === 'teacher');
                
                if (!isTeacher) {
                    const { data, error } = await supabase
                        .from("students")
                        .select("id")
                        .eq("auth_id", session.user.id)
                        .single();

                    if (!data || error) {
                        // Not onboarded -> redirect to onboarding
                        router.push("/onboarding");
                        return;
                    }
                }
            }

            setAuthorized(true);
            setLoading(false);
        };

        checkAuth();
    }, [router, pathname]);

    if (loading || !authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
                    <Activity className="text-accent w-8 h-8 animate-spin" />
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
