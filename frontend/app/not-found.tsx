"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/effects/TransitionLink";
import StarfieldBackground from "@/components/background/StarfieldBackground";
import { KineticCard, KineticPage } from "@/components/effects/KineticTransition";

export default function NotFound() {
  const pathname = usePathname();
  const [glitchText, setGlitchText] = useState(pathname);

  // Glitch effect for the pathname
  useEffect(() => {
    const chars = "!@#$%^&*()_+{}[];,./<>?";
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        const scrambled = pathname
          .split("")
          .map(c => (Math.random() > 0.8 ? chars[Math.floor(Math.random() * chars.length)] : c))
          .join("");
        setGlitchText(scrambled);
        setTimeout(() => setGlitchText(pathname), 80);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [pathname]);

  return (
    <StarfieldBackground className="relative h-screen w-screen overflow-hidden bg-[#06070f]">
      <KineticPage pageKey="not-found" className="fixed inset-0 z-10 flex flex-col items-center justify-center px-6">
        <KineticCard index={0} className="text-center">
          <div className="relative group">
            {/* The Glitch Heading */}
            <h1 className="text-[10px] uppercase tracking-[1em] font-black text-cyan-400/40 mb-12 animate-pulse">
              System Fragmentation Detected
            </h1>
            
            <div className="space-y-6">
              <p className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight max-w-3xl border-l border-cyan-500/20 pl-8">
                <span className="text-cyan-500 font-mono inline-block mb-2">{glitchText}</span>
                <br />
                does not exist
                <br />
                how did u end up here
                <span className="text-cyan-500 animate-pulse transition-all duration-75 hover:text-white cursor-help"> twn</span>...
              </p>
              
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/10 mt-12 italic">
                You are drifting in unassigned sectors
              </p>
            </div>

            <div className="mt-20 flex justify-center">
              <TransitionLink
                href="/main"
                className="group relative inline-flex items-center justify-center px-12 py-4 rounded-lg bg-white/5 border border-white/10 transition-all duration-300 hover:bg-cyan-500/10 hover:border-cyan-500/30 active:scale-95"
              >
                <div className="relative z-10 flex items-center gap-3">
                  <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white/50 group-hover:text-cyan-100 transition-colors">
                    Return to Arena
                  </span>
                </div>
              </TransitionLink>
            </div>
          </div>
        </KineticCard>
      </KineticPage>

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)]" />
    </StarfieldBackground>
  );
}
