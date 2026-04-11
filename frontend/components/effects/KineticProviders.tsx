"use client";

import { TransitionOverlay } from "@/components/effects/TransitionLink";

/**
 * Client-side providers for the Kinetic UI system.
 * Renders the TransitionOverlay (exit animation overlay).
 */
export default function KineticProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <TransitionOverlay />
    </>
  );
}
