"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
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
import { useAuth } from "@backend/AuthProvider";
import { getChallenges } from "@backend/db.js";

import { Challenge } from "@/types/challenge";

const IconMap: Record<string, ReactNode> = {
  Swords: <Swords className="h-6 w-6" />,
  Palette: <Palette className="h-6 w-6" />,
  Brain: <Brain className="h-6 w-6" />,
  Timer: <Timer className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
  Users: <Users className="h-6 w-6" />,
  Code2: <Code2 className="h-6 w-6" />,
  Flame: <Flame className="h-6 w-6" />,
  Trophy: <Trophy className="h-6 w-6" />,
};

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
  Completed: {
    label: "COMPLETED",
    dotClass: "status-dot--completed",
    badgeClass: "status-badge--completed",
  },
};

const difficultyColor: Record<Challenge["difficulty"], string> = {
  Beginner: "text-emerald-400",
  Intermediate: "text-amber-400",
  Advanced: "text-red-400",
  "All Levels": "text-sky-400",
};

export default function ChallengesPage() {
  const { user, loading: authLoading } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const data = await getChallenges();
        setChallenges(data as Challenge[]);
      } catch (err) {
        console.error("Failed to fetch challenges:", err);
      }
    };
    fetchChallenges();
  }, []);

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
        <div className="flex items-center gap-4">
          {!user && !authLoading && (
            <Link href="/login" className="group">
              <StarBorder as="span" color="cyan" speed="5s" thickness={1}>
                <span className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-cyan-100 transition-colors duration-200 group-hover:text-white">
                  Sign In
                </span>
              </StarBorder>
            </Link>
          )}
          {user && (
            <Link href="/challenges/create" className="group">
              <StarBorder as="span" color="purple" speed="5s" thickness={1}>
                <span className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-purple-100 transition-colors duration-200 group-hover:text-white">
                  Create Challenge
                </span>
              </StarBorder>
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <header className="relative z-10 flex flex-col items-center text-center pt-32 pb-12 px-4">
        <div className="challenges-hero-icon mb-6">
          <Zap className="h-10 w-10 text-cyan-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-linear-to-r from-cyan-300 via-white to-cyan-300 bg-clip-text text-transparent pb-2">
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
              {challenges.reduce((a: number, c: Challenge) => a + (c.participants || 0), 0).toLocaleString()}+
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
              {challenges.filter((c: Challenge) => c.status === "Live").length}
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
          {challenges.map((challenge: Challenge, idx: number) => (
            <div
              key={challenge.id}
              className="challenge-card-wrapper"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <BorderGlow
                edgeSensitivity={28}
                glowColor={challenge.status === "Completed" ? "100 0 50" : challenge.glowColor}
                backgroundColor="#0a0e1a"
                borderRadius={20}
                glowRadius={24}
                glowIntensity={challenge.status === "Completed" ? 0.2 : 0.7}
                coneSpread={22}
                animated={false}
                colors={challenge.gradientColors}
                className={`challenge-card-glow h-full ${challenge.status === "Completed" ? "grayscale opacity-80" : ""}`}
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
                          "--icon-accent": challenge.status === "Completed" ? "#666" : challenge.accentColor,
                        } as React.CSSProperties
                      }
                    >
                      {challenge.icon && IconMap[challenge.icon as string] ? IconMap[challenge.icon as string] : <Zap className="h-6 w-6" />}
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
                    <Link
                      href={`/challenges/${challenge.id}`}
                      className="challenge-join-btn text-center flex items-center justify-center"
                      style={
                        {
                          "--btn-accent": challenge.status === "Completed" ? "#444" : challenge.accentColor,
                          pointerEvents: challenge.status === "Completed" ? "none" : "auto",
                          opacity: challenge.status === "Completed" ? 0.5 : 1
                        } as React.CSSProperties
                      }
                    >
                      {challenge.status === "Completed" ? "Archived" : "View Details"}
                    </Link>
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
