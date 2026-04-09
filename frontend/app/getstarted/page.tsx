import Link from "next/link";
import RippleGridBackground from "@/components/background/RippleGridBackground";

export default function GetStartedPage() {
  return (
    <RippleGridBackground className="relative min-h-screen w-full overflow-hidden bg-[#06070f] text-white">
      <main className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl rounded-2xl border border-cyan-500/25 bg-[#0a111f]/85 p-8 text-center shadow-[0_0_40px_rgba(14,165,233,0.18)] backdrop-blur-sm">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-cyan-200/75">Project-24</p>
          <h1 className="mb-4 text-3xl font-semibold leading-tight text-white">Welcome to Get Started</h1>
          <p className="mb-8 text-sm leading-relaxed text-slate-200/80">
            Your ripple background is back. Start by signing in or head to the main experience.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex min-w-[150px] items-center justify-center rounded-lg border border-cyan-400/50 bg-cyan-500/15 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/25"
            >
              Sign In
            </Link>
            <Link
              href="/main"
              className="inline-flex min-w-[150px] items-center justify-center rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explore Main Page
            </Link>
          </div>
        </div>
      </main>
    </RippleGridBackground>
  );
}
