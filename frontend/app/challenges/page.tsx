"use client";

import Link from "next/link";
import StarfieldBackground from "@/components/background/StarfieldBackground";
import BorderGlow from "@/components/effects/BorderGlow";
import StarBorder from "@/components/effects/StarBorder";
import {
  Zap,
  Code2,
  Palette,
  Trophy,
  Brain,
  Users,
  Flame,
  Timer,
  Swords,
  Sparkles,
} from "lucide-react";
import "./challenges.css";

type Challenge = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  duration: string;
  participants: number;
  icon: React.ReactNode;
  accentColor: string;
  glowColor: string;
  gradientColors: [string, string, string];
  tags: string[];
  status: "Live" | "Upcoming" | "Weekly" | "Monthly";
};

const challenges: Challenge[] = [
  {
    id: "coding-contest",
    title: "Coding Contest Arena",
    description:
      "Compete head-to-head in timed algorithm battles. Solve complex problems under pressure, climb the leaderboard, and earn your rank among the best coders.",
    category: "Competition",
    difficulty: "Intermediate",
    duration: "2 Hours",
    participants: 342,
    icon: <Swords className="h-6 w-6" />,
    accentColor: "#f97316",
    glowColor: "25 85 65",
    gradientColors: ["#f97316", "#fb923c", "#ea580c"],
    tags: ["Algorithms", "Speed", "Ranked"],
    status: "Live",
  },
  {
    id: "vibe-coding",
    title: "Vibe Coding Sessions",
    description:
      "No pressure, no deadlines — just vibes. Join ambient coding rooms with lo-fi beats, build side projects, and share creative experiments with the community.",
    category: "Creative",
    difficulty: "All Levels",
    duration: "Open-ended",
    participants: 189,
    icon: <Palette className="h-6 w-6" />,
    accentColor: "#a855f7",
    glowColor: "280 75 65",
    gradientColors: ["#a855f7", "#c084fc", "#7c3aed"],
    tags: ["Chill", "Side Projects", "Creative"],
    status: "Live",
  },
  {
    id: "dsa-sprint",
    title: "7-Day DSA Sprint",
    description:
      "One focused data structure problem per day for a week. Post your solution with explanations, get peer reviews, and build deep algorithmic intuition.",
    category: "Learning",
    difficulty: "Beginner",
    duration: "7 Days",
    participants: 527,
    icon: <Brain className="h-6 w-6" />,
    accentColor: "#22d3ee",
    glowColor: "190 80 70",
    gradientColors: ["#22d3ee", "#67e8f9", "#06b6d4"],
    tags: ["DSA", "Daily", "Peer Review"],
    status: "Weekly",
  },
  {
    id: "speed-debug",
    title: "Speed Debugging Blitz",
    description:
      "A buggy codebase drops every hour. Race to find and fix all bugs before the timer runs out. Sharpens real-world debugging instincts under fire.",
    category: "Competition",
    difficulty: "Advanced",
    duration: "60 Min",
    participants: 156,
    icon: <Timer className="h-6 w-6" />,
    accentColor: "#ef4444",
    glowColor: "0 80 65",
    gradientColors: ["#ef4444", "#f87171", "#dc2626"],
    tags: ["Debugging", "Timed", "Hardcore"],
    status: "Upcoming",
  },
  {
    id: "ui-challenge",
    title: "Frontend Craft Challenge",
    description:
      "Pixel-perfect UI recreation from Dribbble shots. Build stunning interfaces with clean code, smooth animations, and responsive design in 48 hours.",
    category: "Creative",
    difficulty: "Intermediate",
    duration: "48 Hours",
    participants: 213,
    icon: <Sparkles className="h-6 w-6" />,
    accentColor: "#ec4899",
    glowColor: "330 80 65",
    gradientColors: ["#ec4899", "#f472b6", "#db2777"],
    tags: ["CSS", "UI/UX", "Design"],
    status: "Monthly",
  },
  {
    id: "team-hackathon",
    title: "48hr Team Hackathon",
    description:
      "Form squads, pick a track, and ship a working prototype in 48 hours. Mentors, workshops, and prizes await. Build something the world needs.",
    category: "Hackathon",
    difficulty: "All Levels",
    duration: "48 Hours",
    participants: 480,
    icon: <Users className="h-6 w-6" />,
    accentColor: "#10b981",
    glowColor: "160 75 60",
    gradientColors: ["#10b981", "#34d399", "#059669"],
    tags: ["Teams", "Prototype", "Prizes"],
    status: "Upcoming",
  },
  {
    id: "code-golf",
    title: "Code Golf Tournament",
    description:
      "Write the shortest possible solution. Every character counts. Push language features to their limit and discover elegant one-line solutions.",
    category: "Competition",
    difficulty: "Advanced",
    duration: "3 Hours",
    participants: 98,
    icon: <Code2 className="h-6 w-6" />,
    accentColor: "#eab308",
    glowColor: "50 85 60",
    gradientColors: ["#eab308", "#facc15", "#ca8a04"],
    tags: ["Minimalism", "Languages", "Fun"],
    status: "Weekly",
  },
  {
    id: "streak-challenge",
    title: "30-Day Code Streak",
    description:
      "Commit code every single day for 30 days. Build an unbreakable habit. Track your streak with a heatmap and unlock milestone badges.",
    category: "Learning",
    difficulty: "Beginner",
    duration: "30 Days",
    participants: 734,
    icon: <Flame className="h-6 w-6" />,
    accentColor: "#f59e0b",
    glowColor: "38 90 65",
    gradientColors: ["#f59e0b", "#fbbf24", "#d97706"],
    tags: ["Consistency", "Habit", "Streak"],
    status: "Live",
  },
  {
    id: "open-source-quest",
    title: "Open Source Quest",
    description:
      "Land your first (or 50th) open-source contribution. Curated good-first-issues, mentorship pairing, and a supportive community to guide you through.",
    category: "Learning",
    difficulty: "All Levels",
    duration: "Ongoing",
    participants: 312,
    icon: <Trophy className="h-6 w-6" />,
    accentColor: "#3b82f6",
    glowColor: "220 80 65",
    gradientColors: ["#3b82f6", "#60a5fa", "#2563eb"],
    tags: ["OSS", "GitHub", "Mentorship"],
    status: "Live",
  },
];

const statusConfig: Record<
  Challenge["status"],
  { label: string; dotClass: string; badgeClass: string }
> = {
  Live: {
    label: "LIVE NOW",
    dotClass: "status-dot--live",
    badgeClass: "status-badge--live",
  },
  Upcoming: {
    label: "UPCOMING",
    dotClass: "status-dot--upcoming",
    badgeClass: "status-badge--upcoming",
  },
  Weekly: {
    label: "WEEKLY",
    dotClass: "status-dot--weekly",
    badgeClass: "status-badge--weekly",
  },
  Monthly: {
    label: "MONTHLY",
    dotClass: "status-dot--monthly",
    badgeClass: "status-badge--monthly",
  },
};

const difficultyColor: Record<Challenge["difficulty"], string> = {
  Beginner: "text-emerald-400",
  Intermediate: "text-amber-400",
  Advanced: "text-red-400",
  "All Levels": "text-sky-400",
};

export default function ChallengesPage() {
  return (
    <StarfieldBackground className="relative min-h-screen w-full overflow-hidden bg-[#06070f] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-[#06070f]/60 border-b border-white/5">
        <Link
          href="/main"
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
        <Link href="/login" className="group">
          <StarBorder as="span" color="cyan" speed="5s" thickness={1}>
            <span className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-cyan-100 transition-colors duration-200 group-hover:text-white">
              Sign In
            </span>
          </StarBorder>
        </Link>
      </nav>

      {/* Hero */}
      <header className="relative z-10 flex flex-col items-center text-center pt-32 pb-12 px-4">
        <div className="challenges-hero-icon mb-6">
          <Zap className="h-10 w-10 text-cyan-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-cyan-300 via-white to-cyan-300 bg-clip-text text-transparent pb-2">
          Challenges
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/60 leading-relaxed">
          Push your limits. Build consistency. From chill vibe-coding sessions to
          intense algorithmic battles — find the challenge that sparks your
          growth.
        </p>

        {/* Stats strip */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-cyan-400">
              {challenges.reduce((a, c) => a + c.participants, 0).toLocaleString()}+
            </span>
            <span className="text-xs text-white/40 uppercase tracking-wider mt-1">
              Participants
            </span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-purple-400">
              {challenges.length}
            </span>
            <span className="text-xs text-white/40 uppercase tracking-wider mt-1">
              Active Challenges
            </span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-emerald-400">
              {challenges.filter((c) => c.status === "Live").length}
            </span>
            <span className="text-xs text-white/40 uppercase tracking-wider mt-1">
              Live Now
            </span>
          </div>
        </div>
      </header>

      {/* Cards grid */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="challenges-grid">
          {challenges.map((challenge, idx) => (
            <div
              key={challenge.id}
              className="challenge-card-wrapper"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <BorderGlow
                edgeSensitivity={28}
                glowColor={challenge.glowColor}
                backgroundColor="#0a0e1a"
                borderRadius={20}
                glowRadius={24}
                glowIntensity={0.7}
                coneSpread={22}
                animated={false}
                colors={challenge.gradientColors}
                className="challenge-card-glow h-full"
              >
                <article className="challenge-card" id={`challenge-${challenge.id}`}>
                  {/* Status badge */}
                  <div className="challenge-card__header">
                    <div
                      className={`status-badge ${statusConfig[challenge.status].badgeClass}`}
                    >
                      <span
                        className={`status-dot ${statusConfig[challenge.status].dotClass}`}
                      />
                      {statusConfig[challenge.status].label}
                    </div>
                    <span
                      className={`text-xs font-medium ${difficultyColor[challenge.difficulty]}`}
                    >
                      {challenge.difficulty}
                    </span>
                  </div>

                  {/* Icon + Title */}
                  <div className="challenge-card__title-row">
                    <div
                      className="challenge-card__icon"
                      style={
                        {
                          "--icon-accent": challenge.accentColor,
                        } as React.CSSProperties
                      }
                    >
                      {challenge.icon}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-0.5">
                        {challenge.category}
                      </p>
                      <h3 className="text-lg font-semibold text-white/95 leading-snug">
                        {challenge.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-white/55 leading-relaxed mt-3 flex-1">
                    {challenge.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {challenge.tags.map((tag) => (
                      <span key={tag} className="challenge-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="challenge-card__footer">
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span className="flex items-center gap-1.5">
                        <Timer className="h-3.5 w-3.5" />
                        {challenge.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {challenge.participants}
                      </span>
                    </div>
                    <button
                      className="challenge-join-btn"
                      style={
                        {
                          "--btn-accent": challenge.accentColor,
                        } as React.CSSProperties
                      }
                    >
                      Join Challenge
                    </button>
                  </div>
                </article>
              </BorderGlow>
            </div>
          ))}
        </div>
      </section>
    </StarfieldBackground>
  );
}
