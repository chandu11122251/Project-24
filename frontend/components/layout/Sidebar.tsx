"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  BookOpen,
  Code2,
  Info,
  Puzzle,
  User,
  Video,
  X,
  Zap,
} from "lucide-react";

function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(clsx(inputs));
}

function ItemLabel({ text, className }: { text: string; className?: string }) {
  return <span className={cn("hidden lg:inline", className)}>{text}</span>;
}

type SectionItem = {
  id: string;
  label: string;
  href: string;
  Icon: ComponentType<{ className?: string }>;
};

function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.2, 0.35, 0.5, 0.7],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sectionItems = useMemo<SectionItem[]>(
    () => [
      { id: "puzzle-games", label: "Puzzle Games", href: "#puzzle-games", Icon: Puzzle },
      { id: "challenges", label: "Challenges", href: "#challenges", Icon: Zap },
      { id: "hackathons", label: "Hackathons", href: "#hackathons", Icon: Code2 },
      { id: "webinar", label: "Webinar", href: "#webinar", Icon: Video },
      {
        id: "study-groups",
        label: "Study Groups",
        href: "#study-groups",
        Icon: BookOpen,
      },
    ],
    []
  );

  const activeId = useActiveSection(sectionItems.map((item) => item.id));

  useEffect(() => {
    const handler = () => setMobileOpen((prev) => !prev);
    window.addEventListener("toggle-sidebar", handler);
    return () => window.removeEventListener("toggle-sidebar", handler);
  }, []);

  const navBody = (
    <div className="flex h-full flex-col">
      <div className="px-3 pt-3">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
          onClick={() => setMobileOpen(false)}
        >
          <User className="h-4 w-4 shrink-0" />
          <ItemLabel text="Profile" />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col px-3 py-3">
        {sectionItems.map(({ id, label, href, Icon }) => {
          const isActive = activeId === id;
          return (
            <a
              key={id}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "mb-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                isActive
                  ? "bg-cyan-300/15 text-cyan-100 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.4)]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <ItemLabel text={label} />
            </a>
          );
        })}

        <a
          href="#about-us"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "mt-auto flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-light tracking-wide",
            activeId === "about-us"
              ? "bg-white/10 text-cyan-100"
              : "text-white/50 hover:bg-white/10 hover:text-white"
          )}
        >
          <Info className="h-4 w-4 shrink-0" />
          <ItemLabel text="About Us" className="text-xs" />
        </a>
      </nav>

      <div className="mx-3 mb-3 mt-2 border-t border-white/10 pt-3 text-center text-[11px] text-white/40 lg:text-left lg:pl-3">
        <span className="hidden lg:inline">Project-24 v1.0</span>
        <span className="lg:hidden">v1.0</span>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100dvh-4rem)] w-20 border-r border-white/10 bg-black/40 backdrop-blur-lg md:flex lg:w-64">
        {navBody}
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition md:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <aside
          className={cn(
            "h-full w-72 border-r border-white/15 bg-[#070d18] transition-transform",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-12 items-center justify-end px-3">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/15 text-white/70"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {navBody}
        </aside>
      </div>
    </>
  );
}
