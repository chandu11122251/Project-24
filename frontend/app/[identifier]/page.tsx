"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProfileView from "@/components/social/ProfileView";
import { getUserByIdentifier } from "@backend/db";
import StarfieldBackground from "@/components/background/StarfieldBackground";
import { Loader2 } from "lucide-react";

export default function UniversalProfilePage() {
  const params = useParams();
  const identifier = params.identifier as string;
  const [targetId, setTargetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const resolveUser = async () => {
      try {
        const decodedIdentifier = decodeURIComponent(identifier);
        const user = await getUserByIdentifier(decodedIdentifier);
        if (user) {
          setTargetId(user.id);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Resolution failed:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    resolveUser();
  }, [identifier]);

  if (loading) {
    return (
      <StarfieldBackground className="flex items-center justify-center min-h-screen bg-[#06070f] page-offset">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-cyan-500" size={40} />
          <p className="text-[10px] uppercase tracking-[0.5em] text-cyan-400 font-bold animate-pulse">Scanning Starfield...</p>
        </div>
      </StarfieldBackground>
    );
  }

  if (error || !targetId) {
    return (
      <StarfieldBackground className="flex items-center justify-center min-h-screen bg-[#06070f] page-offset">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white/20 uppercase tracking-tighter mb-4">404: Identity Not Found</h1>
          <p className="text-sm text-white/40">The user "{identifier}" does not exist in this sector.</p>
        </div>
      </StarfieldBackground>
    );
  }

  return <ProfileView targetUserId={targetId} />;
}
