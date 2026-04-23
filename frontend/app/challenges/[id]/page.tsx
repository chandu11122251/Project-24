"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import StarfieldBackground from "@/components/background/StarfieldBackground";
import StarBorder from "@/components/effects/StarBorder";
import BorderGlow from "@/components/effects/BorderGlow";
import { Challenge } from "@/types/challenge";
import { 
  getChallengeById, 
  joinChallenge, 
  checkIfJoined 
} from "@backend/db.js";
import { useAuth } from "@backend/AuthProvider";
import { 
  ChevronLeft, 
  Users, 
  Timer, 
  ExternalLink,
  ShieldCheck,
  Trophy,
  Swords,
  Palette,
  Brain,
  Sparkles,
  Code2,
  Flame,
  Zap
} from "lucide-react";
import "../challenges.css";

const IconMap: Record<string, ReactNode> = {
  Swords: <Swords className="h-10 w-10" />,
  Palette: <Palette className="h-10 w-10" />,
  Brain: <Brain className="h-10 w-10" />,
  Timer: <Timer className="h-10 w-10" />,
  Sparkles: <Sparkles className="h-10 w-10" />,
  Users: <Users className="h-10 w-10" />,
  Code2: <Code2 className="h-10 w-10" />,
  Flame: <Flame className="h-10 w-10" />,
  Trophy: <Trophy className="h-10 w-10" />,
  Zap: <Zap className="h-10 w-10" />,
};

export default function ChallengeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const c = await getChallengeById(id as string) as Challenge | null;
        if (!c) {
          router.push("/challenges");
          return;
        }
        setChallenge(c);

        if (user) {
          const joined = await checkIfJoined(user.uid, id as string);
          setHasJoined(joined);
        }
      } catch (err) {
        console.error("Error fetching challenge details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user, router]);

  const handleJoin = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (hasJoined) return;

    setJoining(true);
    try {
      await joinChallenge(id as string, user.uid);
      setHasJoined(true);
      // Update local participant count
      setChallenge((prev: Challenge | null) => prev ? ({
        ...prev,
        participants: (prev.participants || 0) + 1
      }) : null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to join challenge.";
      alert(errorMessage);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <StarfieldBackground className="min-h-screen flex items-center justify-center bg-[#06070f] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-white/40 animate-pulse text-sm font-medium tracking-widest">LOADING NEURAL INTERFACE...</p>
        </div>
      </StarfieldBackground>
    );
  }

  if (!challenge) return null;

  return (
    <StarfieldBackground className="relative min-h-screen w-full overflow-hidden bg-[#06070f] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-[#06070f]/60 border-b border-white/5">
        <Link
          href="/challenges"
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Challenges
        </Link>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto pt-32 pb-24 px-6 space-y-12">
        {/* 1. Title Section */}
        <div className="flex items-start gap-6">
          <div 
            className="p-4 rounded-2xl bg-white/5 border border-white/10"
            style={{ color: challenge.accentColor || "#00f2ff" }}
          >
            {IconMap[challenge.icon || "Zap"] || <Zap className="h-10 w-10" />}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">{challenge.category}</p>
            <h1 className="text-5xl font-bold text-white tracking-tight">{challenge.title}</h1>
          </div>
        </div>

        {/* 2. Tags Section */}
        <div className="flex flex-wrap gap-2">
          {challenge.tags?.map((tag: string) => (
            <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] uppercase tracking-wider text-white/50 font-medium">
              #{tag}
            </span>
          ))}
        </div>

        {/* 3. Objective Section */}
        <div className="prose prose-invert max-w-none">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            Mission Objective
          </h3>
          <p className="text-white/60 leading-relaxed text-xl font-light">
            {challenge.description}
          </p>
        </div>

        {/* 4. Details Section (Stats Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-5 rounded-2xl bg-white/2 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-white/30">
              <Trophy className="h-3.5 w-3.5" />
              <p className="text-[10px] uppercase tracking-[0.15em] font-bold">Difficulty</p>
            </div>
            <p className="text-lg font-semibold text-purple-400">{challenge.difficulty}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/2 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-white/30">
              <Timer className="h-3.5 w-3.5" />
              <p className="text-[10px] uppercase tracking-[0.15em] font-bold">Duration</p>
            </div>
            <p className="text-lg font-semibold text-cyan-400">{challenge.duration}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/2 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-white/30">
              <Users className="h-3.5 w-3.5" />
              <p className="text-[10px] uppercase tracking-[0.15em] font-bold">Active Operators</p>
            </div>
            <p className="text-lg font-semibold text-emerald-400">{challenge.participants || 0}</p>
          </div>
        </div>

        {/* 5. Ready to Begin Section (Curvy Box) */}
        <div className="ready-box mt-12">
          <h2 className="ready-box-title">Ready to Begin?</h2>
          <p className="ready-box-subtitle">Complete the external challenge to earn your badges.</p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
            <button
              onClick={handleJoin}
              disabled={joining || hasJoined}
              className="w-full md:w-auto min-w-[240px]"
            >
              <StarBorder as="div" color={hasJoined ? "emerald" : "purple"} speed="3s" thickness={2}>
                <span className="flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-white uppercase tracking-widest transition-all">
                  {joining ? "PROCESSING..." : hasJoined ? (
                    <>
                      <ShieldCheck className="h-5 w-5 text-emerald-400" />
                      ALREADY JOINED
                    </>
                  ) : "INITIATE CHALLENGE"}
                </span>
              </StarBorder>
            </button>

            {hasJoined && (
              <a
                href={challenge.hackerRankLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-all hover:scale-105"
              >
                HackerRank Arena
                <ExternalLink className="h-4 w-4 text-cyan-400" />
              </a>
            )}
          </div>

          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#06070f] bg-white/10 overflow-hidden">
                  <div className="w-full h-full bg-linear-to-br from-purple-500/20 to-cyan-500/20" />
                </div>
              ))}
            </div>
            <p className="text-xs font-medium text-white/30 uppercase tracking-[0.2em]">
              Join {challenge.participants || 0} others on this quest
            </p>
          </div>
        </div>
      </div>
    </StarfieldBackground>
  );
}
