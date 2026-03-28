import Image from "next/image";
import Link from "next/link";
import { SplashCursorBackground } from "@/components/splash-cursor-background";

export default function Home() {
  return (
    <div className="relative z-0 flex min-h-screen flex-col items-center justify-center bg-black font-sans text-white">
      <SplashCursorBackground />
      <main className="relative z-10 flex w-full max-w-3xl flex-1 flex-col items-center justify-between px-16 py-32 sm:items-start">
        <Image
          className="invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-black transition-colors hover:bg-zinc-200 md:w-[158px] font-bold"
            href="/main"
          >
            Get Started
          </Link>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-white/15 px-5 transition-colors hover:bg-white/10 md:w-[158px]"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
