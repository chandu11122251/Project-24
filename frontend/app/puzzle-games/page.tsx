"use client";

import React from "react";
import Link from "next/link";
import StarfieldBackground from "@/components/background/StarfieldBackground";
import BorderGlow from "@/components/effects/BorderGlow";
import StarBorder from "@/components/effects/StarBorder";
import { Puzzle, Grid3x3, Library } from "lucide-react";
import AnimatedList from "@/components/ui/AnimatedList";
import "./puzzle-games.css";

export default function PuzzleGamesPage() {
  const puzzleCards = [
    (
      <div className="puzzle-card-wrapper w-full">
        <Link href="/puzzle-games/mini-sudoku" className="block outline-none">
          <BorderGlow
            edgeSensitivity={28}
            glowColor="200 80 65"
            backgroundColor="#0a0e1a"
            borderRadius={20}
            glowRadius={24}
            glowIntensity={0.6}
            coneSpread={22}
            animated={false}
            colors={["#3b82f6", "#60a5fa", "#2563eb"]}
            className="puzzle-card-glow h-full cursor-pointer"
          >
            <article className="puzzle-card">
              <div className="puzzle-card__info">
                <div className="puzzle-card__icon" style={{ "--icon-accent": "#3b82f6" } as React.CSSProperties}>
                  <Grid3x3 className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-white/95 leading-snug mb-3">
                  Sudoku
                </h3>
                <p className="text-base text-white/55 leading-relaxed flex-1">
                  A classic 9x9 logic puzzle. Fill the grid so that every row, column, and 3x3 block contains the numbers 1 through 9. Perfect for a mental workout.
                </p>
                <div className="flex flex-wrap gap-2 mt-6 mb-4">
                  <span className="puzzle-tag">Logic</span>
                  <span className="puzzle-tag">Numbers</span>
                  <span className="puzzle-tag">Thinking</span>
                </div>
                <div className="flex justify-end mt-auto">
                  <span className="game-btn m-0 border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">Solve Puzzle</span>
                </div>
              </div>
            </article>
          </BorderGlow>
        </Link>
      </div>
    ),
    (
      <div className="puzzle-card-wrapper w-full">
        <Link href="/puzzle-games/minesweeper" className="block outline-none">
          <BorderGlow
            edgeSensitivity={28}
            glowColor="340 80 65"
            backgroundColor="#0a0e1a"
            borderRadius={20}
            glowRadius={24}
            glowIntensity={0.6}
            coneSpread={22}
            animated={false}
            colors={["#ec4899", "#f472b6", "#db2777"]}
            className="puzzle-card-glow h-full cursor-pointer"
          >
            <article className="puzzle-card">
              <div className="puzzle-card__info">
                <div className="puzzle-card__icon" style={{ "--icon-accent": "#ec4899" } as React.CSSProperties}>
                  <Library className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-white/95 leading-snug mb-3">
                  Booksweeper
                </h3>
                <p className="text-base text-white/55 leading-relaxed flex-1">
                  Navigate the library safely! Uncover tiles without disturbing the hidden stacks of books. Numbers indicate how many adjacent tiles contain a stack. Right-click to place a flag.
                </p>
                <div className="flex flex-wrap gap-2 mt-6 mb-4">
                  <span className="puzzle-tag">Strategy</span>
                  <span className="puzzle-tag">Deduction</span>
                  <span className="puzzle-tag">Classic</span>
                </div>
                <div className="flex justify-end mt-auto">
                  <span className="game-btn m-0 border-pink-500/30 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20">Solve Puzzle</span>
                </div>
              </div>
            </article>
          </BorderGlow>
        </Link>
      </div>
    )
  ];

  return (
    <StarfieldBackground className="relative min-h-screen w-full bg-[#06070f] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-[#06070f]/60 border-b border-white/5">
        <Link
          href="/main"
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
        <Link href="/login" className="group">
          <StarBorder as="span" color="cyan" speed="5s" thickness={1}>
            <span className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-cyan-100 transition-colors duration-200 group-hover:text-white">
              Sign In
            </span>
          </StarBorder>
        </Link>
      </nav>

      {/* Hero */}
      <header className="relative z-10 flex flex-col items-center text-center pt-32 pb-12 px-4">
        <div className="puzzles-hero-icon mb-6">
          <Puzzle className="h-10 w-10 text-purple-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-linear-to-r from-purple-300 via-white to-pink-300 bg-clip-text text-transparent pb-2">
          Puzzle Games
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/60 leading-relaxed">
          Take a break and stimulate your mind. Enjoy our collection of interactive puzzle games designed to challenge your logic and strategy.
        </p>
      </header>

      {/* Cards stack */}
      <section className="relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-8 pb-24">
        <AnimatedList
          items={puzzleCards}
          displayScrollbar={false}
          showGradients={true}
        />
      </section>
    </StarfieldBackground>
  );
}
