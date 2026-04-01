import Link from "next/link";

const links = [
  { label: "Home", href: "/main#hero" },
  { label: "Puzzle Games", href: "/main#puzzle-games" },
  { label: "Challenges", href: "/main#challenges" },
  { label: "Hackathons", href: "/main#hackathons" },
  { label: "Webinars", href: "/main#webinar" },
  { label: "Study Groups", href: "/main#study-groups" },
  { label: "About Us", href: "/main#about-us" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/45 px-8 py-10 md:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/70">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-cyan-200">
              {link.label}
            </a>
          ))}
          <Link href="/login" className="transition hover:text-cyan-200">
            Login
          </Link>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/50">
          <p>Copyright © 2026 Project-24.</p>
          <p className="text-cyan-200/80">Learn. Build. Teach.</p>
        </div>
      </div>
    </footer>
  );
}
