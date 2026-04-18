"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import StarfieldBackground from "@/components/background/StarfieldBackground";
import { KineticCard, KineticPage } from "@/components/effects/KineticTransition";
import { 
  ArrowLeft, Send, Search, MoreVertical, MessageSquare, 
  Pin, Ban, ShieldAlert, UserX, Ghost
} from "lucide-react";
import "./messaging.css";

// ─── Mock Data ───
const INITIAL_FRIENDS = [
  { id: 1, name: "Astrid", status: "online", lastMsg: "Hey, did you see the new puzzles?", color: "#3b82f6" },
  { id: 2, name: "Nova", status: "online", lastMsg: "Great work on the Sudoku logic!", color: "#ec4899" },
  { id: 3, name: "Cosmo", status: "offline", lastMsg: "Let me know when you're free to study.", color: "#10b981" },
  { id: 4, name: "Luna", status: "online", lastMsg: "Project-24 is looking amazing.", color: "#f59e0b" },
  { id: 5, name: "Sol", status: "offline", lastMsg: "Check out the new starfield drift.", color: "#8b5cf6" },
];

const MOCK_MESSAGES = [
  { id: 1, text: "Hey Silven! How's the Project-24 integration going?", sender: "Astrid", time: "10:30 AM" },
  { id: 2, text: "It's going great! Just added the messaging hub.", sender: "You", time: "10:32 AM" },
  { id: 3, text: "That's awesome. I love the Stealth aesthetic you're using.", sender: "Astrid", time: "10:33 AM" },
  { id: 4, text: "Thanks! I'm trying to keep it consistent across all pages.", sender: "You", time: "10:35 AM" },
];

export default function MessagingPage() {
  const [selectedFriend, setSelectedFriend] = useState<typeof INITIAL_FRIENDS[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  
  // Interactive State
  const [pinnedIds, setPinnedIds] = useState<Set<number>>(new Set());
  const [blockedIds, setBlockedIds] = useState<Set<number>>(new Set());
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);

  // Computed Friends List (Sorted by Pin)
  const sortedFriends = [...INITIAL_FRIENDS].sort((a, b) => {
    const aPinned = pinnedIds.has(a.id);
    const bPinned = pinnedIds.has(b.id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });

  const filteredFriends = sortedFriends.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePin = (id: number) => {
    const newPinned = new Set(pinnedIds);
    if (newPinned.has(id)) newPinned.delete(id);
    else newPinned.add(id);
    setPinnedIds(newPinned);
    setHeaderMenuOpen(false);
  };

  const toggleBlock = (id: number) => {
    const newBlocked = new Set(blockedIds);
    if (newBlocked.has(id)) newBlocked.delete(id);
    else newBlocked.add(id);
    setBlockedIds(newBlocked);
    setHeaderMenuOpen(false);
  };

  const isBlocked = selectedFriend ? blockedIds.has(selectedFriend.id) : false;
  const isPinned = selectedFriend ? pinnedIds.has(selectedFriend.id) : false;

  return (
    <StarfieldBackground className="relative min-h-screen w-full bg-[#06070f] text-white">
      <KineticPage pageKey="messaging" className="relative z-10 w-full px-6 py-8 page-offset">
        
        {/* Header/Nav */}
        <nav className="flex items-center justify-between mb-8">
          <Link
            href="/profile"
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
          >
            <ArrowLeft size={16} /> Back to Profile
          </Link>
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-bold tracking-tight">Messaging Hub</h1>
            <span className="text-[10px] uppercase tracking-widest text-cyan-400/60 font-bold">Secure Synthesis</span>
          </div>
          <div className="w-[120px]" /> {/* Spacer for balance */}
        </nav>

        <div className="messaging-container">
          
          {/* Friends Sidebar */}
          <aside className="friends-pane">
            <div className="pane-header">
              <span className="text-xs font-bold uppercase tracking-widest text-white/30">Conversations</span>
              <button className="text-white/30 hover:text-white transition-colors">
                <Search size={18} />
              </button>
            </div>
            
            <div className="px-4 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                <input 
                  type="text" 
                  placeholder="Search friends..." 
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-cyan-500/30"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="friends-scroller">
              {filteredFriends.map((friend, idx) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`chat-thread-item 
                    ${selectedFriend?.id === friend.id ? 'chat-thread-item--active' : ''}
                    ${blockedIds.has(friend.id) ? 'chat-thread-item--blocked' : ''}
                  `}
                  onClick={() => setSelectedFriend(friend)}
                >
                  <div className="thread-avatar">
                    <span className="text-sm font-bold opacity-60" style={{ color: friend.color }}>{friend.name[0]}</span>
                    <div className={`status-indicator ${friend.status === 'offline' ? 'status-indicator--offline' : ''}`} />
                  </div>
                  <div className="thread-info">
                    <span className="thread-name">{friend.name}</span>
                    <span className="thread-preview">{blockedIds.has(friend.id) ? "[User Blocked]" : friend.lastMsg}</span>
                  </div>
                  {pinnedIds.has(friend.id) && <Pin size={14} className="pin-indicator" />}
                </motion.div>
              ))}
            </div>
          </aside>

          {/* Main Chat Area */}
          <main className="chat-pane">
            <AnimatePresence mode="wait">
              {selectedFriend ? (
                <motion.div 
                  key={selectedFriend.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col h-full"
                >
                  {/* Chat Header */}
                  <div className="chat-header">
                    <div className="thread-avatar">
                      <span className="text-sm font-bold opacity-60" style={{ color: selectedFriend.color }}>{selectedFriend.name[0]}</span>
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-white block">{selectedFriend.name}</span>
                      <span className="text-[10px] uppercase text-emerald-400 font-bold tracking-widest">{selectedFriend.status}</span>
                    </div>
                    
                    {/* Header Menu */}
                    <div className="header-menu-container">
                      <button 
                        className="text-white/30 hover:text-white transition-colors"
                        onClick={() => setHeaderMenuOpen(!headerMenuOpen)}
                      >
                        <MoreVertical size={22} />
                      </button>
                      <AnimatePresence>
                        {headerMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="dropdown-menu"
                          >
                            <div className="dropdown-item" onClick={() => togglePin(selectedFriend.id)}>
                              <Pin size={16} />
                              {isPinned ? "Unpin Chat" : "Pin Chat"}
                            </div>
                            <div className="dropdown-item dropdown-item--danger" onClick={() => toggleBlock(selectedFriend.id)}>
                              <UserX size={16} />
                              {isBlocked ? "Unblock User" : "Block User"}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Messages Feed */}
                  <div className="chat-messages">
                    {MOCK_MESSAGES.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`message-bubble ${msg.sender === 'You' ? 'message-bubble--sent' : 'message-bubble--received'}`}
                      >
                        {msg.text}
                        <div className={`text-[9px] mt-1 opacity-40 text-right ${msg.sender === 'You' ? 'text-black' : 'text-white'}`}>
                          {msg.time}
                        </div>
                      </div>
                    ))}
                    {!isBlocked && (
                      <div className="message-bubble message-bubble--received italic opacity-50">
                        Mock conversation with {selectedFriend.name} initialized...
                      </div>
                    )}
                  </div>

                  {/* Input Area or Blocked Overlay */}
                  {isBlocked ? (
                    <div className="blocked-overlay">
                      <ShieldAlert size={32} />
                      <span>You have blocked this user. Unblock to resume synthesis.</span>
                      <button 
                        className="text-cyan-400 text-xs font-bold uppercase tracking-widest mt-2 hover:underline"
                        onClick={() => toggleBlock(selectedFriend.id)}
                      >
                        Unblock Now
                      </button>
                    </div>
                  ) : (
                    <div className="chat-input-area">
                      <input 
                        type="text" 
                        placeholder={`Message ${selectedFriend.name}...`}
                        className="chat-input"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && setNewMessage("")}
                      />
                      <button className="btn-send" onClick={() => setNewMessage("")}>
                        <Send size={18} className="-rotate-12" />
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="chat-empty-state">
                  <div className="chat-empty-icon">
                    <Ghost size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white/50">Your Conversations</h3>
                  <p className="max-w-[280px] text-sm text-white/20">
                    Select a friend from the left sidebar to start a new peer-to-peer synthesized session.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </main>

        </div>
      </KineticPage>
    </StarfieldBackground>
  );
}
