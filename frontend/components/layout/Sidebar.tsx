"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Activity, BookOpen, Code2, Puzzle, Users, Video, Zap } from "lucide-react";
import BorderGlow from "@/components/effects/BorderGlow";
import { useAuth } from "@backend/AuthProvider";

function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(clsx(inputs));
}

type SectionItem = {
  label: string;
  anchor: string;
  Icon: React.ComponentType<{ className?: string }>;
  badge?: string;
};

type SidebarProps = {
  hideTopOffset?: boolean;
};

export default function Sidebar({ hideTopOffset = false }: SidebarProps) {
  const pathname = usePathname();
  const { user, userData } = useAuth();
  const [collapsed, setCollapsed] = useState(true);
  const [activeAnchor, setActiveAnchor] = useState<string>("#puzzle-games");

  const sectionItems = useMemo<SectionItem[]>(
    () => [
      { label: "Puzzle Games", anchor: "#puzzle-games", Icon: Puzzle },
      { label: "Challenges", anchor: "#challenges", Icon: Zap, badge: "7" },
      { label: "Hackathons", anchor: "#hackathons", Icon: Code2, badge: "3" },
      { label: "Webinars", anchor: "#webinars", Icon: Video },
      { label: "Study Groups", anchor: "#study-groups", Icon: Users, badge: "12" },

      { label: "About Us", anchor: "#about-us", Icon: BookOpen },
    ],
    []
  );

  const sectionIds = useMemo(
    () => sectionItems.map((item) => item.anchor.replace("#", "")),
    [sectionItems]
  );

  const sectionHref = (anchor: string) =>
    pathname.startsWith("/main") ? anchor : `/main${anchor}`;

  useEffect(() => {
    // Sync class with state
    const root = document.documentElement;
    if (collapsed) {
      root.classList.add("sidebar-collapsed");
    } else {
      root.classList.remove("sidebar-collapsed");
    }
    
    return () => {
      // We do NOT remove on clean up to maintain state during layout transitions 
      // unless we know we are leaving the AppFrame entirely.
    };
  }, [collapsed]);

  useEffect(() => {
    if (!pathname.startsWith("/main")) return;

    const updateFromHash = () => {
      const hash = window.location.hash;
      if (hash && sectionItems.some((item) => item.anchor === hash)) {
        setActiveAnchor(hash);
      }
    };

    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);

    return () => window.removeEventListener("hashchange", updateFromHash);
  }, [pathname, sectionItems]);

  useEffect(() => {
    if (!pathname.startsWith("/main")) return;

    const updateFromMainScroll = (event: Event) => {
      const customEvent = event as CustomEvent<{ sectionId?: string }>;
      const sectionId = customEvent.detail?.sectionId;
      if (!sectionId) return;

      const anchor = `#${sectionId}`;
      if (!sectionItems.some((item) => item.anchor === anchor)) return;
      setActiveAnchor(anchor);
    };

    window.addEventListener("project24-active-section", updateFromMainScroll as EventListener);
    return () => {
      window.removeEventListener("project24-active-section", updateFromMainScroll as EventListener);
    };
  }, [pathname, sectionItems]);

  useEffect(() => {
    if (!pathname.startsWith("/main")) return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveAnchor(`#${visibleEntry.target.id}`);
        }
      },
      {
        threshold: [0.15, 0.3, 0.5, 0.7],
        rootMargin: "-20% 0px -55% 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [pathname, sectionIds]);

  const navLinkClassName = (anchor: string) =>
    cn(
      "group relative flex items-center rounded-lg border border-transparent text-[13px] transition-all duration-200",
      collapsed ? "justify-center px-1.5 py-2" : "gap-2.5 px-2 py-2",
      activeAnchor === anchor
        ? "border-[#12908f]/40 bg-[#0d6e6e]/15 text-[#12908f]"
        : "text-[#666] hover:bg-white/5 hover:text-[#e8e8e8]"
    );

  return (
    <aside
      className={cn(
        "fixed left-0 z-40 hidden md:flex",
        hideTopOffset ? "top-0 h-dvh" : "top-16 h-[calc(100dvh-4rem)]",
        collapsed ? "w-[54px]" : "w-[220px]"
      )}
    >
      <BorderGlow
        edgeSensitivity={30}
        glowColor="40 80 80"
        backgroundColor="#090909"
        borderRadius={0}
        glowRadius={16}
        glowIntensity={0.65}
        coneSpread={20}
        animated={false}
        colors={["#67e8f9", "#22d3ee", "#06b6d4"]}
        className="h-full w-full"
      >
      <div className="absolute inset-y-0 right-0 w-px bg-linear-to-b from-transparent via-[#0d6e6e]/60 to-transparent" />

      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-r-[22px] border border-[#0d6e6e]/20 border-l-0 bg-[#090909]">
        <div
          className={cn(
            "flex min-h-[58px] items-center border-b border-[#0d6e6e]/20 py-3",
            collapsed ? "justify-center px-2" : "gap-2 px-3"
          )}
        >
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[#084444] bg-[#0d6e6e]/15 transition-colors hover:border-[#0d6e6e] hover:bg-[#0d6e6e]/30"
            aria-label="Toggle sidebar"
          >
            <svg viewBox="0 0 15 15" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
              <path d="M2 4h11M2 7.5h11M2 11h11" stroke="#12908f" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>

          <div className={cn("overflow-hidden whitespace-nowrap transition-all duration-300", collapsed ? "w-0 opacity-0" : "w-[120px] opacity-100")}>
            <p className="font-semibold tracking-[0.03em] text-[#e8e8e8]">Project-24</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1 px-2 py-2">
          <Link
            href="/profile"
            className={cn(
              "group/profile relative flex items-center rounded-lg py-2 transition-all duration-300 hover:bg-white/5",
              collapsed ? "justify-center px-0" : "gap-3 px-2"
            )}
          >
            <div className="relative shrink-0">
              <div className={cn(
                "flex h-[32px] w-[32px] items-center justify-center rounded-full border border-[#0d6e6e]/40 bg-[#084444]/20 transition-all duration-300 group-hover/profile:border-cyan-500/50 overflow-hidden",
                userData?.profile_picture ? "" : "text-[11px] font-bold text-[#12908f] uppercase"
              )}>
                {userData?.profile_picture ? (
                  <img src={userData.profile_picture} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span>{userData?.username ? userData.username[0] : (user?.email ? user.email[0] : "P")}</span>
                )}
              </div>
              {user && (
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#090909] bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
              )}
            </div>

            <div className={cn("flex flex-col overflow-hidden transition-all duration-300", collapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
              <span className="block truncate text-xs font-semibold text-[#e8e8e8] group-hover/profile:text-white transition-colors">
                {userData?.username || (user?.email?.split('@')[0]) || "Synthesizing..."}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#12908f] group-hover/profile:text-cyan-400/80 transition-colors">
                {user ? "Online" : "Guest Mode"}
              </span>
            </div>
            
            {!user && collapsed && (
              <div className="absolute left-14 hidden group-hover/profile:block z-50 rounded bg-[#0d6e6e] px-2 py-1 text-[10px] whitespace-nowrap text-white font-black uppercase tracking-widest border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                Sign In
              </div>
            )}
          </Link>

          <div className="my-1 h-px bg-[#0d6e6e]/20" />

          <nav className="flex flex-1 flex-col gap-1">
            {sectionItems.map(({ label, anchor, Icon, badge }) => (
              <a
                key={anchor}
                href={sectionHref(anchor)}
                onClick={() => setActiveAnchor(anchor)}
                className={navLinkClassName(anchor)}
              >
                {activeAnchor === anchor && <span className="absolute left-0 top-1/2 h-2/3 w-[2.5px] -translate-y-1/2 rounded-r-sm bg-[#12908f]" />}
                <span className={cn("inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[7px] transition", activeAnchor === anchor ? "bg-[#0d6e6e]/35 text-[#12908f]" : "text-[#888]")}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className={cn("overflow-hidden whitespace-nowrap transition-all duration-300", collapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                  {label}
                </span>
                {badge ? (
                  <span className={cn("ml-auto rounded-full border border-[#0d6e6e]/40 bg-[#084444] px-2 py-0.5 text-[10px] text-[#12908f] transition-all duration-300", collapsed ? "hidden" : "w-auto opacity-100")}>
                    {badge}
                  </span>
                ) : null}
              </a>
            ))}
          </nav>
        </div>
      </div>
      </BorderGlow>
    </aside>
  );
}
