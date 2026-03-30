import { Puzzle } from "lucide-react";

export default function PuzzleGames() {
  return (
    <section id="puzzle-games" className="flex min-h-screen flex-col justify-center px-8 py-24 md:px-16">
      <div className="max-w-5xl space-y-8">
        <div className="flex items-center gap-3">
          <Puzzle className="h-7 w-7 text-cyan-300" />
          <h2 className="text-3xl font-semibold md:text-4xl">Puzzle Games</h2>
        </div>
        <p className="max-w-3xl text-white/75">
          Sharpen logic and speed with bite-sized interactive puzzles designed for collaborative solving and concept retention.
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-[var(--color-surface)]/70 p-6">
            <h3 className="text-xl font-medium">Daily Logic Sprint</h3>
            <p className="mt-3 text-sm text-white/65">Solve timed pattern and algorithm puzzles. Track streaks and team scores.</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-[var(--color-surface)]/70 p-6">
            <h3 className="text-xl font-medium">Concept Unlocks</h3>
            <p className="mt-3 text-sm text-white/65">Unlock higher tiers by explaining your solution to peers in discussion rooms.</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-[var(--color-surface)]/70 p-6">
            <h3 className="text-xl font-medium">Team Puzzle Arena</h3>
            <p className="mt-3 text-sm text-white/65">Compete in cooperative rounds where each teammate contributes clues.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
