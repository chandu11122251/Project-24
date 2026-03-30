import { Info } from "lucide-react";

export default function AboutUs() {
  return (
    <section id="about-us" className="flex min-h-screen flex-col justify-center px-8 py-24 md:px-16">
      <div className="max-w-6xl space-y-8">
        <div className="flex items-center gap-3">
          <Info className="h-7 w-7 text-cyan-300" />
          <h2 className="text-3xl font-semibold md:text-4xl">About Us</h2>
        </div>

        <p className="max-w-3xl text-white/75">
          Project-24 is built on a simple idea: the best way to learn is to build, explain, and support each other.
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-[var(--color-surface)]/65 p-6">
            <h3 className="text-lg font-semibold">Mission</h3>
            <p className="mt-3 text-sm text-white/65">Create a learner-first ecosystem where everyone can teach and grow together.</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-[var(--color-surface)]/65 p-6">
            <h3 className="text-lg font-semibold">Values</h3>
            <p className="mt-3 text-sm text-white/65">Consistency, curiosity, collaboration, and clarity over competition alone.</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-[var(--color-surface)]/65 p-6">
            <h3 className="text-lg font-semibold">Team</h3>
            <p className="mt-3 text-sm text-white/65">A small cross-functional crew focused on practical, community-powered learning.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
