"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function GetStartedPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/main");
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-end pb-12">
      <button
        onClick={handleGetStarted}
        className="relative z-10 inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-300 hover:text-cyan-200 transition-all duration-300 font-semibold"
      >
        Get Started
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
