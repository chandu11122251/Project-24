import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["backend"],
  experimental: {
    externalDir: true,
    workerThreads: false,
    cpus: 1,
  },

  // Firebase Auth's signInWithPopup requires the parent window to communicate
  // with the OAuth popup. The default Next.js COOP header ('same-origin')
  // blocks this. 'same-origin-allow-popups' preserves security while
  // explicitly allowing popup references — the recommended value for Firebase.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
