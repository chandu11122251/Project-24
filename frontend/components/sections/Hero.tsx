"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
};

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    const reset = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * window.devicePixelRatio);
      canvas.height = Math.floor(height * window.devicePixelRatio);
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

      const count = Math.max(36, Math.floor((width * height) / 42000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.2 + 0.8,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "rgba(10, 15, 35, 0.8)");
      gradient.addColorStop(1, "rgba(4, 24, 36, 0.8)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -6) p.x = width + 6;
        if (p.x > width + 6) p.x = -6;
        if (p.y < -6) p.y = height + 6;
        if (p.y > height + 6) p.y = -6;

        ctx.beginPath();
        ctx.fillStyle = "rgba(34, 211, 238, 0.65)";
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    reset();
    draw();

    const onResize = () => reset();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section id="hero" className="relative flex min-h-screen flex-col justify-center overflow-hidden px-8 md:px-16">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(34,211,238,0.15),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.2),transparent_42%)]" />

      <div className="relative z-10 max-w-4xl space-y-6">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-200/80">Peer-to-peer learning platform</p>
        <h1 className="text-5xl font-bold leading-tight md:text-7xl">Project-24</h1>
        <p className="max-w-2xl text-lg text-white/80 md:text-xl">
          A collaborative platform where learners teach learners through puzzles, challenges, live sessions, and community-driven milestones.
        </p>
        <p className="max-w-2xl text-white/65">
          Our mission is to turn passive studying into an active learning journey through accountability, mentorship, and practical problem-solving.
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a
            href="#puzzle-games"
            className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-gray-950 transition hover:bg-cyan-300"
          >
            Explore
          </a>
          <Link
            href="/login"
            className="rounded-full border border-white/25 bg-black/30 px-6 py-3 text-sm font-semibold transition hover:border-cyan-300/50 hover:bg-cyan-400/10"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </section>
  );
}
