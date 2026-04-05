"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BookOpen, Code2, Puzzle, Users, Video, Zap } from "lucide-react";
import StarfieldBackground from "@/components/background/StarfieldBackground";
import ModelWrappedTextCard from "@/components/sections/ModelWrappedTextCard";
import BorderGlow from "@/components/effects/BorderGlow";
import StarBorder from "@/components/effects/StarBorder";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
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
  const [activateModelAnimation, setActivateModelAnimation] = useState(false);
  const [modelOverlayWidth, setModelOverlayWidth] = useState(0);
  const [modelOverlayHeight, setModelOverlayHeight] = useState(0);
  const cssBoxRef = useRef<HTMLDivElement>(null);
  const sectionDescriptions = [
    {
      id: "puzzle-games",
      title: "Puzzle Games",
      Icon: Puzzle,
      lines: [
        "Solve bite-sized logic and algorithm puzzles designed for fast, focused practice that fits naturally into your daily schedule.",
        "Collaborate in timed team rounds where every member contributes hints, reasoning paths, and final solution strategies.",
        "Improve pattern recognition, communication clarity, and decision speed by revisiting concepts from multiple difficulty levels.",
        "Track streaks, leaderboard progress, and concept mastery with each completed sprint, then use feedback to improve your next run.",
        "Build confidence by moving from short warm-up puzzles to deeper challenge sets that mirror real interview and coding scenarios.",
      ],
    },
    {
      id: "challenges",
      title: "Challenges",
      Icon: Zap,
      lines: [
        "Take on weekly coding and problem-solving tasks with practical outcomes that strengthen both understanding and execution.",
        "Submit your approach, receive detailed peer and mentor feedback, and refine how you structure, explain, and optimize your code.",
        "Focus on consistency, clean thinking, and practical debugging under realistic constraints like time, readability, and edge cases.",
        "Build momentum through structured milestones that reward progress over perfection and encourage long-term learning habits.",
        "Use challenge reflections to identify weak areas early and convert them into focused practice goals for the following week.",
      ],
    },
    {
      id: "hackathons",
      title: "Hackathons",
      Icon: Code2,
      lines: [
        "Join rapid build sprints where teams turn ideas into working prototypes that solve meaningful student and community problems.",
        "Work with mentors to define clear scope, split responsibilities effectively, and ship faster without sacrificing core quality.",
        "Practice pitching, iterative building, and product thinking while strengthening technical execution in a high-energy environment.",
        "Collaborate across design, frontend, backend, and strategy so every participant learns beyond a single specialized role.",
        "End each sprint with demos, feedback loops, and clear next steps that help projects move from prototype to polished product.",
      ],
    },
    {
      id: "webinars",
      title: "Webinars",
      Icon: Video,
      lines: [
        "Attend live sessions with mentors, seniors, and industry professionals who share practical lessons from real projects.",
        "Learn across engineering, productivity, communication, and career growth through focused talks with clear examples.",
        "Take part in interactive Q and A discussions to clarify difficult concepts and understand how experts approach trade-offs.",
        "Review case studies, workflows, and frameworks that can be directly applied to coursework, side projects, and internships.",
        "Leave each webinar with actionable next steps you can implement immediately in your preparation and daily learning routine.",
      ],
    },
    {
      id: "study-groups",
      title: "Study Groups",
      Icon: Users,
      lines: [
        "Join focused peer circles organized around shared goals, target skills, and structured learning tracks.",
        "Plan weekly revision sessions, accountability check-ins, and doubt-clearing rounds that keep everyone aligned.",
        "Strengthen understanding by teaching concepts, reviewing each others solutions, and discussing alternate approaches.",
        "Build discipline with small weekly commitments that make consistent progress easier and less overwhelming.",
        "Create a dependable support system where members celebrate wins, solve blockers together, and stay motivated long-term.",
      ],
    },
    {
      id: "about-us",
      title: "About Us",
      Icon: BookOpen,
      lines: [
        "Project-24 is a learner-first community where students grow through practice, collaboration, and meaningful contribution.",
        "Our model blends puzzle solving, challenges, hackathons, webinars, and study groups into one connected growth journey.",
        "We value clarity, consistency, communication, and teamwork more than one-time performance or isolated results.",
        "Every section is designed to convert passive study into active, real-world progress through repeatable learning loops.",
        "The goal is simple: help learners become confident builders who can think clearly, explain well, and support others.",
      ],
    },
  ];

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setUnderlineReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const box = cssBoxRef.current;
    if (!box) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActivateModelAnimation(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const box = cssBoxRef.current;
    if (!box) return;

    const syncOverlayHeight = () => {
      setModelOverlayWidth(box.getBoundingClientRect().width);
      setModelOverlayHeight(box.offsetHeight);
    };

    syncOverlayHeight();
    const resizeObserver = new ResizeObserver(() => syncOverlayHeight());
    resizeObserver.observe(box);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <StarfieldBackground className="relative min-h-screen w-full overflow-x-hidden overflow-y-auto bg-[#06070f] px-4 py-4 text-white md:px-6 md:py-6">
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

      <main className="relative z-10 mx-auto flex w-full max-w-none flex-col gap-10 pb-14 md:gap-14">
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

        <FadeInSection className="flex justify-center px-2">
          <div className="relative inline-block">
            <div
              className="pointer-events-none absolute -left-14 -top-28 z-30"
              style={{
                width: modelOverlayWidth > 0 ? `${modelOverlayWidth + 56}px` : undefined,
                height: modelOverlayHeight > 0 ? `${modelOverlayHeight + 112}px` : undefined,
              }}
            >
              <ModelWrappedTextCard targetRef={cssBoxRef} animateOnView={activateModelAnimation} />
            </div>

            <BorderGlow
              edgeSensitivity={30}
              glowColor="40 80 80"
              backgroundColor="#060010"
              borderRadius={26}
              glowRadius={30}
              glowIntensity={0.75}
              coneSpread={24}
              animated={false}
              colors={["#67e8f9", "#22d3ee", "#06b6d4"]}
            >
              <div
                ref={cssBoxRef}
                className="min-h-[1520px] overflow-visible rounded-[1.6rem] bg-black/20 backdrop-blur-sm"
                style={{
                  width: "min(calc(100vw - 12rem), 1000px)",
                  marginLeft: "4rem",
                  marginRight: "2rem",
                }}
              >
                <div className="relative z-10 h-full w-full px-8 py-4 md:px-12 md:py-6">
                  <div className="mx-auto h-full w-full max-w-4xl">
                    <div className="space-y-8 md:space-y-10">
                      {sectionDescriptions.map((section, index) => (
                        <section key={section.id} id={section.id} className="section-block scroll-mt-24">
                          <h3 className="flex items-center gap-2.5 text-xl font-semibold text-cyan-100 md:text-2xl">
                            <section.Icon className="h-5 w-5 text-cyan-300 md:h-6 md:w-6" />
                            <span>{section.title}</span>
                          </h3>
                          <p
                            aria-hidden="true"
                            className="mt-4 select-none text-sm leading-7 text-transparent opacity-0 md:text-base md:leading-8"
                          >
                            {section.lines.join(" ")}
                          </p>
                          {index < sectionDescriptions.length - 1 ? (
                            <div className="mt-6 h-px w-full bg-cyan-100/20" aria-hidden="true" />
                          ) : null}
                        </section>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </BorderGlow>
          </div>
        </FadeInSection>

        <footer className="mt-10 w-full px-2 pb-4 text-center text-sm text-zinc-300/80 md:text-base">
          <div className="mb-4 h-px w-full bg-white/20" />
          <p className="backdrop-blur-[2px] text-zinc-300/75">© 2026 Project-24. All rights reserved.</p>
        </footer>
      </main>
    </StarfieldBackground>
  );
}
