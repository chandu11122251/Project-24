"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import Link from "next/link";

export default function LoginPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let stars: Array<{
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      bright: number;
      phase: number;
      color: number[];
    }> = [];
    const mouse = { x: 0, y: 0 };
    const STAR_COUNT = 90;
    const CONN_DIST = 140;
    const ACCENT = [91, 110, 245];
    const TEAL = [0, 229, 195];
    let animationFrameId: number;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const initStars = () => {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.6 + 0.4,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          bright: Math.random(),
          phase: Math.random() * Math.PI * 2,
          color: Math.random() > 0.5 ? ACCENT : TEAL,
        });
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // Update + draw connections
      for (let i = 0; i < stars.length; i++) {
        const a = stars[i];
        for (let j = i + 1; j < stars.length; j++) {
          const b = stars[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONN_DIST) {
            const alpha = (1 - dist / CONN_DIST) * 0.25;
            const c = a.color;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Mouse connections
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const dx = s.x - mouse.x,
          dy = s.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const alpha = (1 - dist / 180) * 0.55;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,229,195,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // Draw stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const twinkle = 0.5 + 0.5 * Math.sin(t * 0.001 + s.phase);
        const alpha = 0.4 + 0.5 * twinkle;
        const [r, g, b] = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();

        // Glow halo
        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
        grd.addColorStop(0, `rgba(${r},${g},${b},${0.15 * twinkle})`);
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Move
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < -10) s.x = w + 10;
        if (s.x > w + 10) s.x = -10;
        if (s.y < -10) s.y = h + 10;
        if (s.y > h + 10) s.y = -10;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      resize();
      initStars();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    resize();
    initStars();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    console.log("Login attempted with:", email, password);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#06070f] flex items-center justify-center p-8 overflow-hidden">
      {/* Starfield Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Main Content Overlay */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-md gap-8 text-center text-white backdrop-blur-md bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl">
        <div className="space-y-4 w-full">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white/90 drop-shadow-sm">
            Welcome Back
          </h1>
          <p className="text-sm md:text-base text-zinc-300">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-4 text-left">
          <div className="space-y-2">
            <label className="text-sm text-zinc-300 ml-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all font-medium"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-300 ml-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-lg bg-teal-500/80 hover:bg-teal-400 text-white font-semibold shadow-[0_0_15px_rgba(0,229,195,0.4)] hover:shadow-[0_0_25px_rgba(0,229,195,0.6)] transition-all"
          >
            Sign In
          </button>
        </form>

        <div className="flex items-center gap-4 mt-4 w-full justify-between text-sm">
          <Link
            href="/main"
            className="text-white/60 hover:text-white transition-colors"
          >
            ← Back
          </Link>
          <a
            href="#"
            className="text-teal-400 hover:text-teal-300 transition-colors"
          >
            Forgot password?
          </a>
        </div>
      </main>
    </div>
  );
}
