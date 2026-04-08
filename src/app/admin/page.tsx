"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import { Shield } from "lucide-react";

export default function AdminPage() {
    return (
        <div className="pt-32 pb-20 px-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6"
                >
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black font-outfit mb-4 text-center md:text-left">Control Panel</h1>
                        <p className="text-gray-400">Admin dashboard is currently a blank slate.</p>
                    </div>
                </motion.div>

                <GlassCard className="flex flex-col items-center justify-center py-32 text-center border-dashed border-white/20">
                    <Shield className="w-16 h-16 text-primary/30 mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-2">No Active Data</h3>
                    <p className="text-gray-400 max-w-md mx-auto">
                        Test dataset has been removed. The admin interface is ready for live production data integration.
                    </p>
                </GlassCard>
            </div>
        </div>
    );
}
