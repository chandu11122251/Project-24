"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import StarfieldBackground from "@/components/background/StarfieldBackground";
import StarBorder from "@/components/effects/StarBorder";

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
      className={`transform-gpu transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className || ""}`}
    >
      {children}
    </div>
  );
}

export default function MainPage() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    // Editorial Engine Implementation
    const BODY_FONT = '18px "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, serif';
    const BODY_LINE_HEIGHT = 30;
    const HEADLINE_FONT_FAMILY = '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, serif';
    const HEADLINE_TEXT = "THE FUTURE OF TEXT LAYOUT IS NOT CSS";
    const GUTTER = 48;
    const COL_GAP = 40;
    const BOTTOM_GAP = 20;
    const DROP_CAP_LINES = 3;
    const MIN_SLOT_WIDTH = 50;
    const NARROW_BREAKPOINT = 760;
    const NARROW_GUTTER = 20;
    const NARROW_COL_GAP = 20;
    const NARROW_BOTTOM_GAP = 16;
    const NARROW_ORB_SCALE = 0.58;
    const NARROW_ACTIVE_ORBS = 3;

    const BODY_TEXT = `The web renders text through a pipeline that was designed thirty years ago for static documents. A browser loads a font, shapes the text into glyphs, measures their combined width, determines where lines break, and positions each line vertically.

Welcome to Project-24, a learner-first community where students grow through practice, collaboration, and meaningful contribution. Our model blends puzzle solving, challenges, hackathons, webinars, and study groups into one connected growth journey.

We value clarity, consistency, communication, and teamwork more than one-time performance or isolated results. Every section is designed to convert passive study into active, real-world progress through repeatable learning loops.

The goal is simple: help learners become confident builders who can think clearly, explain well, and support others. This platform provides structured yet flexible pathways for learning, from beginner-friendly puzzles to advanced technical challenges.

Join us and become part of a community that celebrates learning, supports growth, and builds the next generation of thoughtful engineers and leaders.`;

    const orbDefs = [
      { fx: 0.52, fy: 0.22, r: 80, vx: 24, vy: 16, color: [196, 163, 90] },
      { fx: 0.18, fy: 0.48, r: 65, vx: -19, vy: 26, color: [100, 140, 255] },
      { fx: 0.74, fy: 0.58, r: 75, vx: 16, vy: -21, color: [232, 100, 130] },
    ];

    const createOrbEl = (color: number[]) => {
      const element = document.createElement("div");
      element.className = "orb";
      element.style.position = "absolute";
      element.style.borderRadius = "50%";
      element.style.pointerEvents = "none";
      element.style.zIndex = "10";
      element.style.willChange = "transform";
      element.style.background = `radial-gradient(circle at 35% 35%, rgba(${color[0]},${color[1]},${color[2]},0.35), rgba(${color[0]},${color[1]},${color[2]},0.12) 55%, transparent 72%)`;
      element.style.boxShadow = `0 0 60px 15px rgba(${color[0]},${color[1]},${color[2]},0.18), 0 0 120px 40px rgba(${color[0]},${color[1]},${color[2]},0.07)`;
      stage.appendChild(element);
      return element;
    };

    const W0 = window.innerWidth;
    const H0 = window.innerHeight;

    const linePool: HTMLElement[] = [];
    const domCache = {
      stage,
      bodyLines: linePool,
      orbs: orbDefs.map((definition) => createOrbEl(definition.color))
    };

    const st = {
      orbs: orbDefs.map((definition) => ({
        x: definition.fx * W0,
        y: definition.fy * H0,
        r: definition.r,
        vx: definition.vx,
        vy: definition.vy,
        paused: false
      })),
      pointer: { x: -9999, y: -9999 },
      drag: null as any,
      lastFrameTime: null as number | null
    };

    const syncPool = (pool: HTMLElement[], count: number, create: () => HTMLElement) => {
      while (pool.length < count) {
        const element = create();
        stage.appendChild(element);
        pool.push(element);
      }
      for (let index = 0; index < pool.length; index++) {
        pool[index].style.display = index < count ? "" : "none";
      }
    };

    let scheduledRaf: number | null = null;

    const scheduleRender = () => {
      if (scheduledRaf !== null) return;
      scheduledRaf = requestAnimationFrame((now) => {
        scheduledRaf = null;
        if (render(now)) scheduleRender();
      });
    };

    const hitTestOrbs = (orbs: any[], px: number, py: number, activeCount: number, radiusScale: number) => {
      for (let index = activeCount - 1; index >= 0; index--) {
        const orb = orbs[index];
        const radius = orb.r * radiusScale;
        const dx = px - orb.x;
        const dy = py - orb.y;
        if (dx * dx + dy * dy <= radius * radius) return index;
      }
      return -1;
    };

    const pointerSampleFromEvent = (event: PointerEvent) => ({
      x: event.clientX,
      y: event.clientY,
    });

    stage.addEventListener("pointermove", (event) => {
      st.pointer = pointerSampleFromEvent(event as PointerEvent);
      scheduleRender();
    });

    stage.addEventListener("pointerdown", (event) => {
      const pageWidth = document.documentElement.clientWidth;
      const isNarrow = pageWidth < NARROW_BREAKPOINT;
      const orbRadiusScale = isNarrow ? NARROW_ORB_SCALE : 1;
      const activeOrbCount = isNarrow ? Math.min(NARROW_ACTIVE_ORBS, st.orbs.length) : st.orbs.length;
      const hitOrbIndex = hitTestOrbs(st.orbs, event.clientX, event.clientY, activeOrbCount, orbRadiusScale);
      if (hitOrbIndex !== -1) {
        st.drag = {
          orbIndex: hitOrbIndex,
          startPointerX: event.clientX,
          startPointerY: event.clientY,
          startOrbX: st.orbs[hitOrbIndex].x,
          startOrbY: st.orbs[hitOrbIndex].y,
        };
        scheduleRender();
      }
    });

    stage.addEventListener("pointerup", (event) => {
      if (st.drag !== null) {
        const dx = event.clientX - st.drag.startPointerX;
        const dy = event.clientY - st.drag.startPointerY;
        const orb = st.orbs[st.drag.orbIndex];
        if (dx * dx + dy * dy < 16) {
          orb.paused = !orb.paused;
        }
        st.drag = null;
        scheduleRender();
      }
    });

    window.addEventListener("resize", () => scheduleRender());

    const render = (now: number) => {
      const pageWidth = document.documentElement.clientWidth;
      const pageHeight = document.documentElement.clientHeight;
      const isNarrow = pageWidth < NARROW_BREAKPOINT;
      const orbRadiusScale = isNarrow ? NARROW_ORB_SCALE : 1;
      const activeOrbCount = isNarrow ? Math.min(NARROW_ACTIVE_ORBS, st.orbs.length) : st.orbs.length;
      const orbs = st.orbs;

      const lastFrameTime = st.lastFrameTime ?? now;
      const dt = Math.min((now - lastFrameTime) / 1000, 0.05);
      let stillAnimating = false;

      for (let index = 0; index < orbs.length; index++) {
        if (index >= activeOrbCount) continue;
        const orb = orbs[index];
        const radius = orb.r * orbRadiusScale;
        if (orb.paused || (st.drag && st.drag.orbIndex === index)) continue;
        stillAnimating = true;
        orb.x += orb.vx * dt;
        orb.y += orb.vy * dt;
        if (orb.x - radius < 0) {
          orb.x = radius;
          orb.vx = Math.abs(orb.vx);
        }
        if (orb.x + radius > pageWidth) {
          orb.x = pageWidth - radius;
          orb.vx = -Math.abs(orb.vx);
        }
        if (orb.y - radius < (isNarrow ? NARROW_GUTTER : GUTTER) * 0.5) {
          orb.y = radius + (isNarrow ? NARROW_GUTTER : GUTTER) * 0.5;
          orb.vy = Math.abs(orb.vy);
        }
        if (orb.y + radius > pageHeight - (isNarrow ? NARROW_BOTTOM_GAP : BOTTOM_GAP)) {
          orb.y = pageHeight - (isNarrow ? NARROW_BOTTOM_GAP : BOTTOM_GAP) - radius;
          orb.vy = -Math.abs(orb.vy);
        }
      }

      for (let index = 0; index < activeOrbCount; index++) {
        const a = orbs[index];
        const aRadius = a.r * orbRadiusScale;
        for (let otherIndex = index + 1; otherIndex < activeOrbCount; otherIndex++) {
          const b = orbs[otherIndex];
          const bRadius = b.r * orbRadiusScale;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = aRadius + bRadius + (isNarrow ? 12 : 20);
          if (dist >= minDist || dist <= 0.1) continue;
          const force = (minDist - dist) * 0.8;
          const nx = dx / dist;
          const ny = dy / dist;
          if (!a.paused && (!st.drag || st.drag.orbIndex !== index)) {
            a.vx -= nx * force * dt;
            a.vy -= ny * force * dt;
          }
          if (!b.paused && (!st.drag || st.drag.orbIndex !== otherIndex)) {
            b.vx += nx * force * dt;
            b.vy += ny * force * dt;
          }
        }
      }

      syncPool(domCache.bodyLines, 0, () => {
        const element = document.createElement("span");
        element.className = "line";
        element.style.position = "absolute";
        element.style.whiteSpace = "pre";
        element.style.zIndex = "1";
        element.style.color = "#e8e4dc";
        element.style.userSelect = "text";
        return element;
      });

      for (let index = 0; index < orbs.length; index++) {
        const orb = orbs[index];
        const element = domCache.orbs[index];
        if (index >= activeOrbCount) {
          element.style.display = "none";
          continue;
        }
        const radius = orb.r * orbRadiusScale;
        element.style.display = "";
        element.style.left = `${orb.x - radius}px`;
        element.style.top = `${orb.y - radius}px`;
        element.style.width = `${radius * 2}px`;
        element.style.height = `${radius * 2}px`;
        element.style.opacity = orb.paused ? "0.45" : "1";
      }

      st.lastFrameTime = stillAnimating ? now : null;
      return stillAnimating;
    };

    scheduleRender();

    return () => {
      if (scheduledRaf !== null) {
        cancelAnimationFrame(scheduledRaf);
      }
    };
  }, []);

  return (
    <StarfieldBackground className="relative min-h-screen w-full overflow-hidden bg-[#06070f] text-white">
      <Link href="/login" className="group fixed right-4 top-4 z-50">
        <StarBorder as="span" color="cyan" speed="5s" thickness={1}>
          <span className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-cyan-100 transition-colors duration-200 group-hover:text-white">
            <span className="group-hover:hidden">Sign In/Sign Up</span>
            <span className="hidden group-hover:inline">→ Sign In/Sign Up</span>
          </span>
        </StarBorder>
      </Link>

      <div
        ref={stageRef}
        id="stage"
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: "radial-gradient(ellipse at 50% 40%, #0f0f14 0%, #0a0a0c 100%)",
        }}
      >
        <div
          style={{
            position: "fixed",
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            font: '400 13px/1 "Helvetica Neue", Helvetica, Arial, sans-serif',
            color: "rgba(255,255,255,0.22)",
            zIndex: 100,
            background: "rgba(0,0,0,0.45)",
            padding: "8px 18px",
            borderRadius: "999px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          Drag the orbs · Click to pause · Zero DOM reads
        </div>
      </div>
    </StarfieldBackground>
  );
}
