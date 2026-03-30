import { Video } from "lucide-react";

export default function Webinar() {
  return (
    <section id="webinar" className="flex min-h-screen flex-col justify-center px-8 py-24 md:px-16">
      <div className="max-w-6xl space-y-8">
        <div className="flex items-center gap-3">
          <Video className="h-7 w-7 text-cyan-300" />
          <h2 className="text-3xl font-semibold md:text-4xl">Webinars</h2>
        </div>
        <p className="max-w-3xl text-white/75">
          Attend live sessions with mentors, alumni, and industry experts on engineering, productivity, and career growth.
        </p>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[
            "Building with Next.js 16",
            "Learning in Public: Better Habits",
            "Cracking Technical Interviews",
            "Design Systems for Devs",
            "Open Source Collaboration",
            "From Idea to MVP",
          ].map((topic) => (
            <article key={topic} className="rounded-2xl border border-white/10 bg-[var(--color-surface)]/60 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/75">Webinar</p>
              <h3 className="mt-2 text-lg font-semibold">{topic}</h3>
              <p className="mt-3 text-sm text-white/65">Speaker and schedule details will be published soon.</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
