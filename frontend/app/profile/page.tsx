"use client";

import React, { useEffect } from "react";
import { useAuth } from "@backend/AuthProvider";
import { useRouter } from "next/navigation";
import ProfileView from "@/components/social/ProfileView";
import StarfieldBackground from "@/components/background/StarfieldBackground";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <StarfieldBackground className="flex items-center justify-center min-h-screen bg-[#06070f]">
        <Loader2 className="animate-spin text-cyan-500" size={32} />
      </StarfieldBackground>
    );
  }

  // Render the unified profile view for the current user
  return <ProfileView targetUserId={user.uid} isSelf={true} />;
}
