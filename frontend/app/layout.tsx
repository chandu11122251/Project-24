import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-gray-950 text-white">
        <Navbar />
        <Sidebar />
        <main className="pt-16 md:pl-20 lg:pl-64">{children}</main>
      </body>
    </html>
  );
}
