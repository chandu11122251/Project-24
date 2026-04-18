// backend/auth.js — Project-24 v2
// Transaction-safe, multi-provider authentication with account linking.

import { auth, googleProvider, githubProvider } from "./firebaseConfig";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  updateProfile,
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
// EMAIL / PASSWORD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a new user with email and password.
 * @param {string} email
 * @param {string} password
 * @param {string} username - Display name set on the Firebase user.
 * @returns {Promise<{ firebaseUser, canonicalUserId }>}
 */
export const signUpWithEmail = async (email, password, username) => {
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const firebaseUser = credential.user;

    // Attach display name to Firebase Auth profile
    await updateProfile(firebaseUser, { displayName: username });

    // Synthesize identity with display name now available
    const userWithName = { ...firebaseUser, displayName: username };
    const canonicalUserId = await handleIdentitySynthesis(
      userWithName,
      "email"
    );

    return { firebaseUser, canonicalUserId };
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error("This email is already registered. Try signing in.");
    }
    if (error.code === "auth/weak-password") {
      throw new Error("Password must be at least 6 characters.");
    }
    console.error("[Auth] Email sign-up error:", error.code, error.message);
    throw new Error("Sign-up failed. Please try again.");
  }
};

/**
 * Signs in with email and password.
 * Runs identity synthesis to update last_login_at on the auth_identity doc.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ firebaseUser, canonicalUserId }>}
 */
export const signInWithEmail = async (email, password) => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = credential.user;
    const canonicalUserId = await handleIdentitySynthesis(
      firebaseUser,
      "email"
    );
    return { firebaseUser, canonicalUserId };
  } catch (error) {
    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/invalid-credential"
    ) {
      throw new Error("Incorrect email or password.");
    }
    console.error("[Auth] Email sign-in error:", error.code, error.message);
    throw new Error("Sign-in failed. Please try again.");
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD RESET
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sends a password reset email.
 * @param {string} email
 */
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      // Don't leak whether the email exists — silently succeed
      return;
    }
    console.error("[Auth] Password reset error:", error.code, error.message);
    throw new Error("Failed to send reset email.");
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
