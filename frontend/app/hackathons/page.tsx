"use client";

import Link from "next/link";
import StarfieldBackground from "@/components/background/StarfieldBackground";
import BorderGlow from "@/components/effects/BorderGlow";
import StarBorder from "@/components/effects/StarBorder";
import {
  Rocket,
  Globe,
  Leaf,
  GraduationCap,
  HeartPulse,
  CodeSquare,
  Shield,
  Coins,
  Timer,
  Users,
} from "lucide-react";
import "./hackathons.css";

type Hackathon = {
  id: string;
  title: string;
  description: string;
  category: string;
  format: "Online" | "In-Person" | "Hybrid";
  duration: string;
  participants: number;
  prizePool: string;
  icon: React.ReactNode;
  accentColor: string;
  glowColor: string;
  gradientColors: [string, string, string];
  tags: string[];
  status: "Live" | "Upcoming" | "Completed";
};

const hackathons: Hackathon[] = [
  {
    id: "ai-global",
    title: "Global AI Hackathon 2026",
    description:
      "Push the frontiers of artificial intelligence. Build LLM agents, multimodal models, or creative AI tools to solve real-world problems in 72 hours.",
    category: "Artificial Intelligence",
    format: "Online",
    duration: "72 Hours",
    participants: 4520,
    prizePool: "$50,000",
    icon: <Rocket className="h-6 w-6" />,
    accentColor: "#f97316",
    glowColor: "25 85 65",
    gradientColors: ["#f97316", "#fb923c", "#ea580c"],
    tags: ["AI/ML", "LLM", "Agents"],
    status: "Live",
  },
  {
    id: "web3-buildathon",
    title: "Web3 Buildathon",
    description:
      "Design and deploy decentralized applications. Focus on DeFi, NFTs, and zero-knowledge proofs. Join the decentralized web revolution.",
    category: "Blockchain",
    format: "Hybrid",
    duration: "48 Hours",
    participants: 1250,
    prizePool: "$25,000",
    icon: <Globe className="h-6 w-6" />,
    accentColor: "#a855f7",
    glowColor: "280 75 65",
    gradientColors: ["#a855f7", "#c084fc", "#7c3aed"],
    tags: ["DeFi", "Solidity", "ZK-Rollups"],
    status: "Upcoming",
  },
  {
    id: "green-tech",
    title: "GreenTech Innovators",
    description:
      "Hack to save the planet. Create software or hardware solutions focusing on sustainability, clear energy, and carbon footprint reduction.",
    category: "Climate Tech",
    format: "Online",
    duration: "1 Week",
    participants: 890,
    prizePool: "$15,000",
    icon: <Leaf className="h-6 w-6" />,
    accentColor: "#10b981",
    glowColor: "160 75 60",
    gradientColors: ["#10b981", "#34d399", "#059669"],
    tags: ["Climate", "Sustainability", "IoT"],
    status: "Upcoming",
  },
  {
    id: "edtech-solutions",
    title: "EdTech Builders",
    description:
      "Rethink education and learning management systems. Build platforms that make learning more accessible, interactive, and personalized.",
    category: "Education",
    format: "Online",
    duration: "48 Hours",
    participants: 654,
    prizePool: "$10,000",
    icon: <GraduationCap className="h-6 w-6" />,
    accentColor: "#3b82f6",
    glowColor: "220 80 65",
    gradientColors: ["#3b82f6", "#60a5fa", "#2563eb"],
    tags: ["EdTech", "LMS", "Accessibility"],
    status: "Live",
  },
  {
    id: "health-ui",
    title: "HealthTech UI/UX Jam",
    description:
      "Design user-friendly, accessible interfaces for healthcare applications. Focus on patient portals, telemedicine dashboards, and health tracking apps.",
    category: "Design",
    format: "Online",
    duration: "24 Hours",
    participants: 412,
    prizePool: "$5,000",
    icon: <HeartPulse className="h-6 w-6" />,
    accentColor: "#ec4899",
    glowColor: "330 80 65",
    gradientColors: ["#ec4899", "#f472b6", "#db2777"],
    tags: ["UI/UX", "Healthcare", "Figma"],
    status: "Live",
  },
  {
    id: "open-source",
    title: "Open Source Contributhon",
    description:
      "A month-long celebration of open-source software. Contribute to major repositories, fix bugs, write docs, and collaborate globally.",
    category: "Open Source",
    format: "Online",
    duration: "1 Month",
    participants: 3200,
    prizePool: "Swag & Badges",
    icon: <CodeSquare className="h-6 w-6" />,
    accentColor: "#22d3ee",
    glowColor: "190 80 70",
    gradientColors: ["#22d3ee", "#67e8f9", "#06b6d4"],
    tags: ["OSS", "GitHub", "Community"],
    status: "Live",
  },
  {
    id: "mobile-security",
    title: "Mobile Security CTF",
    description:
      "Test your ethical hacking skills in this mobile-focused Capture The Flag. Exploit vulnerabilities in native and cross-platform apps.",
    category: "Cybersecurity",
    format: "In-Person",
    duration: "24 Hours",
    participants: 300,
    prizePool: "$20,000",
    icon: <Shield className="h-6 w-6" />,
    accentColor: "#eab308",
    glowColor: "50 85 60",
    gradientColors: ["#eab308", "#facc15", "#ca8a04"],
    tags: ["CTF", "Security", "Mobile"],
    status: "Upcoming",
  },
  {
    id: "fintech-disrupt",
    title: "FinTech Disruptors",
    description:
      "Build the future of finance. Focus on scalable payment systems, investment platforms, and financial literacy tools for the next generation.",
    category: "Finance",
    format: "Hybrid",
    duration: "48 Hours",
    participants: 780,
    prizePool: "$30,000",
    icon: <Coins className="h-6 w-6" />,
    accentColor: "#f59e0b",
    glowColor: "38 90 65",
    gradientColors: ["#f59e0b", "#fbbf24", "#d97706"],
    tags: ["FinTech", "Payments", "Trading"],
    status: "Upcoming",
  },
];

const statusConfig: Record<
  Hackathon["status"],
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
  Completed: {
    label: "COMPLETED",
    dotClass: "status-dot--completed",
    badgeClass: "status-badge--completed",
  },
};

const formatColor: Record<Hackathon["format"], string> = {
  Online: "text-emerald-400",
  Hybrid: "text-amber-400",
  "In-Person": "text-sky-400",
};

export default function HackathonsPage() {
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
        <div className="hackathons-hero-icon mb-6">
          <Rocket className="h-10 w-10 text-cyan-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-cyan-300 via-white to-cyan-300 bg-clip-text text-transparent pb-2">
          Hackathons
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/60 leading-relaxed">
          Collaborate, innovate, and build. Join global events to level up your skills, create amazing projects, and win huge prizes.
        </p>

        {/* Stats strip */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-cyan-400">
              {hackathons.reduce((a, c) => a + c.participants, 0).toLocaleString()}+
            </span>
            <span className="text-xs text-white/40 uppercase tracking-wider mt-1">
              Hackers
            </span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-purple-400">
              {hackathons.length}
            </span>
            <span className="text-xs text-white/40 uppercase tracking-wider mt-1">
              Events
            </span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-emerald-400">
              {hackathons.filter((c) => c.status === "Live").length}
            </span>
            <span className="text-xs text-white/40 uppercase tracking-wider mt-1">
              Live Now
            </span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-amber-400">
              $145K+
            </span>
            <span className="text-xs text-white/40 uppercase tracking-wider mt-1">
              In Prizes
            </span>
          </div>
        </div>
      </header>

      {/* Cards grid */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="hackathons-grid">
          {hackathons.map((hackathon, idx) => (
            <div
              key={hackathon.id}
              className="hackathon-card-wrapper"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <BorderGlow
                edgeSensitivity={28}
                glowColor={hackathon.glowColor}
                backgroundColor="#0a0e1a"
                borderRadius={20}
                glowRadius={24}
                glowIntensity={0.7}
                coneSpread={22}
                animated={false}
                colors={hackathon.gradientColors}
                className="hackathon-card-glow h-full"
              >
                <article className="hackathon-card" id={`hackathon-${hackathon.id}`}>
                  {/* Status badge */}
                  <div className="hackathon-card__header">
                    <div
                      className={`status-badge ${statusConfig[hackathon.status].badgeClass}`}
                    >
                      <span
                        className={`status-dot ${statusConfig[hackathon.status].dotClass}`}
                      />
                      {statusConfig[hackathon.status].label}
                    </div>
                    <span
                      className={`text-xs font-medium ${formatColor[hackathon.format]}`}
                    >
                      {hackathon.format}
                    </span>
                  </div>

                  {/* Icon + Title */}
                  <div className="hackathon-card__title-row">
                    <div
                      className="hackathon-card__icon"
                      style={
                        {
                          "--icon-accent": hackathon.accentColor,
                        } as React.CSSProperties
                      }
                    >
                      {hackathon.icon}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-0.5">
                        {hackathon.category}
                      </p>
                      <h3 className="text-lg font-semibold text-white/95 leading-snug">
                        {hackathon.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-white/55 leading-relaxed mt-3 flex-1">
                    {hackathon.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {hackathon.tags.map((tag) => (
                      <span key={tag} className="hackathon-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="hackathon-card__footer">
                    <div className="flex flex-col gap-1.5">
                       <div className="flex items-center gap-4 text-xs text-white/40">
                         <span className="flex items-center gap-1.5">
                           <Timer className="h-3.5 w-3.5" />
                           {hackathon.duration}
                         </span>
                         <span className="flex items-center gap-1.5">
                           <Users className="h-3.5 w-3.5" />
                           {hackathon.participants}
                         </span>
                       </div>
                       <div className="text-xs font-medium text-amber-400">
                          Prize: {hackathon.prizePool}
                       </div>
                    </div>
                    <button
                      className="hackathon-join-btn"
                      style={
                        {
                          "--btn-accent": hackathon.accentColor,
                        } as React.CSSProperties
                      }
                    >
                      Register Now
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
