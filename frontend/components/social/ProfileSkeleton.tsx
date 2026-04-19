"use client";

import React from "react";
import { motion } from "motion/react";

export default function ProfileSkeleton() {
  return (
    <div className="relative min-h-screen w-full bg-[#06070f] overflow-hidden">
      {/* Header Area */}
      <div className="max-w-[1240px] mx-auto pt-24 pb-12 px-6">
        <header className="flex flex-col items-center">
          {/* Avatar Skeleton */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6">
            <motion.div 
              className="w-full h-full rounded-full bg-white/5 border border-white/10"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Username Skeleton */}
          <motion.div 
            className="h-8 w-48 bg-white/5 rounded-lg mb-3"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          
          {/* Handle Skeleton */}
          <motion.div 
            className="h-4 w-32 bg-white/5 rounded-md"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />

          {/* Stats Skeleton */}
          <div className="flex gap-12 mt-8">
            <motion.div 
              className="h-10 w-16 bg-white/5 rounded-lg"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            />
            <motion.div 
              className="h-10 w-16 bg-white/5 rounded-lg"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
            />
            <motion.div 
              className="h-10 w-16 bg-white/5 rounded-lg"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            />
          </div>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8 mt-12 px-2">
          {/* Aside Skeletons */}
          <aside className="flex flex-col gap-8">
            {[1, 2].map((i) => (
              <motion.div 
                key={i}
                className="h-[200px] w-full rounded-2xl bg-white/5 border border-white/10"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 + (i * 0.2) }}
              />
            ))}
          </aside>

          {/* Main Feed Skeletons */}
          <main className="flex flex-col gap-6">
            <motion.div 
              className="h-4 w-24 bg-white/5 rounded-md mb-2 ml-4"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i}
                className="h-[180px] w-full rounded-2xl bg-white/5 border border-white/10"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 + (i * 0.15) }}
              />
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
