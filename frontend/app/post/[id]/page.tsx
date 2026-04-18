"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPostById, addComment, toggleLike } from "@backend/db";
import { useAuth } from "@backend/AuthProvider";
import StarfieldBackground from "@/components/background/StarfieldBackground";
import { KineticCard, KineticPage } from "@/components/effects/KineticTransition";
import { 
  Heart, MessageSquare, Share2, ArrowLeft, 
  Send, UserCircle, Clock 
} from "lucide-react";
import "../../profile/profile.css";

export default function PostDetailPage() {
  const { id } = useParams();
  const { user, userData } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        const data = await getPostById(id as string);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!user || !post || isLiking) return;
    setIsLiking(true);
    try {
      await toggleLike(user.uid, post.id);
      setPost((prev: any) => ({ ...prev, like_count: prev.like_count + 1 }));
    } catch (err) {
      alert("Error liking post");
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async () => {
    if (!user || !commentText.trim() || !post) return;
    try {
      await addComment(user.uid, post.id, commentText, null);
      setPost((prev: any) => ({ ...prev, comment_count: prev.comment_count + 1 }));
      setCommentText("");
    } catch (err) {
      alert("Error adding comment");
    }
  };

  if (loading) {
    return (
      <StarfieldBackground className="min-h-screen flex items-center justify-center">
        <p className="text-cyan-500 animate-pulse tracking-[0.5em] uppercase font-bold">Synchronizing Synthesis...</p>
      </StarfieldBackground>
    );
  }

  if (!post) {
    return (
      <StarfieldBackground className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-black uppercase tracking-widest text-white/30 text-center">Data Packet Not Found</h1>
        <Link href="/main" className="btn-secondary px-8">Return to Central Hub</Link>
      </StarfieldBackground>
    );
  }

  return (
    <StarfieldBackground className="relative min-h-screen w-full bg-[#06070f] text-white">
      <KineticPage pageKey="post-detail" className="relative z-10 max-w-[800px] mx-auto px-4 py-12">
        
        {/* Navigation */}
        <nav className="mb-12">
          <Link
            href="/profile"
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 w-fit"
          >
            <ArrowLeft size={16} /> Back to Signal
          </Link>
        </nav>

        <KineticCard index={0}>
          <div className="stealth-card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <UserCircle size={24} className="text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-tight">Identity: {post.authorId}</h2>
                <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase font-bold tracking-widest">
                  <Clock size={12} /> {post.createdAt?.toDate().toLocaleDateString()}
                </div>
              </div>
            </div>

            <p className="text-lg leading-relaxed text-white/90 mb-8 font-medium">
              "{post.caption}"
            </p>

            <div className="flex items-center gap-6 pt-6 border-t border-white/5">
              <button 
                className={`post-action ${isLiking ? 'animate-pulse' : ''}`}
                onClick={handleLike}
              >
                <Heart size={20} className={(post.like_count || 0) > 0 ? 'text-red-500 fill-current' : ''} />
                <span className="font-bold">{post.like_count || 0}</span>
              </button>
              <button className="post-action">
                <MessageSquare size={20} />
                <span className="font-bold">{post.comment_count || 0}</span>
              </button>
              <button 
                className="post-action ml-auto text-cyan-400"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Post link copied to synthesis buffer.");
                }}
              >
                <Share2 size={20} />
                <span className="font-bold uppercase text-[10px]">Copy Link</span>
              </button>
            </div>
          </div>
        </KineticCard>

        {/* Comment Input */}
        <div className="mt-8">
          <KineticCard index={1}>
            <div className="stealth-card p-6">
              <h2 className="stealth-card__title">
                <Send size={18} /> Append Data
              </h2>
              <div className="flex gap-4">
                <textarea
                  className="form-textarea flex-1 min-h-[60px]"
                  placeholder="Share your perspective..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button 
                  className="btn-primary w-[100px]"
                  onClick={handleComment}
                  disabled={!user}
                >
                  Post
                </button>
              </div>
            </div>
          </KineticCard>
        </div>

      </KineticPage>
    </StarfieldBackground>
  );
}
