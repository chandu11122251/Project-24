"use client";

import { PropsWithChildren, useEffect, useRef } from "react";

type RippleGridBackgroundProps = PropsWithChildren<{
  className?: string;
}>;

export default function RippleGridBackground({
  children,
  className,
}: RippleGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Ripple = {
      x: number;
      y: number;
      startTime: number;
      strength: number;
    };

    let width = 0;
    let height = 0;
    let dpr = 1;
    const gridSpacing = 48;
    const waveSpeed = 0.22;
    const waveBand = 90;
    const maxAge = 4600;
    let ripples: Ripple[] = [];
    let rafId = 0;
    let lastAutoSpawn = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawnRipple = (
      x: number,
      y: number,
      strength: number,
      startTime: number,
    ) => {
      ripples.push({ x, y, strength, startTime });
      if (ripples.length > 10) {
        ripples = ripples.slice(-10);
      }
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      if (time - lastAutoSpawn > 1400) {
        spawnRipple(
          Math.random() * width,
          Math.random() * height,
          7 + Math.random() * 3,
          time,
        );
        lastAutoSpawn = time;
      }

      ripples = ripples.filter((ripple) => time - ripple.startTime < maxAge);

      const cols = Math.ceil(width / gridSpacing) + 3;
      const rows = Math.ceil(height / gridSpacing) + 3;
      const points: Array<{ x: number; y: number }> = new Array(cols * rows);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const baseX = (col - 1) * gridSpacing;
          const baseY = (row - 1) * gridSpacing;
          let offsetX = 0;
          let offsetY = 0;

          for (const ripple of ripples) {
            const age = time - ripple.startTime;
            const radius = age * waveSpeed;
            const dx = baseX - ripple.x;
            const dy = baseY - ripple.y;
            const distance = Math.hypot(dx, dy) || 0.0001;
            const front = distance - radius;
            const envelope = Math.exp(-(front * front) / (2 * waveBand * waveBand));
            const oscillation = Math.sin(front * 0.085) * envelope * ripple.strength;
            const fade = 1 - age / maxAge;
            const influence = oscillation * Math.max(fade, 0);
            offsetX += (dx / distance) * influence;
            offsetY += (dy / distance) * influence;
          }

          points[row * cols + col] = {
            x: baseX + offsetX,
            y: baseY + offsetY,
          };
        }
      }

      ctx.lineWidth = 1;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const current = points[row * cols + col];

          if (col + 1 < cols) {
            const right = points[row * cols + col + 1];
            ctx.beginPath();
            ctx.strokeStyle = "rgba(70, 195, 255, 0.16)";
            ctx.moveTo(current.x, current.y);
            ctx.lineTo(right.x, right.y);
            ctx.stroke();
          }

          if (row + 1 < rows) {
            const down = points[(row + 1) * cols + col];
            ctx.beginPath();
            ctx.strokeStyle = "rgba(70, 195, 255, 0.12)";
            ctx.moveTo(current.x, current.y);
            ctx.lineTo(down.x, down.y);
            ctx.stroke();
          }

          ctx.beginPath();
          ctx.fillStyle = "rgba(122, 228, 255, 0.35)";
          ctx.arc(current.x, current.y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafId = window.requestAnimationFrame(draw);
    };

    const handlePointerDown = (event: PointerEvent) => {
      spawnRipple(event.clientX, event.clientY, 10, performance.now());
    };

    const handleResize = () => {
      resize();
    };

    resize();
    rafId = window.requestAnimationFrame(draw);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  const rootClassName = className ?? "relative w-full min-h-screen overflow-hidden bg-[#06070f]";

  return (
    <div className={rootClassName}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.18),transparent_38%),radial-gradient(circle_at_80%_80%,rgba(45,212,191,0.1),transparent_34%)]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
