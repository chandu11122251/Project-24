"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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
        <KineticCard index={0} className="text-center font-mono">
          <div className="relative">
            {/* The Glitch Heading - Smaller Header */}
            <h1 className="text-[9px] uppercase tracking-[0.8em] font-black text-white/20 mb-6">
              Critical Error: Sector Not Assigned
            </h1>
            
            <div className="space-y-2 border-l border-white/5 pl-6 text-left">
              <p className="text-sm md:text-base text-white/60 leading-relaxed tracking-tight whitespace-nowrap">
                <span className="text-cyan-500 font-bold">{glitchText}</span> does not exist how did u end up here <span className="text-cyan-500 animate-pulse cursor-help">twn</span>...
              </p>
              
              <div className="pt-4 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-cyan-500/40 animate-ping" />
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/10">
                  Scanning for starfield integrity
                </p>
              </div>
            </div>
          </div>
        </KineticCard>
      </KineticPage>

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)]" />
    </StarfieldBackground>
  );
}
