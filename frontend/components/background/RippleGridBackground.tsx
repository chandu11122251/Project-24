"use client";

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
      {children}
    </div>
  );
}
