import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started - Project-24",
  description: "Start your learning journey",
};

export default function GetStartedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
