'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Globe, ShieldCheck } from 'lucide-react';

export const HeroSection = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-aura-black text-white selection:bg-aura-cyan selection:text-aura-black">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(10,17,40,0.8),rgba(2,4,8,1))]"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('/assets/aura-hero-bg.png')] bg-cover bg-center animate-pulse-slow"></div>
                {/* Abstract glowing orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-aura-purple/20 rounded-full blur-[100px] animate-float"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-aura-cyan/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-50 w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-aura-cyan to-aura-purple flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full opacity-80"></div>
                    </div>
                    <span className="text-xl font-bold tracking-wider text-white">INAIA</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                    <Link href="#" className="hover:text-aura-cyan transition-colors">Intelligence</Link>
                    <Link href="#" className="hover:text-aura-cyan transition-colors">Strategies</Link>
                    <Link href="#" className="hover:text-aura-cyan transition-colors">Private Client</Link>
                </div>

                <Link href="/consultation" className="glass-hero px-6 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-all border-white/20">
                    Member Login
                </Link>
            </nav>

            {/* Main Content */}
            <main className="relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 pt-12 lg:pt-20 pb-20 min-h-[calc(100vh-100px)]">

                {/* Left Side: Typography */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full lg:w-1/2 flex flex-col gap-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-hero w-fit border-aura-cyan/30">
                        <span className="w-2 h-2 rounded-full bg-aura-cyan animate-pulse"></span>
                        <span className="text-xs font-medium text-aura-cyan tracking-wide uppercase">System Online v2.4</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                        The Future of <br />
                        <span className="text-gradient-aura text-glow">Wealth is Intelligent.</span>
                    </h1>

                    <p className="text-lg lg:text-xl text-gray-400 max-w-lg leading-relaxed">
                        Institutional-grade investing strategies, personalized by advanced AI.
                        Experience the ethereal clarity of data-driven growth.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <Link href="/consultation" className="group relative px-8 py-4 bg-white text-aura-black rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(0,240,255,0.4)]">
                            <span className="relative z-10 flex items-center gap-2">
                                Start Your Growth Engine <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-aura-cyan to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>

                        <button className="px-8 py-4 rounded-full glass-hero text-white font-medium hover:bg-white/10 transition-all border-white/10 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-aura-purple" /> View Demo
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-12 grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
                        <div>
                            <div className="text-3xl font-bold text-white">5B+</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider mt-1">Active Data Points</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">$2.4M</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider mt-1">Avg. Portfolio Growth</div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: 3D Visualization */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="w-full lg:w-1/2 h-[500px] lg:h-[700px] relative mt-12 lg:mt-0"
                >
                    {/* Central Hologram Container */}
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Rotating Rings (CSS only representation of complex 3D) */}
                        <div className="absolute w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] border border-aura-cyan/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                        <div className="absolute w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] border border-aura-purple/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                        <div className="absolute w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] border border-white/10 rounded-full animate-[spin_20s_linear_infinite]"></div>

                        {/* Core Image */}
                        <div className="relative z-10 w-[80%] h-[80%] bg-[url('/assets/aura-ai-viz.png')] bg-contain bg-center bg-no-repeat drop-shadow-[0_0_50px_rgba(0,240,255,0.3)] animate-float">
                            {/* Fallback if image missing: Abstract CSS shape */}
                            <div className="w-full h-full flex items-center justify-center opacity-50">
                                <div className="w-32 h-32 bg-gradient-to-b from-aura-cyan to-aura-purple rounded-full blur-3xl"></div>
                            </div>
                        </div>

                        {/* Floating Data Cards */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[20%] right-[10%] glass-hero p-4 rounded-xl border-l-4 border-aura-cyan max-w-[180px]"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Globe className="w-4 h-4 text-aura-cyan" />
                                <span className="text-xs font-bold text-white">Global Markets</span>
                            </div>
                            <div className="text-xs text-gray-400">Analyzing 42 regions...</div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-[25%] left-[5%] glass-hero p-4 rounded-xl border-l-4 border-aura-purple max-w-[180px]"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldCheck className="w-4 h-4 text-aura-purple" />
                                <span className="text-xs font-bold text-white">Risk Shield</span>
                            </div>
                            <div className="text-xs text-gray-400">Volatility dampened by 34%</div>
                        </motion.div>
                    </div>
                </motion.div>
            </main>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-aura-black to-transparent z-20"></div>
        </div>
    );
};
