"use client";

import { motion, AnimatePresence } from "motion/react";
import { useMemo, useState, useEffect, type ReactNode } from "react";

const avgDrift = { x: -0.02, y: 0.015 };
const density = 1.2;

/**
 * Kinetic UI Synthesis — Transition Components for Project-24
 *
 * All motion is derived from the StarfieldBackground's physics:
 *
 * 1. ENVIRONMENTAL SAMPLING — UI enters along the average drift vector
 * 2. LUMINOUS MATCHING — Shadows track mouse (primary light source)
 * 3. CONNECTIVITY LOGIC — "Weaving" scale pulse on entry
 * 4. ATMOSPHERIC FRICTION — Density determines easing character
 */

// ───── Easing Derivation ─────
// High density → snappy (aggressive ease-out with overshoot)
// Low density  → drifting (gentle, lingering ease)
function deriveEasing(density: number): [number, number, number, number] {
  const t = Math.min(Math.max(density / 3, 0), 1);
  const p1x = 0.16 + t * 0.18;
  const p1y = 1.0 + t * 0.56;
  const p2x = 0.3 + t * 0.34;
  const p2y = 1.0;
  return [p1x, p1y, p2x, p2y];
}

// ───── Drift → Entry Direction ─────
function driftToEntryOffset(avgDrift: { x: number; y: number }, magnitude = 120) {
  const angle = Math.atan2(avgDrift.y, avgDrift.x);
  return {
    x: -Math.cos(angle) * magnitude,
    y: -Math.sin(angle) * magnitude,
  };
}

// ───────────────────────────────────────
// KineticCard — Enters as a physical inhabitant of the starfield
// ───────────────────────────────────────
type KineticCardProps = {
  children: ReactNode;
  index?: number;
  className?: string;
  style?: React.CSSProperties;
};

export function KineticCard({ children, index = 0, className = "", style = {} }: KineticCardProps) {
  const motionConfig = useMemo(() => {
    const [p1x, p1y, p2x, p2y] = deriveEasing(density);
    const entry = driftToEntryOffset(avgDrift);
    const stagger = index * 0.12;

    return {
      initial: {
        opacity: 0,
        x: entry.x,
        y: entry.y,
        scale: 0.85,
        filter: "blur(8px)",
      },
      animate: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: [0.85, 1.02, 1.0], // connectivity weaving pulse
        filter: "blur(0px)",
        transition: {
          duration: 0.9 + density * 0.1,
          delay: stagger + 0.1,
          ease: [p1x, p1y, p2x, p2y] as [number, number, number, number],
          scale: {
            times: [0, 0.65, 1],
            duration: 1.0 + density * 0.15,
            delay: stagger + 0.15,
            ease: [p1x, p1y, p2x, p2y] as [number, number, number, number],
          },
        },
      },
      exit: {
        opacity: 0,
        x: -entry.x * 0.5,
        y: -entry.y * 0.5 + 30,
        scale: 0.92,
        filter: "blur(6px)",
        transition: {
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1] as [number, number, number, number],
        },
      },
    };
  }, [index]);

  return (
    <motion.div
      className={`kinetic-card ${className}`}
      style={{ perspective: "1200px", ...style }}
      {...motionConfig}
    >
      {children}
    </motion.div>
  );
}

// ───────────────────────────────────────
// KineticPage — Full page enter/exit wrapper
// ───────────────────────────────────────
type KineticPageProps = {
  children: ReactNode;
  pageKey: string;
  className?: string;
};

export function KineticPage({ children, pageKey, className = "" }: KineticPageProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const handleExit = () => setIsExiting(true);
    window.addEventListener("project24-route-exit", handleExit);
    return () => window.removeEventListener("project24-route-exit", handleExit);
  }, []);

  const [p1x, p1y, p2x, p2y] = useMemo(() => deriveEasing(density), []);
  const entry = useMemo(() => driftToEntryOffset(avgDrift, 60), []);

  return (
    <AnimatePresence mode="wait">
      {!isExiting && (
        <motion.div
          key={pageKey}
        className={className}
        initial={{
          opacity: 0,
          y: entry.y + 40,
          scale: 0.97,
          filter: "blur(4px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: {
            duration: 0.8,
            ease: [p1x, p1y, p2x, p2y],
            staggerChildren: 0.08,
          },
        }}
        exit={{
          opacity: 0,
          y: -(entry.y + 40),
          scale: 0.97,
          filter: "blur(4px)",
          transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
        }}
      >
        {children}
      </motion.div>
      )}
    </AnimatePresence>
  );
}

// ───────────────────────────────────────
// KineticGlowBorder — Light-reactive shadows
// ───────────────────────────────────────
type KineticGlowBorderProps = {
  children: ReactNode;
  className?: string;
  intensity?: number;
};

export function KineticGlowBorder({
  children,
  className = "",
  intensity = 1,
}: KineticGlowBorderProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const shadowX = useMemo(() => {
    const cx = typeof window !== "undefined" ? window.innerWidth / 2 : 500;
    return ((mousePos.x - cx) / cx) * -6 * intensity;
  }, [mousePos.x, intensity]);

  const shadowY = useMemo(() => {
    const cy = typeof window !== "undefined" ? window.innerHeight / 2 : 400;
    return ((mousePos.y - cy) / cy) * -6 * intensity;
  }, [mousePos.y, intensity]);

  return (
    <motion.div
      className={className}
      style={{
        boxShadow: `
          ${shadowX}px ${shadowY}px 30px rgba(80, 230, 210, ${0.08 * intensity}),
          0 0 60px rgba(80, 230, 210, ${0.04 * intensity}),
          inset 0 0 30px rgba(80, 230, 210, ${0.03 * intensity})
        `,
        border: `1px solid rgba(80, 230, 210, ${0.12 * intensity})`,
        transition: "box-shadow 0.3s ease",
      }}
    >
      {children}
    </motion.div>
  );
}
