"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { LogIn, Menu } from "lucide-react";

function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const onToggleSidebar = () => {
    window.dispatchEvent(new Event("toggle-sidebar"));
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-16 border-b border-cyan-300/20",
        "bg-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-black/30",
        "shadow-[0_0_32px_rgba(34,211,238,0.09)]"
      )}
    >
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-white/80 hover:bg-white/10 md:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
          <Link href="/" className="text-lg font-semibold tracking-[0.18em] text-cyan-200">
            PROJECT-24
          </Link>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/15"
        >
          <LogIn className="h-4 w-4" />
          <span>Sign In / Sign Up</span>
        </Link>
      </div>
    </header>
  );
}
