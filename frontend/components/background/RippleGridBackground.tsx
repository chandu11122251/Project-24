import React from "react";
import RippleGrid from "@/components/RippleGrid";
import { cn } from "@/lib/utils";

interface RippleGridBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

const RippleGridBackground = ({ children, className }: RippleGridBackgroundProps) => {
  return (
    <div className={cn("relative w-full min-h-screen overflow-hidden bg-[#06070f]", className)}>
      <div className="absolute inset-0 z-0">
        <RippleGrid
          enableRainbow
          gridColor="#5227FF"
          rippleIntensity={0.11}
          gridSize={23}
          gridThickness={50}
          fadeDistance={5}
          vignetteStrength={5}
          glowIntensity={1}
          opacity={1}
          gridRotation={0}
          mouseInteraction
          mouseInteractionRadius={0.8}
        />
      </div>
      
      {/* Luminous atmospheric overlay to blend with the grid */}
      <div className="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(circle_at_50%_50%,rgba(82,39,255,0.08),transparent_60%)]" />
      
      <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default RippleGridBackground;
