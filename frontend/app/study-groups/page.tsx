"use client";

import React from "react";
import Link from "next/link";
import StarfieldBackground from "@/components/background/StarfieldBackground";
import BorderGlow from "@/components/effects/BorderGlow";
import StarBorder from "@/components/effects/StarBorder";
import { Users, BookOpen, Code, Database, Globe, Clock, User, ArrowRight, Plus } from "lucide-react";
import AnimatedList from "@/components/ui/AnimatedList";
import StudyGroupModal from "@/components/study-groups/StudyGroupModal";
import "./study-groups.css";

export default function StudyGroupsPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const studyGroupCards = [
    (
      <div className="study-group-card-wrapper w-full">
        <BorderGlow
          edgeSensitivity={28}
          glowColor="270 80 65"
          backgroundColor="#0a0e1a"
          borderRadius={20}
          glowRadius={24}
          glowIntensity={0.6}
          coneSpread={22}
          animated={false}
          colors={["#a855f7", "#c084fc", "#9333ea"]}
          className="study-group-card-glow h-full"
        >
          <article className="study-group-card">
            <div className="study-group-card__info">
              <div className="flex items-center gap-3 mb-4">
                <div className="study-group-card__icon" style={{ "--icon-accent": "#a855f7" } as React.CSSProperties}>
                  <Globe className="h-7 w-7" />
                </div>
                <span className="study-group-status-badge status-active">
                  Active
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white/95 leading-snug mb-3">
                Frontend Guild
              </h3>
              <p className="text-base text-white/55 leading-relaxed flex-1">
                A weekly circle focused on the next generation of web interfaces. We dive deep into React 19, Server Components, and advanced animation patterns using Framer Motion and OGL.
              </p>
              <div className="study-group-meta">
                <span className="study-group-meta__item">
                  <Clock className="h-3.5 w-3.5" />
                  Tuesday, 8:00 PM
                </span>
                <span className="study-group-meta__item">
                  <User className="h-3.5 w-3.5" />
                  12 Members
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-6 mb-4">
                <span className="study-group-tag">React 19</span>
                <span className="study-group-tag">Next.js</span>
                <span className="study-group-tag">Animations</span>
              </div>
              <div className="flex justify-end mt-auto">
                <span className="study-group-btn m-0 border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20">Join</span>
              </div>
            </div>
          </article>
        </BorderGlow>
      </div>
    ),
    (
      <div className="study-group-card-wrapper w-full">
        <BorderGlow
          edgeSensitivity={28}
          glowColor="190 80 65"
          backgroundColor="#0a0e1a"
          borderRadius={20}
          glowRadius={24}
          glowIntensity={0.6}
          coneSpread={22}
          animated={false}
          colors={["#06b6d4", "#22d3ee", "#0891b2"]}
          className="study-group-card-glow h-full"
        >
          <article className="study-group-card">
            <div className="study-group-card__info">
              <div className="flex items-center gap-3 mb-4">
                <div className="study-group-card__icon" style={{ "--icon-accent": "#06b6d4" } as React.CSSProperties}>
                  <Code className="h-7 w-7" />
                </div>
                <span className="study-group-status-badge status-filling">
                  Filling
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white/95 leading-snug mb-3">
                DSA Sprint Crew
              </h3>
              <p className="text-base text-white/55 leading-relaxed flex-1">
                Collaborative problem-solving focused on Data Structures and Algorithms. We practice the Feynman technique by explaining our solutions to each other to ensure foundational mastery.
              </p>
              <div className="study-group-meta">
                <span className="study-group-meta__item">
                  <Clock className="h-3.5 w-3.5" />
                  Daily, 7:00 AM
                </span>
                <span className="study-group-meta__item">
                  <User className="h-3.5 w-3.5" />
                  8/10 Enrolled
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-6 mb-4">
                <span className="study-group-tag">Algorithms</span>
                <span className="study-group-tag">LeetCode</span>
                <span className="study-group-tag">Mastery</span>
              </div>
              <div className="flex justify-end mt-auto">
                <span className="study-group-btn m-0 border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20">Join</span>
              </div>
            </div>
          </article>
        </BorderGlow>
      </div>
    ),
    (
      <div className="study-group-card-wrapper w-full">
        <BorderGlow
          edgeSensitivity={28}
          glowColor="140 80 65"
          backgroundColor="#0a0e1a"
          borderRadius={20}
          glowRadius={24}
          glowIntensity={0.6}
          coneSpread={22}
          animated={false}
          colors={["#10b981", "#34d399", "#059669"]}
          className="study-group-card-glow h-full"
        >
          <article className="study-group-card">
            <div className="study-group-card__info">
              <div className="flex items-center gap-3 mb-4">
                <div className="study-group-card__icon" style={{ "--icon-accent": "#10b981" } as React.CSSProperties}>
                  <Database className="h-7 w-7" />
                </div>
                <span className="study-group-status-badge status-active">
                  Active
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white/95 leading-snug mb-3">
                Backend Builders
              </h3>
              <p className="text-base text-white/55 leading-relaxed flex-1">
                Focusing on scalable architecture, databases, and microservices logic. We build robust systems and discuss the trade-offs of different technical stacks in real-world environments.
              </p>
              <div className="study-group-meta">
                <span className="study-group-meta__item">
                  <Clock className="h-3.5 w-3.5" />
                  Thursday, 9:00 PM
                </span>
                <span className="study-group-meta__item">
                  <User className="h-3.5 w-3.5" />
                  15 Members
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-6 mb-4">
                <span className="study-group-tag">Node.js</span>
                <span className="study-group-tag">PostgreSQL</span>
                <span className="study-group-tag">Architecture</span>
              </div>
              <div className="flex justify-end mt-auto">
                <span className="study-group-btn m-0 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">Join</span>
              </div>
            </div>
          </article>
        </BorderGlow>
      </div>
    ),
    (
      <div className="study-group-card-wrapper w-full">
        <BorderGlow
          edgeSensitivity={28}
          glowColor="200 80 65"
          backgroundColor="#0a0e1a"
          borderRadius={20}
          glowRadius={24}
          glowIntensity={0.6}
          coneSpread={22}
          animated={false}
          colors={["#0ea5e9", "#38bdf8", "#0284c7"]}
          className="study-group-card-glow h-full"
        >
          <article className="study-group-card">
            <div className="study-group-card__info">
              <div className="flex items-center gap-3 mb-4">
                <div className="study-group-card__icon" style={{ "--icon-accent": "#0ea5e9" } as React.CSSProperties}>
                  <BookOpen className="h-7 w-7" />
                </div>
                <span className="study-group-status-badge status-active">
                  Active
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white/95 leading-snug mb-3">
                System Design Circle
              </h3>
              <p className="text-base text-white/55 leading-relaxed flex-1">
                A high-level group for discussing scalability, consistency models, and reliability. We analyze distributed systems and prepare for architectural challenges in enterprise settings.
              </p>
              <div className="study-group-meta">
                <span className="study-group-meta__item">
                  <Clock className="h-3.5 w-3.5" />
                  Saturday, 11:00 AM
                </span>
                <span className="study-group-meta__item">
                  <User className="h-3.5 w-3.5" />
                  22 Members
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-6 mb-4">
                <span className="study-group-tag">Distributed Systems</span>
                <span className="study-group-tag">Scale</span>
                <span className="study-group-tag">Enterprise</span>
              </div>
              <div className="flex justify-end mt-auto">
                <span className="study-group-btn m-0 border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20">Join</span>
              </div>
            </div>
          </article>
        </BorderGlow>
      </div>
    ),
  ];

  return (
    <StarfieldBackground className="relative min-h-screen w-full bg-[#06070f] text-white">
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
          <button
            onClick={() => setIsModalOpen(true)}
            className="group"
          >
            <StarBorder as="span" color="purple" speed="5s" thickness={1}>
              <span className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-purple-100 transition-colors duration-200 group-hover:text-white">
                <Plus className="h-4 w-4" />
                <span>Create Group</span>
              </span>
            </StarBorder>
          </button>
          <Link href="/login" className="group">
            <StarBorder as="span" color="cyan" speed="5s" thickness={1}>
              <span className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-cyan-100 transition-colors duration-200 group-hover:text-white">
                Sign In
              </span>
            </StarBorder>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative z-10 flex flex-col items-center text-center pt-32 pb-12 px-4">
        <div className="study-groups-hero-icon mb-6">
          <Users className="h-10 w-10 text-purple-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-linear-to-r from-purple-300 via-white to-pink-300 bg-clip-text text-transparent pb-2">
          Study Groups
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/60 leading-relaxed">
          Learn by doing and teach to master. Join peer-led cohorts focused on collaboration, accountability, and social learning.
        </p>
      </header>

      {/* Cards stack */}
      <section className="relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-8 pb-24">
        <AnimatedList
          items={studyGroupCards}
          displayScrollbar={false}
          showGradients={true}
        />
      </section>

      <StudyGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </StarfieldBackground>
  );
}
