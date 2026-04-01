"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(clsx(inputs));
}

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/main";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Sidebar hideTopOffset={hideNavbar} />
      <main className={cn("app-main", hideNavbar && "app-main--no-navbar")}>{children}</main>
    </>
  );
}
