"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@backend/firebaseConfig";
import StarfieldBackground from "@/components/background/StarfieldBackground";
import { KineticCard, KineticPage } from "@/components/effects/KineticTransition";
import { Users, ArrowLeft, ArrowRight, UserCircle, UserPlus, UserMinus } from "lucide-react";
import { useAuth } from "@backend/AuthProvider";
import { followUser, unfollowUser, getFollowing } from "@backend/db";
import "../profile/profile.css";

interface UserProfile {
  uid: string;
  name?: string;
  email?: string;
  bio?: string;
  lastLogin?: any;
}

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsersAndFollowing = async () => {
      try {
        // Fetch all users
        const q = query(collection(db, "users"), orderBy("name", "asc"));
        const querySnapshot = await getDocs(q);
        const fetchedUsers: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
          fetchedUsers.push({ uid: doc.id, ...doc.data() });
        });
        setUsers(fetchedUsers);

        // Fetch following status if logged in
        if (user?.email) {
          const followingIds = await getFollowing(user.uid);
          setFollowingIds(new Set(followingIds));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndFollowing();
  }, [user]);

  const handleToggleFollow = async (targetId: string) => {
    if (!user?.email || actionLoading) return;
    setActionLoading(targetId);
    
    const isCurrentlyFollowing = followingIds.has(targetId);
    
    try {
      if (isCurrentlyFollowing) {
        await unfollowUser(user.uid, targetId);
        setFollowingIds(prev => {
          const next = new Set(prev);
          next.delete(targetId);
          return next;
        });
      } else {
        await followUser(user.uid, targetId);
        setFollowingIds(prev => new Set(prev).add(targetId));
      }
    } catch (err) {
      console.error("Connection error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <StarfieldBackground className="relative min-h-screen w-full bg-[#06070f] text-white">
      <KineticPage pageKey="users" className="relative z-10 w-full px-6 py-12 page-offset">
        
        {/* Navigation */}
        <nav className="max-w-[1200px] mx-auto mb-12 flex items-center justify-between">
          <Link
            href="/main"
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
          >
            <ArrowLeft size={16} /> Back to Arena
          </Link>
          <div className="text-right">
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-3 justify-end uppercase">
               Synthesized Directory <Users className="text-cyan-500" size={24} />
            </h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold mt-1">
              {users.length} Participants Connected
            </p>
          </div>
        </nav>

        <div className="max-w-[1200px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="stealth-card h-[200px] animate-pulse bg-white/5" />
              ))}
            </div>
          ) : users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((member, idx) => (
                <KineticCard key={member.uid} index={idx}>
                  <div className="stealth-card h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
                        <UserCircle size={24} />
                      </div>
                      <Link 
                        href={`/profile/${member.uid}`}
                        className="text-white/20 hover:text-cyan-400 transition-colors"
                      >
                        <ArrowRight size={20} />
                      </Link>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-1">{member.name || "Anonymous User"}</h3>
                    <p className="text-xs text-white/40 mb-4 truncate">
                      {member.email}
                    </p>
                    
                    <p className="text-sm text-white/60 line-clamp-2 italic mb-6">
                      "{member.bio || "This user's bio remains unsynthesized..."}"
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                      {user && user.uid !== member.uid ? (
                        <button 
                          className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold transition-colors ${
                            followingIds.has(member.uid) ? 'text-white/40 hover:text-red-400' : 'text-cyan-400 hover:text-cyan-300'
                          }`}
                          onClick={() => handleToggleFollow(member.uid)}
                          disabled={!!actionLoading}
                        >
                          {actionLoading === member.uid ? (
                            "Syncing..."
                          ) : followingIds.has(member.uid) ? (
                            <><UserMinus size={14} /> Disconnect</>
                          ) : (
                            <><UserPlus size={14} /> Connect</>
                          )}
                        </button>
                      ) : (
                        <span className="text-[10px] uppercase tracking-widest font-bold text-white/20">
                           {user?.uid === member.uid ? "You" : "Anonymous"}
                        </span>
                      )}
                      
                      <span className="text-[10px] text-white/20 font-medium">
                        ID: {member.uid.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </KineticCard>
              ))}
            </div>
          ) : (
            <div className="stealth-card p-20 flex flex-col items-center text-center opacity-40">
              <Users size={64} className="mb-6 text-cyan-500/50" />
              <h2 className="text-2xl font-bold mb-2">The Directory is Silent</h2>
              <p className="text-sm max-w-sm">
                No participants have synthesized their profiles yet. Be the first to emerge from the starfield.
              </p>
            </div>
          )}
        </div>
      </KineticPage>
    </StarfieldBackground>
  );
}
