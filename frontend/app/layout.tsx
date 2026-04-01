import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import RippleGridBackground from "../components/background/RippleGridBackground";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project-24",
  description: "Peer-to-peer learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full w-full antialiased`}
    >
      <body className="min-h-full w-full bg-[#06070f] text-white overflow-x-hidden m-0 p-0">
        <RippleGridBackground>{children}</RippleGridBackground>
      </body>
    </html>
  );
}
