import { TransitionLink } from "@/components/effects/TransitionLink";
import { KineticPage } from "@/components/effects/KineticTransition";
import RippleGrid from "@/components/RippleGrid";

export default function GetStartedPage() {
  return (
    <KineticPage pageKey="getstarted">
    <div className="relative min-h-screen w-full overflow-hidden bg-[#06070f] text-white">
      <div className="fixed inset-0 z-0 h-screen w-screen">
        <RippleGrid
          enableRainbow
          gridColor="#5227FF"
          rippleIntensity={0.14}
          gridSize={27}
          gridThickness={16}
          fadeDistance={4.4}
          vignetteStrength={5}
          glowIntensity={0.35}
          opacity={1}
          gridRotation={0}
          mouseInteraction
          mouseInteractionRadius={2.2}
        />
      </div>
      <main className="relative z-10 flex min-h-screen w-full items-end justify-center px-6 pb-12">
        <TransitionLink
          href="/main"
          className="inline-flex min-w-[170px] items-center justify-center rounded-lg border border-cyan-400/50 bg-cyan-500/15 px-6 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/25"
        >
          Get Started
        </TransitionLink>
      </main>
    </div>
    </KineticPage>
  );
}
