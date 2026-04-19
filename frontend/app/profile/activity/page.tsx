"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import StarfieldBackground from "@/components/background/StarfieldBackground";
import { KineticPage } from "@/components/effects/KineticTransition";
import { 
  Activity, ArrowLeft, Heart, MessageSquare, 
  UserPlus, Zap, History, Loader2, Sparkles,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@backend/AuthProvider";
import { getActivityLog, getPostById, getUserByIdentifier } from "@backend/db";
import "./activity.css";

// ─── Component ───
export default function ActivityPage() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataCache, setDataCache] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!user) return;

    const fetchActivity = async () => {
      try {
        if (!userData?.id) return;
        const { activities: log } = await getActivityLog(userData.id);
        
        // Enrich activities with target data (post snippets or user names)
        const enriched = await Promise.all(log.map(async (act: any) => {
          let extraData = null;
          if (act.target_type === 'post' && act.target_id && !dataCache[act.target_id]) {
            extraData = await getPostById(act.target_id);
          } else if (act.target_type === 'user' && act.target_id && !dataCache[act.target_id]) {
            extraData = await getUserByIdentifier(act.target_id);
          }
          return { ...act, extraData: extraData || dataCache[act.target_id] };
        }));

        setActivities(enriched);
      } catch (err) {
        console.error("Failed to fetch quantum footprints:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [user]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "like": 
      case "liked_post": return <Heart size={14} className="text-cyan-400" />;
      case "comment":
      case "commented": return <MessageSquare size={14} className="text-violet-400" />;
      case "reply":
      case "replied": return <MessageSquare size={14} className="text-purple-400" />;
      case "connection":
      case "sent_follow_request":
      case "accepted_follow": return <UserPlus size={14} className="text-emerald-400" />;
      default: return <Zap size={14} className="text-yellow-400" />;
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case "like":
      case "liked_post": return "Neural Synchronization (Like)";
      case "comment":
      case "commented": return "Signal Injection (Comment)";
      case "reply":
      case "replied": return "Reply Injected";
      case "connection":
      case "sent_follow_request":
      case "accepted_follow": return "Peer Connection Established";
      default: return "Unknown Activity";
    }
  };

  return (
    <StarfieldBackground className="relative min-h-screen w-full bg-[#06070f] text-white">
      <KineticPage pageKey="activity" className="relative z-10 w-full page-offset">
        
        <div className="activity-hub-container">
          {/* Header */}
          <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <Link
                href="/main"
                className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10"
              >
                <ArrowLeft size={16} /> Central Arena
              </Link>
              <div>
                <h1 className="text-4xl font-black tracking-tighter flex items-center gap-4">
                  Activity Hub <Activity className="text-cyan-500 animate-pulse" size={32} />
                </h1>
              </div>
            </div>
          </header>

          <div className="relative">
            {/* The Neural Thread */}
            {!loading && activities.length > 0 && <div className="activity-timeline-line" />}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-20 gap-4">
                <Loader2 className="animate-spin text-cyan-500" size={40} />
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Scanning Event Horizon...</span>
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((act, idx) => (
                  <motion.div 
                    key={act.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                    className="timeline-item"
                  >
                    {/* The Node */}
                    <div className="activity-node" />
                    
                    {/* The Card */}
                    <div className="activity-card-wrapper">
                      <div className="activity-stealth-card">
                        <span className={`activity-type-label type-${act.type}`}>
                          {getActivityIcon(act.type)} {getActivityLabel(act.type)}
                        </span>
                        
                        <div className="activity-content-text">
                          {act.type === "like" && (
                            <>You synchronized with a post: <span className="text-white">"{act.post_preview || act.extraData?.caption?.slice(0, 40) || "Data Buffer"}"</span></>
                          )}
                          {act.type === "comment" && (
                            <>You injected a signal <span className="text-white">"{act.text}"</span> into post: <span className="text-cyan-400/80 italic">"{act.post_preview || "Target Synthesis"}"</span></>
                          )}
                          {act.type === "connection" && (
                            <>You established a link with <span className="text-cyan-400 font-bold">{act.extraData?.username || "Participant"}</span></>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="activity-timestamp">
                            {act.created_at?.toDate().toLocaleDateString()} — {act.created_at?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="activity-stealth-card w-full p-20 flex flex-col items-center justify-center text-center opacity-30">
                <Sparkles size={48} className="mb-4 text-cyan-500" />
                <h3 className="text-xl font-bold uppercase tracking-widest text-white/50">Vacant Event Horizon</h3>
                <p className="text-xs max-w-sm mt-2">No activity signatures detected. Synthesize some engagement in the Arena to populate your log.</p>
              </div>
            )}
          </div>

          <footer className="mt-20 pt-10 border-t border-white/5 text-center">
            <p className="text-[9px] uppercase tracking-[0.5em] text-white/10 font-black italic">
              Quantum Synchronization Complete — Secure Footprint Analysis
            </p>
          </footer>
        </div>

      </KineticPage>
    </StarfieldBackground>
  );
}
