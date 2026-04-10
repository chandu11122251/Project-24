"use client";

import { useEffect, useRef } from "react";

type Spark = {
  x: number;
  y: number;
  angle: number;
  speed: number;
  life: number;
  maxLife: number;
};

type ClickSparkProps = {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: "linear" | "ease-out" | "ease-in" | "ease-in-out";
  extraScale?: number;
};

const easingMap: Record<NonNullable<ClickSparkProps["easing"]>, (t: number) => number> = {
  linear: (t) => t,
  "ease-out": (t) => 1 - (1 - t) * (1 - t),
  "ease-in": (t) => t * t,
  "ease-in-out": (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
};

export default function ClickSpark({
  sparkColor = "#ffffff",
  sparkSize = 13,
  sparkRadius = 27,
  sparkCount = 9,
  duration = 400,
  easing = "ease-out",
  extraScale = 1,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawnSparks = (x: number, y: number) => {
      const created: Spark[] = [];
      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + Math.random() * 0.28;
        const speed = sparkRadius * (0.75 + Math.random() * 0.55);
        created.push({
          x,
          y,
          angle,
          speed,
          life: 0,
          maxLife: duration,
        });
      }
      sparksRef.current.push(...created);
    };

    const drawSpark = (spark: Spark) => {
      const t = Math.min(1, spark.life / spark.maxLife);
      const easingFn = easingMap[easing] ?? easingMap["ease-out"];
      const eased = easingFn(t);
      const distance = spark.speed * eased;
      const cx = spark.x + Math.cos(spark.angle) * distance;
      const cy = spark.y + Math.sin(spark.angle) * distance;
      const alpha = 1 - t;
      const lineLength = Math.max(2, sparkSize * (1 - t * 0.45));
      const dx = Math.cos(spark.angle) * lineLength;
      const dy = Math.sin(spark.angle) * lineLength;

      context.strokeStyle = sparkColor;
      context.globalAlpha = alpha;
      context.lineWidth = Math.max(1, (sparkSize / 5) * extraScale);
      context.beginPath();
      context.moveTo(cx - dx * 0.5, cy - dy * 0.5);
      context.lineTo(cx + dx * 0.5, cy + dy * 0.5);
      context.stroke();
      context.globalAlpha = 1;
    };

    const animate = (time: number) => {
      const last = lastFrameRef.current || time;
      const dt = time - last;
      lastFrameRef.current = time;

      context.clearRect(0, 0, width, height);

      const next: Spark[] = [];
      for (const spark of sparksRef.current) {
        spark.life += dt;
        if (spark.life < spark.maxLife) {
          drawSpark(spark);
          next.push(spark);
        }
      }
      sparksRef.current = next;

      rafRef.current = window.requestAnimationFrame(animate);
    };

    const handlePointerDown = (event: PointerEvent) => {
      spawnSparks(event.clientX, event.clientY);
    };

    resize();
    rafRef.current = window.requestAnimationFrame(animate);
    window.addEventListener("resize", resize);
    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.cancelAnimationFrame(rafRef.current);
    };
  }, [duration, easing, extraScale, sparkColor, sparkCount, sparkRadius, sparkSize]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[60]"
      aria-hidden="true"
    />
  );
}
