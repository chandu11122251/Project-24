"use client";

import Sidebar from "./Sidebar";

export default function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar hideTopOffset />
      <main className="app-main">{children}</main>
    </>
  );
}
