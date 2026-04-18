"use client";

import React, { useState, useEffect } from "react";
import { X, Send, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@backend/firebaseConfig";
import { addComment, getUserByIdentifier } from "@backend/db";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  userId: string;
}

interface Comment {
  id: string;
  user_id: string;
  text: string;
  created_at: any;
  is_deleted?: boolean;
}

export default function CommentModal({ isOpen, onClose, postId, userId }: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [userDataMap, setUserDataMap] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!isOpen || !postId) return;

    const q = query(
      collection(db, "comments"),
      where("post_id", "==", postId),
      where("parent_comment_id", "==", null),
      orderBy("created_at", "asc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(fetchedComments);

      const newUids = fetchedComments
        .map(c => c.user_id)
        .filter(uid => !userDataMap[uid]);
      
      if (newUids.length > 0) {
        const uniqueUids = Array.from(new Set(newUids));
        const newData: Record<string, any> = { ...userDataMap };
        await Promise.all(uniqueUids.map(async (uid) => {
          const data = await getUserByIdentifier(uid);
          if (data) newData[uid] = data;
        }));
        setUserDataMap(newData);
      }
    }, (err) => {
      console.error("Comments subscription error:", err);
    });

    return () => unsubscribe();
  }, [isOpen, postId, userDataMap]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isPosting || !userId) return;

    const commentText = newComment.trim();
    setNewComment("");
    
    // Optimistic Update
    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      user_id: userId,
      text: commentText,
      created_at: { toDate: () => new Date() },
      is_deleted: false,
    };
    
    setComments(prev => [...prev, optimisticComment]);

    // Background process
    addComment(userId, postId, commentText, null).catch(err => {
      console.error("Failed to sync comment:", err);
      // Remove optimistic comment on failure
      setComments(prev => prev.filter(c => c.id !== optimisticComment.id));
      setNewComment(commentText); // Restore input
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay overflow-hidden bg-black/80!" onClick={onClose}>
          <motion.div 
            className="modal-content max-w-[500px]! h-[80dvh]! flex flex-col p-0 border border-white/10 overflow-hidden bg-[#0a0c14]/40! backdrop-blur-2xl ring-1 ring-white/5 shadow-2xl"
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Glossy Header */}
            <div className="relative p-6 border-b border-white/5 flex items-center justify-between">
              <div className="absolute inset-0 bg-linear-to-r from-cyan-500/5 to-transparent pointer-events-none" />
              <div>
                <h2 className="text-xs uppercase tracking-[0.3em] font-black text-white/90 mb-1">Synthesis Thread</h2>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Synchronize Input</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="relative z-10 p-2 hover:bg-white/5 rounded-full transition-all text-white/40 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Discussion Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative">
              {/* Vertical Thread Line */}
              {comments.length > 1 && (
                <div className="absolute left-[44px] top-10 bottom-10 w-px bg-linear-to-b from-cyan-500/20 via-white/5 to-transparent pointer-events-none" />
              )}

              {comments.length > 0 ? (
                comments.map((comment, idx) => (
                  <motion.div 
                    key={comment.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex gap-5 group relative"
                  >
                    <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 shrink-0 flex items-center justify-center overflow-hidden ring-4 ring-black/40 shadow-xl transition-transform group-hover:scale-105">
                      {userDataMap[comment.user_id]?.profile_picture ? (
                        <img src={userDataMap[comment.user_id].profile_picture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User size={20} className="text-white/20" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.15em] glow-text">
                          {userDataMap[comment.user_id]?.username || "Anonymous Signal"}
                        </span>
                        <span className="text-[9px] text-white/10 font-bold uppercase tracking-widest">
                          {comment.is_deleted ? '[deleted]' : comment.created_at?.toDate?.().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="bg-white/3 p-4 rounded-2xl rounded-tl-none border border-white/5 transition-colors group-hover:border-cyan-500/20 group-hover:bg-white/5">
                        <p className="text-[13px] text-white/80 leading-relaxed font-medium">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10 text-center">
                  <div className="relative">
                    <Send size={48} className="mb-4 animate-bounce-subtle" />
                    <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20" />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black">Waiting for Data Entry</p>
                </div>
              )}
            </div>

            {/* Quantum Input Buffer */}
            <div className="p-6 bg-black/60 border-t border-white/5 relative">
              <div className="absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-cyan-500/30 to-transparent" />
              <form onSubmit={handleSubmit} className="relative group">
                <input
                  type="text"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Inject signal..."
                  className="w-full bg-[#11131a] border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm text-white placeholder:text-white/10 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 outline-none transition-all shadow-inner"
                />
                <button 
                  type="submit"
                  disabled={isPosting || !newComment.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-5 disabled:saturate-0 transition-all"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
