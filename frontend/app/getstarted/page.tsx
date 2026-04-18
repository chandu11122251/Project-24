"use client";

import { TransitionLink } from "@/components/effects/TransitionLink";
import { KineticCard, KineticPage } from "@/components/effects/KineticTransition";
import RippleGridBackground from "@/components/background/RippleGridBackground";
import StarBorder from "@/components/effects/StarBorder";
import { useAuth } from "@backend/AuthProvider";

export default function GetStartedPage() {
  const { user, loading } = useAuth();

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#06070f]">
      <RippleGridBackground className="fixed inset-0 z-0 h-full w-full" />
      
      <KineticPage 
        pageKey="getstarted" 
        className="fixed inset-0 z-10 flex flex-col items-center justify-end px-6 pb-32 pointer-events-none"
      >
        <KineticCard index={0} className="pointer-events-auto">
          <TransitionLink
            href="/main"
            className="inline-flex min-w-[240px] items-center justify-center rounded-lg border border-cyan-400/50 bg-cyan-500/10 px-10 py-5 text-base font-bold text-cyan-50 transition-all duration-300 hover:bg-cyan-500/20 hover:scale-110 active:scale-95 uppercase tracking-[0.25em] shadow-[0_0_25px_rgba(34,211,238,0.15)] glow-cyan-sm"
          >
            Get Started
          </TransitionLink>
        </KineticCard>
      </KineticPage>
    </div>
  );
}
