"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, User, ArrowRight, Loader2 } from "lucide-react";
import { searchUsersByPrefix } from "@backend/db";
import Link from "next/link";

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserSearchModal({ isOpen, onClose }: UserSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const triggerSearch = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const users = await searchUsersByPrefix(query);
        setResults(users);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(triggerSearch, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay z-100" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="modal-content max-w-md w-full"
      >
        <div className="modal-card border-cyan-500/20 shadow-[0_0_50px_-12px_rgba(6,182,212,0.2)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="modal-title mb-0 flex items-center gap-2">
              <Search size={20} className="text-cyan-400" /> Discovery Engine
            </h2>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
              {isLoading ? <Loader2 size={18} className="animate-spin text-cyan-500" /> : <Search size={18} />}
            </div>
            <input
              type="text"
              className="form-input pl-12! py-4! text-lg border-white/5 focus:border-cyan-500/50 bg-black/40 backdrop-blur-xl"
              placeholder="Search by identity name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="search-results max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
            {results.length > 0 ? (
              <div className="grid gap-2">
                {results.map((user) => (
                  <Link
                    key={user.id}
                    href={`/${user.name || user.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 overflow-hidden">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                        {user.username || "Anonymous Participant"}
                      </p>

                    </div>
                    <ArrowRight size={18} className="text-white/10 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            ) : query.length >= 2 && !isLoading ? (
              <div className="text-center py-10 opacity-30 italic text-sm">
                No matching identities found in the starfield.
              </div>
            ) : (
              <div className="text-center py-10 opacity-20 text-[10px] uppercase tracking-[0.3em] font-bold">
                Enter at least 2 characters to scan
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
