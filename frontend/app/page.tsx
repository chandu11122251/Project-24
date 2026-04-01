import Link from "next/link";
import StarfieldBackground from "@/components/background/StarfieldBackground";

const pages = [
  {
    title: "Puzzle Games",
    description: "Sharpen logic and speed with short collaborative puzzles.",
    href: "/puzzle-games",
  },
  {
    title: "Challenges",
    description: "Build consistency through weekly challenge streaks.",
    href: "/challenges",
  },
  {
    title: "Hackathons",
    description: "Join team-based build sprints and demo your ideas.",
    href: "/hackathons",
  },
  {
    title: "Webinars",
    description: "Attend live sessions with mentors and industry guests.",
    href: "/webinar",
  },
  {
    title: "Study Groups",
    description: "Find focused circles for accountability and revision.",
    href: "/study-groups",
  },
  {
    title: "About Us",
    description: "Learn how Project-24 helps learners teach learners.",
    href: "/about-us",
  },
] as const;

export default function Home() {
  return (
    <StarfieldBackground>
      <main className="relative z-10 w-full max-w-6xl rounded-2xl border border-white/10 bg-white/5 p-8 text-white shadow-2xl backdrop-blur-md md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/80">Peer-to-peer learning platform</p>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">Project-24</h1>
            <p className="max-w-2xl text-white/75">
              Explore each experience as its own page: puzzles, challenges, hackathons, webinars, study groups, and community story.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-5 py-2.5 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/15"
          >
            Sign In / Sign Up
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="rounded-2xl border border-white/10 bg-black/30 p-5 transition hover:border-cyan-300/35 hover:bg-cyan-400/10"
            >
              <h2 className="text-xl font-semibold">{page.title}</h2>
              <p className="mt-2 text-sm text-white/70">{page.description}</p>
              <span className="mt-4 inline-block text-sm font-medium text-cyan-200">Open page →</span>
            </Link>
          ))}
        </div>
      </main>
    </StarfieldBackground>
  );
}
