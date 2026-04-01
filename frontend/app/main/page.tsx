"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import StarfieldBackground from "@/components/background/StarfieldBackground";

export default function MainPage() {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [signupEmail, setSignupEmail] = useState("");
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");

  const handleSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Sign-up with:", signupEmail);
  };

  const handleSignin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Sign-in with:", signinEmail, signinPassword);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all text-sm font-medium";
  const submitClass =
    "w-full py-3 rounded-lg bg-teal-500/80 hover:bg-teal-400 text-white font-semibold shadow-[0_0_15px_rgba(0,229,195,0.4)] hover:shadow-[0_0_25px_rgba(0,229,195,0.6)] transition-all text-sm";
  const oauthClass =
    "flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-white/5 border border-white/10 text-white/90 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium";

  return (
    <StarfieldBackground>
      <Link
        href="/login"
        className="fixed right-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/15"
      >
        Sign In / Sign Up
      </Link>

      <main className="relative z-10 flex w-full max-w-[420px] flex-col items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-white shadow-2xl backdrop-blur-md">
        {mode === "signup" && (
          <div className="w-full space-y-6 transition-all duration-300">
            <div className="w-full space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-white/90">Create account</h1>
              <p className="text-sm text-zinc-400">Join us - it&apos;s free</p>
            </div>

            <div className="flex w-full flex-col gap-3">
              <button type="button" className={oauthClass}>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.97-6.19a24.014 24.014 0 0 0 0 21.56l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                Continue with Google
              </button>

              <button type="button" className={oauthClass}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                Continue with GitHub
              </button>
            </div>

            <div className="flex w-full items-center gap-3">
              <hr className="flex-1 border-white/10" />
              <span className="text-xs uppercase tracking-wider text-zinc-500">or continue with email</span>
              <hr className="flex-1 border-white/10" />
            </div>

            <form onSubmit={handleSignup} className="w-full space-y-4">
              <input
                id="signup-email"
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
                required
              />
              <button type="submit" className={submitClass}>
                Continue
              </button>
            </form>

            <div className="flex w-full items-center justify-between pt-2 text-sm">
              <Link href="/main" className="text-white/50 transition-colors hover:text-white">
                ← Back
              </Link>
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-teal-400 transition-colors hover:text-teal-300"
              >
                Already have an account? Sign in →
              </button>
            </div>
          </div>
        )}

        {mode === "signin" && (
          <div className="w-full space-y-6 transition-all duration-300">
            <div className="w-full space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-white/90">Welcome Back</h1>
              <p className="text-sm text-zinc-400">Sign in to your account</p>
            </div>

            <form onSubmit={handleSignin} className="w-full space-y-4 text-left">
              <div className="space-y-2">
                <label className="ml-1 text-sm text-zinc-300" htmlFor="signin-email">
                  Email
                </label>
                <input
                  id="signin-email"
                  type="email"
                  value={signinEmail}
                  onChange={(e) => setSigninEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="ml-1 text-sm text-zinc-300" htmlFor="signin-password">
                  Password
                </label>
                <input
                  id="signin-password"
                  type="password"
                  value={signinPassword}
                  onChange={(e) => setSigninPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" className={submitClass}>
                Sign In
              </button>
            </form>

            <div className="flex w-full items-center justify-between pt-2 text-sm">
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-white/50 transition-colors hover:text-white"
              >
                ← Create account
              </button>
              <Link href="/forgot-password" className="text-teal-400 transition-colors hover:text-teal-300">
                Forgot password?
              </Link>
            </div>
          </div>
        )}
      </main>
    </StarfieldBackground>
  );
}
