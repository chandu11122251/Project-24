"use client";

import dynamic from "next/dynamic";

const SplashCursor = dynamic(
  () => import("@/components/SplashCursor"),
  { ssr: false }
);

export function SplashCursorBackground() {
  return (
    <div
      className="fixed inset-0 z-[1] w-screen h-screen pointer-events-none"
      aria-hidden="true"
    >
      <SplashCursor
        SIM_RESOLUTION={128}
        DYE_RESOLUTION={1440}
        DENSITY_DISSIPATION={1}
        VELOCITY_DISSIPATION={0.8}
        PRESSURE={0.1}
        CURL={3}
        SPLAT_RADIUS={0.35}
        SPLAT_FORCE={8000}
        COLOR_UPDATE_SPEED={5}
      />
    </div>
  );
}
