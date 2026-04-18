// backend/auth.js — Project-24 v2
// Transaction-safe, multi-provider authentication with account linking.

import { auth, googleProvider, githubProvider } from "./firebaseConfig";
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  signInWithCustomToken,
} from "firebase/auth";
import { handleIdentitySynthesis } from "./db";

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPER — wraps popup sign-in + identity synthesis
// ─────────────────────────────────────────────────────────────────────────────
const initiatePopupSignIn = async (provider) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    // Map Firebase providerId to our internal provider key
    const rawProvider = firebaseUser.providerData[0]?.providerId || "email";
    const providerKey =
      rawProvider === "google.com" ? "google"
      : rawProvider === "github.com" ? "github"
      : "email";

    console.log("[Auth] Popup sign-in complete for:", firebaseUser.email, "provider:", providerKey);

    // Run identity synthesis — creates user doc + auth_identity in Firestore
    const canonicalUserId = await handleIdentitySynthesis(firebaseUser, providerKey);
    console.log("[Auth] Identity synthesis complete. User ID:", canonicalUserId);

    return { firebaseUser, canonicalUserId };
  } catch (error) {
    // User closed the popup
    if (error.code === "auth/popup-closed-by-user") {
      console.log("[Auth] Popup closed by user.");
      return null;
    }
    // User cancelled the flow
    if (error.code === "auth/cancelled-popup-request") {
      console.log("[Auth] Duplicate popup request cancelled.");
      return null;
    }
    console.error("[Auth] Popup sign-in error:", error.code, error.message);
    throw new Error("Sign-in failed. Please try again.");
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Signs in with Google via popup.
 * Identity synthesis runs inline — user doc is created before this resolves.
 * @returns {Promise<{ firebaseUser, canonicalUserId } | null>}
 */
export const signInWithGoogle = async () => {
  return await initiatePopupSignIn(googleProvider);
};

// ─────────────────────────────────────────────────────────────────────────────
// GITHUB
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Signs in with GitHub via popup.
 * @returns {Promise<{ firebaseUser, canonicalUserId } | null>}
 */
export const signInWithGithub = async () => {
  return await initiatePopupSignIn(githubProvider);
};

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM TOKEN (OTP)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Signs in using a Custom Firebase Token (used by the new OTP backend flow).
 * Automatically runs identity synthesis to perfectly map the user to their Single User account.
 */
export const signInWithCustomAuthToken = async (customToken, username = null) => {
  try {
    const credential = await signInWithCustomToken(auth, customToken);
    let firebaseUser = credential.user;
    
    // If username is provided (e.g. signup flow), attach it
    if (username && !firebaseUser.displayName) {
       await updateProfile(firebaseUser, { displayName: username });
       firebaseUser = { ...firebaseUser, displayName: username };
    }

    const canonicalUserId = await handleIdentitySynthesis(firebaseUser, "email");
    return { firebaseUser, canonicalUserId };
  } catch (error) {
    console.error("[Auth] Custom token sign-in error:", error);
    throw new Error("OTP Authentication verification failed.");
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SIGN OUT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Signs out the current user from Firebase Auth.
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("[Auth] Sign-out error:", error.message);
    throw new Error("Sign-out failed.");
  }
};
