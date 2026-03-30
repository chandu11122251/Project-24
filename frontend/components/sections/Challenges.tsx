import { Zap } from "lucide-react";

export default function Challenges() {
  return (
    <section id="challenges" className="flex min-h-screen flex-col justify-center px-8 py-24 md:px-16">
      <div className="max-w-5xl space-y-8">
        <div className="flex items-center gap-3">
          <Zap className="h-7 w-7 text-cyan-300" />
          <h2 className="text-3xl font-semibold md:text-4xl">Challenges</h2>
        </div>
        <p className="max-w-3xl text-white/75">
          Build consistency through weekly coding and learning challenges that reward progress, clarity, and teamwork.
        </p>

        <article className="rounded-2xl border border-cyan-300/25 bg-gradient-to-br from-cyan-500/10 to-slate-900 p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Sample challenge</p>
          <h3 className="mt-2 text-2xl font-semibold">7-Day Data Structures Challenge</h3>
          <p className="mt-3 max-w-2xl text-white/70">
            Solve one focused DSA problem per day, post your explanation, and get peer review feedback for implementation quality and complexity tradeoffs.
          </p>
          <div className="mt-5 inline-flex rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80">Starts every Monday</div>
        </article>
      </div>
    </section>
  );
}
