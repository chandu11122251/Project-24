import { Code2 } from "lucide-react";

export default function Hackathons() {
  return (
    <section id="hackathons" className="flex min-h-screen flex-col justify-center px-8 py-24 md:px-16">
      <div className="max-w-6xl space-y-8">
        <div className="flex items-center gap-3">
          <Code2 className="h-7 w-7 text-cyan-300" />
          <h2 className="text-3xl font-semibold md:text-4xl">Hackathons</h2>
        </div>
        <p className="max-w-3xl text-white/75">
          Team up for rapid innovation sprints where learners build real products with mentors and community judges.
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          {["AI Study Companion", "Peer Tutoring Matchmaker", "Campus Learning Dashboard"].map((title) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-black/30 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Upcoming</p>
              <h3 className="mt-2 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm text-white/65">Placeholder track details, timelines, and team slots will appear here.</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
