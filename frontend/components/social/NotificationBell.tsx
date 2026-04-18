"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, User, MessageSquare, ArrowRight, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "@backend/firebaseConfig";
import { markNotificationsRead } from "@backend/db";
import Link from "next/link";

interface NotificationBellProps {
  userId: string;
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Fetch notifications with polling (avoids onSnapshot crash cascade)
  // Note: onSnapshot for this query requires a composite index (user_id + created_at desc).
  // If the index doesn't exist, onSnapshot crashes Firestore's internal watch stream,
  // killing ALL other listeners. Using getDocs + polling isolates any failures.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    const fetchNotifications = async () => {
      try {
        const q = query(
          collection(db, "notifications"),
          where("user_id", "==", userId),
          orderBy("created_at", "desc"),
          limit(20)
        );
        const snapshot = await getDocs(q);
        if (!cancelled) {
          const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setNotifications(docs);
        }
      } catch (err: any) {
        // Fail silently — don't crash other Firestore listeners
        if (err?.message?.includes("index")) {
          console.warn("[Notifications] Missing Firestore composite index. Create it in Firebase Console.");
        } else {
          console.error("[Notifications] Fetch error:", err);
        }
      }
    };

    // Initial fetch
    fetchNotifications();

    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [userId]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleOpen = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      await markNotificationsRead(userId);
    }
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className={`settings-btn relative ${unreadCount > 0 ? 'text-cyan-400 border-cyan-500/30' : ''}`}
        onClick={handleOpen}
      >
        <Bell size={20} className={unreadCount > 0 ? "animate-pulse" : ""} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-600 border-2 border-[#0a0e1a] rounded-full text-[10px] font-black flex items-center justify-center text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="dropdown-menu w-[320px]! p-0! overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 bg-white/2 flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-[0.2em] font-black text-white/40">Neural Signals</h3>
              {unreadCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
                  <CheckCheck size={12} /> Syncing
                </span>
              )}
            </div>

            <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <Link
                    key={notif.id}
                    href={notif.post_id ? `/post/${notif.post_id}` : `/${notif.source_user_id || ''}`}
                    onClick={() => setIsOpen(false)}
                    className={`flex gap-3 p-4 border-b border-white/5 transition-all hover:bg-white/3 ${!notif.is_read ? 'bg-cyan-500/3 border-l-2 border-l-cyan-500' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.type === 'connection' ? 'bg-purple-500/10 text-purple-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                      {notif.type === 'follow_accept' || notif.type === 'follow_request' ? <User size={18} /> : <MessageSquare size={18} />}
                    </div>
                    <div className="flex-1 overflow-hidden">
                       <p className={`text-xs leading-relaxed ${!notif.is_read ? 'text-white font-bold' : 'text-white/60'}`}>
                         {notif.type === 'like' ? 'Someone liked your post' : notif.type === 'comment' ? 'Someone commented' : notif.type === 'follow_accept' ? 'Someone followed you' : notif.type}
                      </p>
                      <p className="text-[9px] uppercase tracking-wider text-white/20 mt-1">
                         {notif.created_at?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Just now'}
                      </p>
                    </div>
                    <div className="flex items-center text-white/10">
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-12 text-center opacity-20">
                  <Bell size={32} className="mx-auto mb-3 opacity-20" />
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold">No active signals</p>
                </div>
              )}
            </div>
            
            <div className="p-3 bg-black/40 text-center">
               <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/20">Frequency: Starfield-24hz</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
