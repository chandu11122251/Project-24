"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/main");
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-end pb-12">
      <button
        onClick={handleGetStarted}
        className="relative z-10 inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-8 py-3 font-semibold text-cyan-300 transition-all duration-300 hover:border-cyan-500/60 hover:bg-cyan-500/20 hover:text-cyan-200"
      >
        Get Started
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
