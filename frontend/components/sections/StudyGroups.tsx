import { BookOpen } from "lucide-react";

export default function StudyGroups() {
  return (
    <section id="study-groups" className="flex min-h-screen flex-col justify-center px-8 py-24 md:px-16">
      <div className="max-w-6xl space-y-8">
        <div className="flex items-center gap-3">
          <BookOpen className="h-7 w-7 text-cyan-300" />
          <h2 className="text-3xl font-semibold md:text-4xl">Study Groups</h2>
        </div>
        <p className="max-w-3xl text-white/75">
          Join focused study circles with shared goals, accountability check-ins, and collaborative revision plans.
        </p>

        <div className="flex snap-x gap-5 overflow-x-auto pb-3">
          {[
            "Frontend Guild",
            "DSA Sprint Crew",
            "Backend Builders",
            "System Design Circle",
          ].map((group) => (
            <article
              key={group}
              className="min-w-[260px] snap-start rounded-2xl border border-white/10 bg-black/30 p-6 md:min-w-[300px]"
            >
              <h3 className="text-lg font-semibold">{group}</h3>
              <p className="mt-3 text-sm text-white/65">Weekly sessions, shared tasks, and peer-led doubt clearing.</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
