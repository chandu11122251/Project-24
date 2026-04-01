"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import StarfieldBackground from "@/components/background/StarfieldBackground";
import BorderGlow from "@/components/effects/BorderGlow";
import StarBorder from "@/components/effects/StarBorder";

const puzzleTracks = [
  {
    title: "Daily Logic Sprint",
    detail: "10-minute puzzle rounds focused on patterns, arrays, and edge cases.",
  },
  {
    title: "Concept Unlocks",
    detail: "Unlock the next level by posting a clear explanation, not just a solution.",
  },
  {
    title: "Team Puzzle Arena",
    detail: "Solve cooperative puzzles where each teammate gets partial clues.",
  },
];

const challengeMilestones = [
  "7-Day Data Structures Challenge",
  "Weekly debugging relay",
  "Monthly streak leaderboard",
];

const hackathonTracks = [
  "AI Study Companion",
  "Peer Tutoring Matchmaker",
  "Campus Learning Dashboard",
];

const studyGroups = ["Frontend Guild", "DSA Sprint Crew", "Backend Builders", "System Design Circle"];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="space-y-3">
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">{title}</p>
      <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{title}</h2>
      <p className="max-w-2xl text-sm leading-6 text-white/72 md:text-base">{subtitle}</p>
    </header>
  );
}

function PrimaryCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <BorderGlow
      edgeSensitivity={30}
      glowColor="40 80 80"
      backgroundColor="#060010"
      borderRadius={20}
      glowRadius={24}
      glowIntensity={0.7}
      coneSpread={24}
      animated={false}
      colors={["#67e8f9", "#22d3ee", "#06b6d4"]}
      className={className}
    >
      <div className="rounded-2xl bg-white/[0.04] p-4 text-sm text-white/85 transition-colors duration-200 hover:bg-white/[0.07]">
        {children}
      </div>
    </BorderGlow>
  );
}

function AccentCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <BorderGlow
      edgeSensitivity={30}
      glowColor="40 80 80"
      backgroundColor="#060010"
      borderRadius={20}
      glowRadius={24}
      glowIntensity={0.75}
      coneSpread={24}
      animated={false}
      colors={["#67e8f9", "#22d3ee", "#06b6d4"]}
      className={className}
    >
      <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/[0.08] p-4 text-sm leading-6 text-cyan-50/90">
        {children}
      </div>
    </BorderGlow>
  );
}

function FadeInSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -12% 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transform-gpu transition-all duration-500",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export default function MainPage() {
  const [underlineReady, setUnderlineReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setUnderlineReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <StarfieldBackground className="relative min-h-screen w-full overflow-y-auto bg-[#06070f] px-4 py-4 text-white md:px-6 md:py-6">
      <Link
        href="/login"
        className="group fixed right-4 top-4 z-50"
      >
        <StarBorder as="span" color="cyan" speed="5s" thickness={1}>
          <span className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-cyan-100 transition-colors duration-200 group-hover:text-white">
            <span className="group-hover:hidden">Sign In/Sign Up</span>
            <span className="hidden group-hover:inline">→ Sign In/Sign Up</span>
          </span>
        </StarBorder>
      </Link>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 pb-14 md:gap-14">
        <FadeInSection>
          <section
            id="hero"
            className="relative flex min-h-[100svh] scroll-mt-10 flex-col items-center justify-center overflow-hidden px-5 py-8 md:px-10 md:py-12"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(103,232,249,0.04) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative z-10 flex w-full items-center justify-center">
              <h1 className="text-center bg-gradient-to-br from-white via-cyan-200 to-cyan-400 bg-clip-text text-6xl font-black leading-[0.92] tracking-[-0.06em] text-transparent drop-shadow-[0_0_40px_rgba(103,232,249,0.35)] sm:text-7xl md:text-[7.5rem] lg:text-[9rem]">
                Project -24
              </h1>
            </div>
            <div className="relative z-10 mt-6 h-[2px] w-[120px] origin-left rounded-full bg-cyan-300/80 transition-transform duration-[800ms] ease-out" style={{ transform: underlineReady ? "scaleX(1)" : "scaleX(0)" }} />
          </section>
        </FadeInSection>

        <FadeInSection>
          <section
            id="puzzle-games"
            className="scroll-mt-8"
          >
            <BorderGlow
              edgeSensitivity={30}
              glowColor="40 80 80"
              backgroundColor="#060010"
              borderRadius={32}
              glowRadius={30}
              glowIntensity={0.75}
              coneSpread={24}
              animated={false}
              colors={["#67e8f9", "#22d3ee", "#06b6d4"]}
            >
              <div className="rounded-[2rem] bg-black/25 px-5 py-8 backdrop-blur-sm md:px-8 md:py-10">
                <SectionTitle
                  title="Puzzle Games"
                  subtitle="Sharpen speed and clarity with bite-sized collaborative puzzles that open the flow of the page."
                />
                <ul className="mt-8 grid gap-6 md:grid-cols-3 md:gap-7">
                  {puzzleTracks.map((track) => (
                    <li key={track.title} className="cursor-default">
                      <PrimaryCard>
                        <p className="text-lg font-semibold text-white">{track.title}</p>
                        <p className="mt-2 text-sm leading-6 text-white/72">{track.detail}</p>
                      </PrimaryCard>
                    </li>
                  ))}
                </ul>
              </div>
            </BorderGlow>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section
            id="challenges"
            className="scroll-mt-8"
          >
            <BorderGlow
              edgeSensitivity={30}
              glowColor="40 80 80"
              backgroundColor="#060010"
              borderRadius={32}
              glowRadius={30}
              glowIntensity={0.75}
              coneSpread={24}
              animated={false}
              colors={["#67e8f9", "#22d3ee", "#06b6d4"]}
            >
              <div className="rounded-[2rem] bg-black/25 px-5 py-8 backdrop-blur-sm md:px-8 md:py-10">
                <SectionTitle
                  title="Challenges"
                  subtitle="Build consistency through weekly tasks that reward progress and explanation quality."
                />
                <div className="mt-8 grid gap-6 md:grid-cols-[1.4fr_0.6fr] md:gap-7">
                  <ul className="grid gap-5">
                    {challengeMilestones.map((item, index) => (
                      <li key={item} className="cursor-default">
                        {index === 0 ? (
                          <AccentCard>
                            <span className="font-medium text-cyan-50">{item}</span>
                          </AccentCard>
                        ) : (
                          <PrimaryCard>
                            <span>{item}</span>
                          </PrimaryCard>
                        )}
                      </li>
                    ))}
                  </ul>
                  <AccentCard>
                    Next cycle starts every Monday. Keep the momentum going and the page will carry you
                    into the next block.
                  </AccentCard>
                </div>
              </div>
            </BorderGlow>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section
            id="hackathons"
            className="scroll-mt-8"
          >
            <BorderGlow
              edgeSensitivity={30}
              glowColor="40 80 80"
              backgroundColor="#060010"
              borderRadius={32}
              glowRadius={30}
              glowIntensity={0.75}
              coneSpread={24}
              animated={false}
              colors={["#67e8f9", "#22d3ee", "#06b6d4"]}
            >
              <div className="rounded-[2rem] bg-black/25 px-5 py-8 backdrop-blur-sm md:px-8 md:py-10">
                <SectionTitle
                  title="Hackathons"
                  subtitle="Rapid team sprints where learners build practical products with mentor feedback."
                />
                <ol className="mt-8 grid gap-6 md:grid-cols-3 md:gap-7">
                  {hackathonTracks.map((track, index) => (
                    <li key={track} className="cursor-default">
                      <PrimaryCard>
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">0{index + 1}</p>
                        <p className="mt-3 text-lg font-semibold text-white">{track}</p>
                      </PrimaryCard>
                    </li>
                  ))}
                </ol>
              </div>
            </BorderGlow>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section
            id="study-groups"
            className="scroll-mt-8"
          >
            <BorderGlow
              edgeSensitivity={30}
              glowColor="40 80 80"
              backgroundColor="#060010"
              borderRadius={32}
              glowRadius={30}
              glowIntensity={0.75}
              coneSpread={24}
              animated={false}
              colors={["#67e8f9", "#22d3ee", "#06b6d4"]}
            >
              <div className="rounded-[2rem] bg-black/25 px-5 py-8 backdrop-blur-sm md:px-8 md:py-10">
                <SectionTitle
                  title="Study Groups"
                  subtitle="Join focused circles for accountability check-ins and peer-led revision."
                />
                <ul className="mt-8 grid gap-5 md:grid-cols-2 md:gap-6">
                  {studyGroups.map((group) => (
                    <li key={group} className="cursor-default">
                      <PrimaryCard>
                        <span>{group}</span>
                      </PrimaryCard>
                    </li>
                  ))}
                </ul>
              </div>
            </BorderGlow>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section
            id="about"
            className="scroll-mt-8"
          >
            <BorderGlow
              edgeSensitivity={30}
              glowColor="40 80 80"
              backgroundColor="#060010"
              borderRadius={32}
              glowRadius={30}
              glowIntensity={0.75}
              coneSpread={24}
              animated={false}
              colors={["#67e8f9", "#22d3ee", "#06b6d4"]}
            >
              <div className="rounded-[2rem] bg-black/25 px-5 py-8 backdrop-blur-sm md:px-8 md:py-10">
                <SectionTitle
                  title="About Project-24"
                  subtitle="A peer-to-peer learning platform built for students, by students."
                />
                <div className="mt-8 grid gap-7 md:grid-cols-[1fr_1fr] md:gap-9">
                  <p className="max-w-2xl text-sm leading-7 text-white/75 md:text-base">
                    Project-24 exists to make learning feel collaborative instead of isolated. Students can
                    move through practical puzzles, weekly challenges, and team build sessions while sharing
                    what they know with classmates who are on the same journey.
                  </p>
                  <div className="grid grid-cols-2 gap-5 md:gap-6">
                    <PrimaryCard className="cursor-default">
                      <p className="text-xl font-bold text-white">6 Modules</p>
                      <p className="mt-2 text-xs leading-5 text-white/65 md:text-sm">Focused learning paths that keep the journey structured.</p>
                    </PrimaryCard>
                    <PrimaryCard className="cursor-default">
                      <p className="text-xl font-bold text-white">Weekly Challenges</p>
                      <p className="mt-2 text-xs leading-5 text-white/65 md:text-sm">A cadence that keeps students practicing and shipping.</p>
                    </PrimaryCard>
                    <PrimaryCard className="cursor-default">
                      <p className="text-xl font-bold text-white">Open Source</p>
                      <p className="mt-2 text-xs leading-5 text-white/65 md:text-sm">Built with transparent tooling and room to contribute.</p>
                    </PrimaryCard>
                    <PrimaryCard className="cursor-default">
                      <p className="text-xl font-bold text-white">Student-First</p>
                      <p className="mt-2 text-xs leading-5 text-white/65 md:text-sm">Designed around peer learning, not passive consumption.</p>
                    </PrimaryCard>
                  </div>
                </div>
              </div>
            </BorderGlow>
          </section>
        </FadeInSection>

        <footer className="mt-10 w-full px-2 pb-4 text-center text-sm text-zinc-300/80 md:text-base">
          <div className="mb-4 h-px w-full bg-white/20" />
          <p className="backdrop-blur-[2px] text-zinc-300/75">© 2026 Project-24. All rights reserved.</p>
        </footer>
      </main>
    </StarfieldBackground>
  );
}
