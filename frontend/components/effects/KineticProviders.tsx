"use client";

import { TransitionOverlay } from "@/components/effects/TransitionLink";
import { AuthProvider } from "@backend/AuthProvider";

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
    <AuthProvider>
      {children}
      <TransitionOverlay />
    </AuthProvider>
  );
}
