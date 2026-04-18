"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = pathname === "/main";

  useEffect(() => {
    if (!showSidebar) {
      document.documentElement.style.setProperty("--sidebar-width", "0px");
    } else {
      document.documentElement.style.removeProperty("--sidebar-width");
    }
    return () => {
      document.documentElement.style.removeProperty("--sidebar-width");
    };
  }, [showSidebar]);

  if (!showSidebar) {
    return <main className="relative w-full min-h-screen">{children}</main>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Sidebar hideTopOffset />
      <main className="app-main flex-1 w-full relative">{children}</main>
    </div>
  );
}
