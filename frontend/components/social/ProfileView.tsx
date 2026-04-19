"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import StarfieldBackground from "@/components/background/StarfieldBackground";
import { KineticCard, KineticPage } from "@/components/effects/KineticTransition";
import { 
  Users, Info, MessageSquare, Heart, Share2, ArrowLeft, ArrowRight,
  Settings, PlusCircle, UserCircle, Shield, Activity, LogOut,
  X, Trash2, Send, UserMinus, UserCheck, Search
} from "lucide-react";
import { useAuth } from "@backend/AuthProvider";
import { 
  updateUserProfile, createPost, getActivityLog, toggleLike,
  getFollowing, deletePost, getRelationshipStatus, followUser, unfollowUser,
  getUserByIdentifier, checkIfLiked
} from "@backend/db";
import { useRouter } from "next/navigation";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@backend/firebaseConfig";
import UserSearchModal from "./UserSearchModal";
import NotificationBell from "./NotificationBell";
import CommentModal from "./CommentModal";
import "../../app/profile/profile.css";

interface ProfileViewProps {
  targetUserId: string;
  isSelf?: boolean;
}

export default function ProfileView({ targetUserId, isSelf: initialIsSelf }: ProfileViewProps) {
  const router = useRouter();
  const { user, userData: currentUserData, loading: authLoading } = useAuth();
  
  // Modals state
  const [menuOpen, setMenuOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newPostModalOpen, setNewPostModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  // Profile data state
  const [targetUserData, setTargetUserData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [relStatus, setRelStatus] = useState<'none' | 'following' | 'follower' | 'friends' | 'self' | 'loading'>('loading');
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // Input states
  const [tempUsername, setTempUsername] = useState("");
  const [tempAbout, setTempAbout] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const isSelf = user?.uid === targetUserId;

  // 1. Fetch Target User Data & Permissions
  useEffect(() => {
    const initProfile = async () => {
      if (isSelf && user) {
        // For self-profile, sync from AuthProvider's live userData
        // Guard: skip if currentUserData hasn't loaded yet
        if (currentUserData) {
          setTargetUserData({ ...currentUserData, id: user.uid });
        }
        setRelStatus('self');
      } else if (targetUserId) {
        // Fetch target user metadata
        const data = await getUserByIdentifier(targetUserId);
        setTargetUserData(data);
        
        if (user) {
          const status = await getRelationshipStatus(user.uid, targetUserId);
          setRelStatus(status);
        }
      }
    };
    initProfile();
  }, [targetUserId, user, currentUserData, isSelf]);

  // 2. Real-time subscriptions
  useEffect(() => {
    if (!targetUserId) return;

    // Posts Subscription
    const q = query(
      collection(db, "posts"),
      where("user_id", "==", targetUserId),
      where("is_deleted", "==", false),
      orderBy("created_at", "desc")
    );
    const unsubscribePosts = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().created_at?.toDate().toLocaleDateString() || "Just now"
      }));
      setPosts(fetchedPosts);
      checkPostLikes(fetchedPosts);
    }, (err) => {
      console.error("Posts subscription error:", err);
    });

    // 3. Initial Likes Check for the current user
    const checkPostLikes = async (pList: any[]) => {
      if (!user) return;
      const statusMap: Record<string, boolean> = {};
      await Promise.all(pList.map(async (p) => {
        statusMap[p.id] = await checkIfLiked(user.uid, p.id);
      }));
      setLikedPosts(prev => ({ ...prev, ...statusMap }));
    };

    // Note: This logic is a bit intensive; ideally we'd track this differently, but for now it works for small lists.
    // We trigger it once the posts are initially loaded.

    // Following/Connections Subscription
    const relQ = query(
      collection(db, "follows"),
      where("follower_id", "==", targetUserId),
      where("status", "==", "accepted")
    );
    const unsubscribeRel = onSnapshot(relQ, async () => {
      try {
        const list = await getFollowing(targetUserId);
        setFollowing(list);
      } catch (err) {
        console.error("Error refreshing following:", err);
      }
    }, (err) => {
      console.error("Relationships subscription error:", err);
    });

    return () => {
      unsubscribePosts();
      unsubscribeRel();
    };
  }, [targetUserId]);

  // For self-profile, prefer live AuthProvider data over cached targetUserData
  const displayData = isSelf && currentUserData ? currentUserData : targetUserData;
  const username = displayData?.username || "Guest";
  const aboutMe = displayData?.bio || "No biography available. Synthesize your story...";
  const avatarInitial = username[0]?.toUpperCase() || "U";
  const profilePhoto = displayData?.profile_picture;
  
  const handleSaveProfile = async () => {
    if (!user?.uid) return;
    setIsSaving(true);
    try {
      await updateUserProfile(user.uid, {
        username: tempUsername,
        bio: tempAbout
      });
      setEditModalOpen(false);
      // Update local state if it's the current user's profile
      if (isSelf) {
        setTargetUserData((prev: any) => ({ ...prev, username: tempUsername, bio: tempAbout }));
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };
  const handleToggleFollow = async () => {
    if (!user?.uid || !targetUserId || isSelf) return;
    try {
      if (relStatus === 'none' || relStatus === 'follower') {
        await followUser(user.uid, targetUserId);
      } else {
        await unfollowUser(user.uid, targetUserId);
      }
      const status = await getRelationshipStatus(user.uid, targetUserId);
      setRelStatus(status);
    } catch (err) {
      console.error("Interaction failed:", err);
    }
  };

  const handleToggleLike = async (postId: string) => {
    if (!user?.uid) return;
    
    // Optimistic Update: Status
    const currentlyLiked = likedPosts[postId];
    setLikedPosts(prev => ({ ...prev, [postId]: !currentlyLiked }));
    
    // Optimistic Update: Count in the posts array
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { 
          ...p, 
          like_count: currentlyLiked ? (p.like_count || 1) - 1 : (p.like_count || 0) + 1 
        };
      }
      return p;
    }));
    
    // Background interaction - do not block
    toggleLike(user.uid, postId).catch(err => {
      // Revert if failed
      setLikedPosts(prev => ({ ...prev, [postId]: currentlyLiked }));
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { 
            ...p, 
            like_count: currentlyLiked ? (p.like_count || 0) + 1 : (p.like_count || 1) - 1 
          };
        }
        return p;
      }));
      console.error("Like synchronization failed:", err);
    });
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !user?.uid || isPosting) return;
    setIsPosting(true);
    try {
      await createPost(user.uid, { caption: newPostContent });
      setNewPostContent("");
      setNewPostModalOpen(false);
    } catch (err) {
      alert("Synthesis failed.");
    } finally {
      setIsPosting(false);
    }
  };

  const menuItems = [
    { label: "New Post", icon: <PlusCircle size={18} />, action: () => setNewPostModalOpen(true) },
    { label: "Edit Profile", icon: <UserCircle size={18} />, action: () => { setTempUsername(username); setTempAbout(aboutMe); setEditModalOpen(true); } },
    { label: "Activity Log", icon: <Activity size={18} />, action: () => router.push("/profile/activity") },
    { label: "Privacy Policy", icon: <Shield size={18} />, action: () => setPrivacyModalOpen(true) },
    { label: "Log out", icon: <LogOut size={18} />, action: () => window.location.href = "/", danger: true },
  ];

  return (
    <StarfieldBackground className="relative min-h-screen w-full bg-[#06070f] text-white overflow-x-hidden">
      <KineticPage pageKey={`profile-${targetUserId}`} className="relative z-10 w-full px-4 py-8 page-offset">
        
        {/* Centralized Header Layer — Aligns with the profile-container grid */}
        <div className="profile-container relative py-2">
          {/* Top Navbar */}
          <nav className="absolute top-0 left-4 z-50 flex items-center gap-4">
            <Link
              href="/main"
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
            >
              <ArrowLeft size={16} /> Arena
            </Link>
          </nav>

          {/* Action Header */}
          <div className="absolute top-0 right-4 z-50 flex gap-3">
            <button className="settings-btn" onClick={() => setSearchModalOpen(true)}>
              <Search size={20} />
            </button>
            
            <Link href="/profile/messaging" className="settings-btn">
              <Send size={20} />
            </Link>

            {user && <NotificationBell userId={user.uid} />}
            
            {isSelf && (
              <div className="relative">
                <button className="settings-btn" onClick={() => setMenuOpen(!menuOpen)}>
                  <Settings size={22} />
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="dropdown-menu"
                    >
                      {menuItems.map((item, idx) => (
                        <div 
                          key={idx} 
                          className={`dropdown-item ${item.danger ? 'dropdown-item--danger' : ''}`}
                          onClick={() => { item.action(); setMenuOpen(false); }}
                        >
                          {item.icon}
                          {item.label}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        <div className="profile-container mt-12">
          <header className="profile-header">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full rounded-full bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-4xl font-bold">
                    {avatarInitial}
                  </div>
                )}
              </div>
            </div>
            
            <h1 className="profile-username">{username}</h1>
            <p className="profile-handle">@{username.toLowerCase().replace(/\s+/g, '_')}</p>

            {/* Interaction Row for Guest View */}
            {!isSelf && user && (
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={handleToggleFollow}
                  className={`btn-primary py-2! px-6! flex items-center gap-2 ${relStatus === 'friends' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : ''}`}
                >
                  {relStatus === 'friends' ? <><UserCheck size={18} /> Friends</> : 
                   relStatus === 'following' ? <><UserMinus size={18} /> Unfollow</> : 
                   <><PlusCircle size={18} /> Add Friend</>}
                </button>
                <button className="settings-btn h-10 w-10">
                  <MessageSquare size={18} />
                </button>
              </div>
            )}
            
              <div className="text-center group cursor-pointer">
                <div className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-widest">{following.length}</div>
                <div className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/30">Connections</div>
              </div>
          </header>

          <div className="profile-grid">
            <aside className="flex flex-col gap-8">
              <KineticCard index={1}>
                <div className="stealth-card h-full">
                  <h2 className="stealth-card__title">
                    <Users size={18} /> {isSelf ? "Your Connections" : "Mutual Buffer"}
                  </h2>
                  <div className="friends-list">
                    {following.length > 0 ? following.map(friend => (
                      <Link key={friend.id} href={`/${friend.id}`} className="friend-item group">
                        <div className="friend-avatar bg-cyan-500/10 border border-cyan-500/20 overflow-hidden">
                          {friend.profile_picture ? (
                            <img src={friend.profile_picture} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-sm font-bold text-cyan-400">{friend.username?.[0] || 'U'}</span>
                          )}
                        </div>
                        <span className="friend-name group-hover:text-cyan-400 transition-colors">
                          {friend.username || "Synthesizing..."}
                        </span>
                        <UserCheck size={14} className="ml-auto text-cyan-500/40" />
                      </Link>
                    )) : (
                      <div className="py-4 text-center opacity-30">
                        <p className="text-[10px] uppercase tracking-widest font-bold">No Connections Signal</p>
                      </div>
                    )}
                  </div>
                </div>
              </KineticCard>

              <KineticCard index={2}>
                <div className="stealth-card h-full">
                  <h2 className="stealth-card__title">
                    <Info size={18} /> {isSelf ? "My Bio" : `About ${username}`}
                  </h2>
                  <p className="about-text">{aboutMe}</p>
                </div>
              </KineticCard>
            </aside>

            <main className="posts-feed">
              <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mb-2 ml-4">Latest Syntheses</h2>
              {posts.length > 0 ? posts.map((post, idx) => (
                <KineticCard key={post.id} index={idx + 3}>
                  <div className="stealth-card post-card h-full">
                    <div className="post-header">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
                        {profilePhoto ? <img src={profilePhoto} alt="" className="w-full h-full object-cover" /> : avatarInitial}
                      </div>
                      <div className="post-meta">
                        <span className="post-author">{username}</span>
                        <span className="post-date">{post.date}</span>
                      </div>
                    </div>
                    <p className="post-content">{post.caption}</p>
                    <div className="post-footer">
                      <button className="post-action group" onClick={() => handleToggleLike(post.id)}>
                        <Heart size={16} className={likedPosts[post.id] ? "text-red-500 fill-current" : ""} /> {post.like_count || 0}
                      </button>
                      <button 
                        className="post-action" 
                        onClick={() => { setActiveCommentPostId(post.id); setCommentModalOpen(true); }}
                      >
                        <MessageSquare size={16} /> {post.comment_count || 0}
                      </button>
                    </div>
                  </div>
                </KineticCard>
              )) : (
                <div className="text-center py-24 opacity-20">
                  <p className="text-sm italic">No data layers synthesized by this identity.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </KineticPage>

      <AnimatePresence>
        {searchModalOpen && <UserSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />}
        
        {editModalOpen && (
          <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
            <motion.div className="modal-content" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="modal-card">
                <h2 className="modal-title">Sync Identity</h2>
                <input className="form-input mb-4" value={tempUsername} onChange={e => setTempUsername(e.target.value)} placeholder="Synthesis Name" />
                <textarea className="form-textarea mb-6" value={tempAbout} onChange={e => setTempAbout(e.target.value)} placeholder="Identity Story" />
                
                {isSelf && posts.length > 0 && (
                  <div className="mt-2">
                    <h3 className="manage-section-title">Manage Syntheses</h3>
                    <div className="manage-posts-list">
                      {posts.map(p => (
                        <div key={p.id} className="manage-post-item">
                          <span className="manage-post-item__text">{p.caption}</span>
                          <button 
                            className="btn-delete-post" 
                            onClick={() => deletePost(p.id, user!.uid)}
                            title="Delete synthesis"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button className="btn-primary" onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? "Uploading..." : "Publish Identity"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {newPostModalOpen && (
          <div className="modal-overlay" onClick={() => setNewPostModalOpen(false)}>
            <motion.div className="modal-content" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="modal-card">
                <h2 className="modal-title">New Synthesis</h2>
                <textarea className="form-textarea mb-4" value={newPostContent} onChange={e => setNewPostContent(e.target.value)} placeholder="Input data content..." />
                <button className="btn-primary" onClick={handleCreatePost} disabled={isPosting}>Post to Flux</button>
              </div>
            </motion.div>
          </div>
        )}
        {privacyModalOpen && (
          <div className="modal-overlay" onClick={() => setPrivacyModalOpen(false)}>
            <motion.div className="modal-content" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="modal-card max-w-[500px]">
                <h2 className="modal-title">Privacy Protocol</h2>
                <div className="text-xs text-white/60 leading-relaxed space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  <p><strong className="text-cyan-400">1. Data Synthesis:</strong> We only collect the minimal metadata required to synchronize your identity across the starfield. This includes your name, bio, and social connections.</p>
                  <p><strong className="text-cyan-400">2. Neural Signals:</strong> Your notifications and interactions are stored in encrypted buffers and are only accessible to you and the relevant recipient.</p>
                  <p><strong className="text-cyan-400">3. Erasure:</strong> You retain full sovereignty over your data. Deleting a post or identity removes its record from the active synthesis flux.</p>
                  <p><strong className="text-cyan-400">4. Transparency:</strong> Project-24 is a peer-to-peer ecosystem. Your data is never sold to external sectors.</p>
                </div>
                <button className="btn-primary mt-8" onClick={() => setPrivacyModalOpen(false)}>Confirm Understanding</button>
              </div>
            </motion.div>
          </div>
        )}
        {commentModalOpen && activeCommentPostId && (
          <CommentModal 
            isOpen={commentModalOpen} 
            onClose={() => setCommentModalOpen(false)} 
            postId={activeCommentPostId} 
            userId={user?.uid || ""}
          />
        )}
      </AnimatePresence>
    </StarfieldBackground>
  );
}
