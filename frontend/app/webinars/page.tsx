"use client";

import React from "react";
import Link from "next/link";
import StarfieldBackground from "@/components/background/StarfieldBackground";
import BorderGlow from "@/components/effects/BorderGlow";
import StarBorder from "@/components/effects/StarBorder";
import { Video, Code2, Cpu, Sparkles, Clock, Calendar, Users, Plus } from "lucide-react";
import AnimatedList from "@/components/ui/AnimatedList";
import WebinarModal from "@/components/webinars/WebinarModal";
import "./webinars.css";

export default function WebinarsPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const webinarCards = [
    (
      <div className="webinar-card-wrapper w-full">
        <BorderGlow
          edgeSensitivity={28}
          glowColor="250 80 65"
          backgroundColor="#0a0e1a"
          borderRadius={20}
          glowRadius={24}
          glowIntensity={0.6}
          coneSpread={22}
          animated={false}
          colors={["#6366f1", "#818cf8", "#4f46e5"]}
          className="webinar-card-glow h-full"
        >
          <article className="webinar-card">
            <div className="webinar-card__info">
              <div className="flex items-center gap-3 mb-4">
                <div className="webinar-card__icon" style={{ "--icon-accent": "#6366f1" } as React.CSSProperties}>
                  <Code2 className="h-7 w-7" />
                </div>
                <span className="webinar-upcoming-badge">
                  Upcoming
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white/95 leading-snug mb-3">
                Building Full-Stack Apps with Next.js 15
              </h3>
              <p className="text-base text-white/55 leading-relaxed flex-1">
                Learn how to build production-ready full-stack applications using the latest features in Next.js 15 — from Server Components and Server Actions to advanced caching strategies.
              </p>
              <div className="webinar-meta">
                <span className="webinar-meta__item">
                  <Calendar className="h-3.5 w-3.5" />
                  Apr 20, 2026
                </span>
                <span className="webinar-meta__item">
                  <Clock className="h-3.5 w-3.5" />
                  7:00 PM IST
                </span>
                <span className="webinar-meta__item">
                  <Users className="h-3.5 w-3.5" />
                  120 registered
                </span>
              </div>
              <div className="webinar-speaker">
                <div className="webinar-speaker__avatar">AK</div>
                <div className="webinar-speaker__info">
                  <span className="webinar-speaker__name">Aditya Kumar</span>
                  <span className="webinar-speaker__role">Senior Frontend Engineer</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-6 mb-4">
                <span className="webinar-tag">Next.js</span>
                <span className="webinar-tag">React</span>
                <span className="webinar-tag">Full-Stack</span>
              </div>
              <div className="flex justify-end mt-auto">
                <span className="webinar-btn m-0 border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20">Register Now</span>
              </div>
            </div>
          </article>
        </BorderGlow>
      </div>
    ),
    (
      <div className="webinar-card-wrapper w-full">
        <BorderGlow
          edgeSensitivity={28}
          glowColor="160 80 65"
          backgroundColor="#0a0e1a"
          borderRadius={20}
          glowRadius={24}
          glowIntensity={0.6}
          coneSpread={22}
          animated={false}
          colors={["#10b981", "#34d399", "#059669"]}
          className="webinar-card-glow h-full"
        >
          <article className="webinar-card">
            <div className="webinar-card__info">
              <div className="flex items-center gap-3 mb-4">
                <div className="webinar-card__icon" style={{ "--icon-accent": "#10b981" } as React.CSSProperties}>
                  <Cpu className="h-7 w-7" />
                </div>
                <span className="webinar-live-badge">
                  <span className="webinar-live-dot" />
                  Live
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white/95 leading-snug mb-3">
                Introduction to Machine Learning with Python
              </h3>
              <p className="text-base text-white/55 leading-relaxed flex-1">
                A beginner-friendly session covering the fundamentals of machine learning — from data preprocessing and feature engineering to building your first models with scikit-learn.
              </p>
              <div className="webinar-meta">
                <span className="webinar-meta__item">
                  <Calendar className="h-3.5 w-3.5" />
                  Apr 12, 2026
                </span>
                <span className="webinar-meta__item">
                  <Clock className="h-3.5 w-3.5" />
                  Live Now
                </span>
                <span className="webinar-meta__item">
                  <Users className="h-3.5 w-3.5" />
                  85 watching
                </span>
              </div>
              <div className="webinar-speaker">
                <div className="webinar-speaker__avatar">RP</div>
                <div className="webinar-speaker__info">
                  <span className="webinar-speaker__name">Riya Patel</span>
                  <span className="webinar-speaker__role">ML Research Engineer</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-6 mb-4">
                <span className="webinar-tag">Python</span>
                <span className="webinar-tag">Machine Learning</span>
                <span className="webinar-tag">Beginner</span>
              </div>
              <div className="flex justify-end mt-auto">
                <span className="webinar-btn m-0 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">Join Live</span>
              </div>
            </div>
          </article>
        </BorderGlow>
      </div>
    ),
    (
      <div className="webinar-card-wrapper w-full">
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
          className="webinar-card-glow h-full"
        >
          <article className="webinar-card">
            <div className="webinar-card__info">
              <div className="flex items-center gap-3 mb-4">
                <div className="webinar-card__icon" style={{ "--icon-accent": "#0ea5e9" } as React.CSSProperties}>
                  <Sparkles className="h-7 w-7" />
                </div>
                <span className="webinar-recorded-badge">
                  Recorded
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white/95 leading-snug mb-3">
                Mastering TypeScript — Advanced Patterns
              </h3>
              <p className="text-base text-white/55 leading-relaxed flex-1">
                Deep dive into advanced TypeScript patterns including conditional types, mapped types, template literal types, and how to build type-safe libraries that scale.
              </p>
              <div className="webinar-meta">
                <span className="webinar-meta__item">
                  <Calendar className="h-3.5 w-3.5" />
                  Mar 28, 2026
                </span>
                <span className="webinar-meta__item">
                  <Clock className="h-3.5 w-3.5" />
                  1h 42m
                </span>
                <span className="webinar-meta__item">
                  <Users className="h-3.5 w-3.5" />
                  340 views
                </span>
              </div>
              <div className="webinar-speaker">
                <div className="webinar-speaker__avatar">SM</div>
                <div className="webinar-speaker__info">
                  <span className="webinar-speaker__name">Sheik Moinuddin</span>
                  <span className="webinar-speaker__role">Full-Stack Developer</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-6 mb-4">
                <span className="webinar-tag">TypeScript</span>
                <span className="webinar-tag">Advanced</span>
                <span className="webinar-tag">Patterns</span>
              </div>
              <div className="flex justify-end mt-auto">
                <span className="webinar-btn m-0 border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20">Watch Recording</span>
              </div>
            </div>
          </article>
        </BorderGlow>
      </div>
    ),
    (
      <div className="webinar-card-wrapper w-full">
        <BorderGlow
          edgeSensitivity={28}
          glowColor="340 80 65"
          backgroundColor="#0a0e1a"
          borderRadius={20}
          glowRadius={24}
          glowIntensity={0.6}
          coneSpread={22}
          animated={false}
          colors={["#f43f5e", "#fb7185", "#e11d48"]}
          className="webinar-card-glow h-full"
        >
          <article className="webinar-card">
            <div className="webinar-card__info">
              <div className="flex items-center gap-3 mb-4">
                <div className="webinar-card__icon" style={{ "--icon-accent": "#f43f5e" } as React.CSSProperties}>
                  <Video className="h-7 w-7" />
                </div>
                <span className="webinar-recorded-badge">
                  Recorded
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white/95 leading-snug mb-3">
                System Design for Web Applications
              </h3>
              <p className="text-base text-white/55 leading-relaxed flex-1">
                Learn how to design scalable web architectures — load balancing, caching layers, database sharding, microservices communication, and handling millions of concurrent users.
              </p>
              <div className="webinar-meta">
                <span className="webinar-meta__item">
                  <Calendar className="h-3.5 w-3.5" />
                  Mar 15, 2026
                </span>
                <span className="webinar-meta__item">
                  <Clock className="h-3.5 w-3.5" />
                  2h 10m
                </span>
                <span className="webinar-meta__item">
                  <Users className="h-3.5 w-3.5" />
                  510 views
                </span>
              </div>
              <div className="webinar-speaker">
                <div className="webinar-speaker__avatar">VR</div>
                <div className="webinar-speaker__info">
                  <span className="webinar-speaker__name">Vikram Rao</span>
                  <span className="webinar-speaker__role">Principal Architect</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-6 mb-4">
                <span className="webinar-tag">System Design</span>
                <span className="webinar-tag">Architecture</span>
                <span className="webinar-tag">Scalability</span>
              </div>
              <div className="flex justify-end mt-auto">
                <span className="webinar-btn m-0 border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20">Watch Recording</span>
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
            <StarBorder as="span" color="indigo" speed="5s" thickness={1}>
              <span className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-indigo-100 transition-colors duration-200 group-hover:text-white">
                <Plus className="h-4 w-4" />
                <span>Host/Schedule</span>
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
        <div className="webinars-hero-icon mb-6">
          <Video className="h-10 w-10 text-indigo-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-linear-to-r from-indigo-300 via-white to-sky-300 bg-clip-text text-transparent pb-2">
          Webinars
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/60 leading-relaxed">
          Join live sessions or watch recordings from industry experts. Stay ahead with deep dives into modern technologies, best practices, and hands-on workshops.
        </p>
      </header>

      {/* Cards stack */}
      <section className="relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-8 pb-24">
        <AnimatedList
          items={webinarCards}
          displayScrollbar={false}
          showGradients={true}
        />
      </section>

      <WebinarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </StarfieldBackground>
  );
}
