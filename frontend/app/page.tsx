"use client";

import { TransitionLink } from "@/components/effects/TransitionLink";
import { KineticCard, KineticPage } from "@/components/effects/KineticTransition";
import RippleGridBackground from "@/components/background/RippleGridBackground";
import { useAuth } from "@backend/AuthProvider";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#06070f]">
      {/* Dynamic Background */}
      <RippleGridBackground className="fixed inset-0 z-0 h-full w-full" />
      
      {/* Decorative Branding - Center Screen */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <h1 className="text-[20vw] font-black tracking-tighter text-white/5 uppercase select-none">
          P24
        </h1>
      </div>

      <KineticPage 
        pageKey="root-gateway" 
        className="fixed inset-0 z-10 flex flex-col items-center justify-end px-6 pb-16 pointer-events-none"
      >
        <KineticCard index={0} className="pointer-events-auto">
          <div className="flex flex-col items-center gap-12">
            {/* Tagline */}
            <div className="text-center space-y-2 translate-y-4">
              <p className="text-[10px] uppercase tracking-[0.6em] font-black text-cyan-400 animate-pulse">
                Neural Link Established
              </p>
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-bold">
                A Learner-First Engineering Ecosystem
              </p>
            </div>

            {/* Remodeled Get Started Button */}
            <TransitionLink
              href="/main"
              className="group relative inline-flex items-center justify-center min-w-[280px] h-16 rounded-full bg-black border border-white/10 transition-all duration-500 hover:border-cyan-500/50 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Internal Glow Effect */}
              <div className="absolute inset-0 bg-linear-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Animated Ring */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                <div className="absolute -inset-full bg-conic-to-r from-transparent via-cyan-500/40 to-transparent animate-[spin_4s_linear_infinite]" />
              </div>
              
              {/* Button Content */}
              <div className="relative z-10 flex items-center gap-4 px-12">
                <span className="text-[13px] font-black uppercase tracking-[0.4em] text-white group-hover:text-cyan-50 transition-colors">
                  Get Started
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4] animate-pulse" />
              </div>
              
              {/* Neon Underglow */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-px bg-cyan-500 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </TransitionLink>
          </div>
        </KineticCard>
      </KineticPage>
    </div>
  );
}
