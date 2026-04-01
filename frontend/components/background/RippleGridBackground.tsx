"use client";

import RippleGrid from "../RippleGrid";
import { PropsWithChildren } from "react";

type RippleGridBackgroundProps = PropsWithChildren<{
  className?: string;
}>;

export default function RippleGridBackground({
  children,
  className,
}: RippleGridBackgroundProps) {
  const rootClassName =
    className ?? "relative w-full min-h-screen bg-[#06070f]";

  return (
    <div className={rootClassName}>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <RippleGrid
          enableRainbow
          gridColor="#29fbff"
          rippleIntensity={0.14}
          gridSize={14}
          gridThickness={38}
          fadeDistance={3}
          vignetteStrength={2}
          glowIntensity={1}
          opacity={1}
          gridRotation={0}
          mouseInteraction
          mouseInteractionRadius={1.1}
        />
      </div>
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        {children}
      </div>
    </div>
  );
}
