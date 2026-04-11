"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState, useEffect, type ReactNode, type MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * TransitionLink — Intercepts navigation to play a kinetic exit overlay
 * before pushing to the next route.
 *
 * The exit animation is derived from the current starfield environment:
 * - Direction follows the drift vector
 * - Easing is determined by atmospheric density
 * - A dark veil sweeps in from the drift direction
 */

type TransitionLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

// Shared overlay state (singleton — only one transition can play at a time)
let globalSetOverlay: ((state: OverlayState | null) => void) | null = null;

type OverlayState = {
  active: boolean;
  originX: number;
  originY: number;
  driftAngle: number;
  density: number;
};

export function TransitionOverlay() {
  const [overlay, setOverlay] = useState<OverlayState | null>(null);
  
  useEffect(() => {
    globalSetOverlay = setOverlay;
  }, []);

  return (
    <AnimatePresence>
      {overlay?.active && (
        <motion.div
          className="fixed inset-0 z-9999 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: overlay?.active ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Radial reveal from click origin */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at var(--ox) var(--oy), rgba(6,7,15,0.95) 0%, rgba(6,7,15,0.98) 100%)",
              ["--ox" as string]: `${overlay.originX}px`,
              ["--oy" as string]: `${overlay.originY}px`,
            }}
            initial={{
              clipPath: `circle(0% at ${overlay.originX}px ${overlay.originY}px)`,
              opacity: 0.5,
            }}
            animate={{
              clipPath: `circle(150% at ${overlay.originX}px ${overlay.originY}px)`,
              opacity: 1,
            }}
            transition={{
              duration: 0.55,
              ease: overlay.density > 2
                ? [0.34, 1.56, 0.64, 1.0]  // snappy for dense environments
                : [0.16, 1.0, 0.3, 1.0],    // floaty for sparse environments
            }}
          />

          {/* Constellation echo lines */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(${overlay.driftAngle}deg, transparent 0%, rgba(80,230,210,0.04) 50%, transparent 100%)`,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function TransitionLink({ href, children, className }: TransitionLinkProps) {
  const router = useRouter();
  const navigatingRef = useRef(false);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (navigatingRef.current) return;
      navigatingRef.current = true;

      const driftAngle = 143.13; // Math.atan2(0.015, -0.02) * (180 / Math.PI)
      const density = 1.2;

      // Show overlay
      globalSetOverlay?.({
        active: true,
        originX: e.clientX,
        originY: e.clientY,
        driftAngle,
        density,
      });

      window.dispatchEvent(new Event("project24-route-exit"));

      // Navigate after the exit overlay has covered the screen
      const exitDuration = density > 2 ? 420 : 500;
      setTimeout(() => {
        router.push(href);

        // Clear overlay after navigation has started (new page's KineticPage will handle entry)
        setTimeout(() => {
          globalSetOverlay?.({ active: false, originX: 0, originY: 0, driftAngle: 0, density: 0 });
          // Small delay then fully remove
          setTimeout(() => {
            globalSetOverlay?.(null);
            navigatingRef.current = false;
          }, 100);
        }, 200);
      }, exitDuration);
    },
    [href, router],
  );

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
