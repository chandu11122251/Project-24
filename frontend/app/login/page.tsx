"use client";

import { useState, FormEvent, useEffect } from "react";
import { useAuth } from "@backend/AuthProvider";
import { TransitionLink } from "@/components/effects/TransitionLink";
import { KineticCard, KineticPage } from "@/components/effects/KineticTransition";
import { useRouter } from "next/navigation";
import StarfieldBackground from "@/components/background/StarfieldBackground";
import BorderGlow from "@/components/effects/BorderGlow";

// Firebase integration
import { signInWithGoogle, signInWithGithub } from "@backend/auth";
import { motion, AnimatePresence } from "motion/react";

export default function LoginPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Synchronized Redirection: Wait for identity synthesis (both Auth and Firestore)
  useEffect(() => {
    if (user && userData && !authLoading) {
      router.push("/main");
    }
  }, [user, userData, authLoading, router]);

  const [email, setEmail] = useState("");

  // OTP state
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  // Social Auth Rate Limiting state
  const [socialLocked, setSocialLocked] = useState(false);

  /* ─── Handlers ─── */
  const initiateOtpFlow = async (targetEmail: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);
      
      setPendingEmail(targetEmail);
      setOtpModalOpen(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await initiateOtpFlow(email);
  };

  const verifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/auth/verify-otp", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ email: pendingEmail, otp: otpCode })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);

      // Now we have the magical custom token!
      const { signInWithCustomAuthToken } = await import("@backend/auth");
      await signInWithCustomAuthToken(data.customToken);
      
      setOtpModalOpen(false);
      // Force redirect to prevent UI hanging
      router.push("/main");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const withSocialRateLimit = async (providerFn: () => Promise<void>) => {
    if (socialLocked) return;
    setSocialLocked(true);
    await providerFn();
    // Unlock after 3 seconds
    setTimeout(() => setSocialLocked(false), 3000);
  };

  const handleGoogleLogin = async () => {
    await withSocialRateLimit(async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await signInWithGoogle();
        if (result) {
          router.push("/main");
        }
      } catch (err: any) {
        setError(err.message || "Sign-in failed. Please try again.");
      } finally {
        setLoading(false);
      }
    });
  };

  const handleGithubLogin = async () => {
    await withSocialRateLimit(async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await signInWithGithub();
        if (result) {
          router.push("/main");
        }
      } catch (err: any) {
        setError(err.message || "Sign-in failed. Please try again.");
      } finally {
        setLoading(false);
      }
    });
  };

  /* ─── Shared styles ─── */
  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all text-sm font-medium";
  const submitClass =
    "w-full py-3 rounded-lg bg-teal-500/80 hover:bg-teal-400 text-white font-semibold shadow-[0_0_15px_rgba(0,229,195,0.4)] hover:shadow-[0_0_25px_rgba(0,229,195,0.6)] transition-all text-sm";
  const oauthClass =
    "flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-white/5 border border-white/10 text-white/90 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium";

  return (
    <StarfieldBackground>
      <KineticPage 
        pageKey="login" 
        className="flex min-h-screen w-full items-center justify-center p-6 relative z-10"
        suppressHydrationWarning
      >
        <KineticCard index={0} className="w-full max-w-[420px]">
          <BorderGlow
            edgeSensitivity={30}
            glowColor="40 80 80"
            backgroundColor="#060010"
            borderRadius={24}
            glowRadius={28}
            glowIntensity={0.75}
            coneSpread={24}
            animated={false}
            colors={["#67e8f9", "#22d3ee", "#06b6d4"]}
            className="relative z-10 w-full max-w-[420px]"
          >
            <main className="flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-white backdrop-blur-md shadow-2xl relative">
              {/* OTP Verification Modal */}
              <AnimatePresence>
                {otpModalOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 rounded-2xl"
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.95, opacity: 0, y: 10 }}
                      className="w-full max-w-sm rounded-xl border border-white/10 bg-[#060010] p-6 shadow-2xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-teal-500 via-cyan-400 to-blue-500" />
                      
                      <h2 className="text-xl font-bold text-white mb-2">Verify Identity</h2>
                      <p className="text-zinc-400 text-xs mb-6">
                        We sent a 6-digit verification code to <span className="text-teal-400 font-bold">{pendingEmail}</span>.
                      </p>

                      <form onSubmit={verifyOtp} className="space-y-4">
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            maxLength={6}
                            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-teal-400 text-center tracking-[0.5em] font-mono text-xl"
                            placeholder="000000"
                            required
                          />
                        </div>
                        
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setOtpModalOpen(false)}
                            className="w-full py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all text-sm font-medium border border-white/10"
                            disabled={loading}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="w-full py-3 rounded-lg bg-teal-500/80 hover:bg-teal-400 text-white font-semibold transition-all text-sm shadow-[0_0_15px_rgba(0,229,195,0.4)]"
                            disabled={loading}
                          >
                            {loading ? "Verifying..." : "Verify"}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

                <div className="w-full space-y-6 transition-all duration-300">
                  <div className="space-y-2 text-center w-full">
                    <h1 className="text-3xl font-bold tracking-tight text-white/90">
                      Welcome
                    </h1>
                    <p className="text-sm text-zinc-400">
                      Sign in or create an account
                    </p>
                  </div>

                  {/* OAuth */}
                  <div className="flex flex-col gap-3 w-full">
                    {error && (
                      <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <p className="text-red-400 text-xs font-bold uppercase tracking-widest text-center">
                          {error}
                        </p>
                      </div>
                    )}
                    
                    <button 
                      id="google-login-btn"
                      type="button" 
                      className={`${oauthClass} ${socialLocked || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={handleGoogleLogin}
                      disabled={socialLocked || loading}
                    >
                      {/* Google SVG */}
                      <svg width="18" height="18" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                        <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.97-6.19a24.014 24.014 0 0 0 0 21.56l7.97-6.19z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                      </svg>
                      {loading && socialLocked ? "Authenticating..." : "Continue with Google"}
                    </button>

                    <button 
                      id="github-login-btn"
                      type="button" 
                      className={`${oauthClass} ${socialLocked || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={handleGithubLogin}
                      disabled={socialLocked || loading}
                    >
                      {/* GitHub SVG */}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                      </svg>
                      {loading && socialLocked ? "Authenticating..." : "Continue with GitHub"}
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 w-full">
                    <hr className="flex-1 border-white/10" />
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">
                      or continue with email
                    </span>
                    <hr className="flex-1 border-white/10" />
                  </div>

                  {/* Magic Email Form */}
                  <form onSubmit={handleEmailAuth} className="w-full space-y-4" suppressHydrationWarning>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      placeholder="you@example.com"
                      required
                      suppressHydrationWarning
                    />
                    <button type="submit" className={submitClass} disabled={loading && !socialLocked}>
                      {loading && !socialLocked ? "Processing..." : "Continue"}
                    </button>
                  </form>

                  {/* Footer */}
                  <div className="flex items-center w-full justify-between text-sm pt-2">
                    <TransitionLink
                      href="/main"
                      className="text-white/50 hover:text-white transition-colors"
                    >
                      ← Back
                    </TransitionLink>
                  </div>
                </div>
              </main>
            </BorderGlow>
          </KineticCard>
      </KineticPage>
    </StarfieldBackground>
  );
}
