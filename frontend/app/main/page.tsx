"use client";

import { TransitionLink } from "@/components/effects/TransitionLink";
import { KineticCard, KineticPage } from "@/components/effects/KineticTransition";
import { useCallback, useEffect, useRef } from "react";
import StarfieldBackground from "@/components/background/StarfieldBackground";
import BorderGlow from "@/components/effects/BorderGlow";
import StarBorder from "@/components/effects/StarBorder";

const SECTION_IDS = [
  "puzzle-games",
  "challenges",
  "hackathons",
  "webinars",
  "study-groups",
  "about-us",
] as const;

export default function MainPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastActiveSectionRef = useRef<string>(SECTION_IDS[0]);

  const postSectionScrollMessage = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    const sectionId = window.location.hash.replace(/^#/, "").trim();
    if (!sectionId) return;

    iframe.contentWindow.postMessage(
      {
        type: "project24-scroll-to",
        sectionId,
      },
      "*",
    );
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let resizeObserver: ResizeObserver | null = null;
    let resizeRaf: number | null = null;

    const syncIframeHeight = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;

        const body = doc.body;
        const html = doc.documentElement;
        const nextHeight = Math.max(
          body?.scrollHeight ?? 0,
          html?.scrollHeight ?? 0,
          body?.offsetHeight ?? 0,
          html?.offsetHeight ?? 0,
        );

        if (nextHeight > 0) {
          iframe.style.height = `${nextHeight}px`;
        }
      } catch {
        // Intentionally ignore cross-document measurement errors.
      }
    };

    const onIframeLoad = () => {
      syncIframeHeight();
      postSectionScrollMessage();

      try {
        const doc = iframe.contentDocument;
        if (!doc) return;

        resizeObserver?.disconnect();
        resizeObserver = new ResizeObserver(() => {
          if (resizeRaf !== null) cancelAnimationFrame(resizeRaf);
          resizeRaf = requestAnimationFrame(syncIframeHeight);
        });

        if (doc.body) resizeObserver.observe(doc.body);
        resizeObserver.observe(doc.documentElement);
      } catch {
        // Intentionally ignore observer wiring errors.
      }
    };

    iframe.addEventListener("load", onIframeLoad);
    if (iframe.contentDocument?.readyState === "complete") {
      onIframeLoad();
    }
    window.addEventListener("resize", syncIframeHeight);
    window.addEventListener("hashchange", postSectionScrollMessage);

    postSectionScrollMessage();

    return () => {
      iframe.removeEventListener("load", onIframeLoad);
      window.removeEventListener("resize", syncIframeHeight);
      window.removeEventListener("hashchange", postSectionScrollMessage);
      resizeObserver?.disconnect();
      if (resizeRaf !== null) cancelAnimationFrame(resizeRaf);
    };
  }, [postSectionScrollMessage]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let sectionRaf: number | null = null;

    const emitActiveSection = (sectionId: string) => {
      if (sectionId === lastActiveSectionRef.current) return;
      lastActiveSectionRef.current = sectionId;
      window.dispatchEvent(
        new CustomEvent("project24-active-section", {
          detail: { sectionId },
        }),
      );
    };

    const computeAndEmitActiveSection = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;

        const iframeRect = iframe.getBoundingClientRect();
        const viewportMarker = Math.max(120, window.innerHeight * 0.28);
        let currentSection: (typeof SECTION_IDS)[number] = SECTION_IDS[0];

        for (const sectionId of SECTION_IDS) {
          const section = doc.getElementById(sectionId);
          if (!section) continue;

          // Section rect is relative to iframe viewport; offset by iframe's position in parent viewport.
          const sectionTopInParentViewport = iframeRect.top + section.getBoundingClientRect().top;
          if (sectionTopInParentViewport <= viewportMarker) {
            currentSection = sectionId;
          } else {
            break;
          }
        }

        emitActiveSection(currentSection);
      } catch {
        // Ignore read failures while iframe/doc is not ready.
      }
    };

    const scheduleActiveSectionUpdate = () => {
      if (sectionRaf !== null) return;
      sectionRaf = requestAnimationFrame(() => {
        sectionRaf = null;
        computeAndEmitActiveSection();
      });
    };

    scheduleActiveSectionUpdate();
    window.addEventListener("scroll", scheduleActiveSectionUpdate, { passive: true });
    window.addEventListener("resize", scheduleActiveSectionUpdate);
    window.addEventListener("hashchange", scheduleActiveSectionUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleActiveSectionUpdate);
      window.removeEventListener("resize", scheduleActiveSectionUpdate);
      window.removeEventListener("hashchange", scheduleActiveSectionUpdate);
      if (sectionRaf !== null) cancelAnimationFrame(sectionRaf);
    };
  }, []);

  return (
    <StarfieldBackground className="relative min-h-screen w-full overflow-hidden bg-[#06070f] text-white">
      <KineticPage pageKey="main" className="relative z-10 flex min-h-screen w-full flex-col px-4 py-4">
        <div className="flex w-full justify-end z-50">
          <KineticCard index={1}>
            <TransitionLink href="/login" className="group block">
              <StarBorder as="span" color="cyan" speed="5s" thickness={1}>
                <span className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-cyan-100 transition-colors duration-200 group-hover:text-white">
                  <span className="group-hover:hidden">Sign In/Sign Up</span>
                  <span className="hidden group-hover:inline">Sign In/Sign Up</span>
                </span>
              </StarBorder>
            </TransitionLink>
          </KineticCard>
        </div>

        <div className="flex flex-1 w-full items-center justify-center py-6">
          <KineticCard index={0} className="w-full max-w-[920px]">
        <BorderGlow
          performanceMode="static"
          edgeSensitivity={32}
          glowColor="190 75 70"
          backgroundColor="#070910"
          borderRadius={18}
          glowRadius={34}
          glowIntensity={0.82}
          coneSpread={24}
          animated={false}
          colors={["#67e8f9", "#38bdf8", "#0ea5e9"]}
          className="w-full"
        >
          <iframe
            ref={iframeRef}
            src="/project24-learning-guide.html"
            style={{
              width: "100%",
              maxWidth: "900px",
              height: "1700px",
              border: "none",
              borderRadius: "8px",
              display: "block",
            }}
            scrolling="no"
            frameBorder="0"
            title="Project-24: Orb Wrapping Layout"
          />
        </BorderGlow>
          </KineticCard>
        </div>
      </KineticPage>
    </StarfieldBackground>
  );
}
