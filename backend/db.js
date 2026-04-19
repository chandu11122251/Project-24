// backend/db.js — Project-24 v2 Schema
// UID-based identity | Deterministic composite IDs | O(1) lookups

import { db } from "./firebaseConfig";
import {
  doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc,
  collection, query, where, orderBy, limit, startAfter,
  getDocs, runTransaction, writeBatch,
  serverTimestamp, increment, Timestamp
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ─────────────────────────────────────────────────────────────────────────────
// IDENTITY SYNTHESIS
// Transaction-safe account linking across multiple auth providers.
// Prevents duplicate users when the same email is used with different providers.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The core identity function. Called after every successful Firebase Auth login.
 * Flow:
 *   1. Check auth_identities/{provider}:{providerUid} — O(1) lookup
 *   2. If exists → update last_login_at and return existing user_id
 *   3. If not → run transaction:
 *        a. Query users by email (to find cross-provider duplicates)
 *        b. If found  → link new auth_identity to existing user
 *        c. If not    → create new user + auth_identity atomically
 *
 * @param {Object} firebaseUser - The Firebase User object post-authentication.
 * @param {string} provider - "google" | "github" | "email"
 * @returns {Promise<string>} The canonical user_id (UID of the primary user doc).
 */
export const handleIdentitySynthesis = async (firebaseUser, provider) => {
  if (!firebaseUser?.uid) {
    throw new Error("Invalid Firebase user object: missing UID.");
  }

  const { uid, displayName, photoURL } = firebaseUser;
  // Fallback for missing email (common with private GitHub profiles)
  const email = firebaseUser.email || firebaseUser.providerData[0]?.email || `${uid}@${provider}.user`;
  const identityDocId = `${provider}:${uid}`;
  const identityRef = doc(db, "auth_identities", identityDocId);
  const userRef = doc(db, "users", uid);

  // ── Step 1: Fast path — identity already linked (O(1)) ───────────────────
  const identitySnap = await getDoc(identityRef);
  if (identitySnap.exists()) {
    const existingUserId = identitySnap.data().user_id;
    await updateDoc(identityRef, { last_login_at: serverTimestamp() });

    // Verify the user doc also exists (it may be missing if a previous
    // login attempt created the identity but failed to create the user doc).
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      console.warn("[DB] auth_identity exists but user doc missing — creating user doc now.");
      await setDoc(userRef, {
        uid,
        email,
        username: displayName || email.split("@")[0],
        profile_picture: photoURL || null,
        bio: "",
        status: "active",
        follower_count: 0,
        following_count: 0,
        post_count: 0,
        unread_notification_count: 0,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    }

    return existingUserId;
  }

  // ── Step 2: Cross-Provider Linking — Find existing user by email ──────
  // If a user with this email already exists, we link the new identity to them
  // instead of creating a new user doc.
  let canonicalUserId = uid;
  let userAlreadyExists = false;

  const usersByEmailQ = query(collection(db, "users"), where("email", "==", email), limit(1));
  const emailSnap = await getDocs(usersByEmailQ);

  if (!emailSnap.empty) {
    // FOUND: Email already belongs to an existing user
    canonicalUserId = emailSnap.docs[0].id;
    userAlreadyExists = true;
    console.log("[DB] Existing user found by email. Linking identity to:", canonicalUserId);
  } else {
    // NOT FOUND BY EMAIL: Check if the UID itself exists (fallback)
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      userAlreadyExists = true;
      canonicalUserId = userSnap.id;
    }
  }

  // ── Step 3: Transaction — atomically write auth_identity (+ user if new) ──
  await runTransaction(db, async (transaction) => {
    if (!userAlreadyExists) {
      // Brand-new user: create the Firestore profile
      transaction.set(doc(db, "users", canonicalUserId), {
        uid: canonicalUserId,
        primary_id: canonicalUserId, // Mark as primary
        email,
        username: displayName || email.split("@")[0],
        profile_picture: photoURL || null,
        bio: "",
        status: "active",
        follower_count: 0,
        following_count: 0,
        post_count: 0,
        unread_notification_count: 0,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    }

    // Always ensure the current login UID knows its primary link
    if (uid !== canonicalUserId) {
      transaction.set(doc(db, "users", uid), {
        uid,
        primary_id: canonicalUserId, // Linked to the canonical profile
        username: displayName || email.split("@")[0],
        email,
        updated_at: serverTimestamp()
      }, { merge: true });
    }

    // Always write the auth_identity link (idempotent for this provider)
    transaction.set(identityRef, {
      user_id: canonicalUserId,
      provider,
      provider_user_id: uid, // The specific UID from this provider
      email,
      last_login_at: serverTimestamp(),
      created_at: serverTimestamp(),
    });
  });

  return canonicalUserId;
};

// ─────────────────────────────────────────────────────────────────────────────
// USER PROFILE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches a user document by their UID.
 * @param {string} userId
 */
export const getUserById = async (userId) => {
  if (!userId) return null;
  const snap = await getDoc(doc(db, "users", userId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

/**
 * Fetches a user by their email address.
 * @param {string} email
 */
export const getUserByEmail = async (email) => {
  if (!email) return null;
  const q = query(collection(db, "users"), where("email", "==", email), limit(1));
  const snap = await getDocs(q);
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
};

/**
 * Resolves a username or UID to a user document.
 * Used for profile URL routing: /profile/[identifier]
 * @param {string} identifier - A UID or username string.
 */
export const getUserByIdentifier = async (identifier) => {
  if (!identifier) return null;

  // 1. Try by UID (O(1))
  const uidSnap = await getDoc(doc(db, "users", identifier));
  if (uidSnap.exists()) return { id: uidSnap.id, ...uidSnap.data() };

  // 2. Try by username (query)
  const q = query(
    collection(db, "users"),
    where("username", "==", identifier),
    limit(1)
  );
  const snap = await getDocs(q);
  if (!snap.empty) return { id: snap.docs[0].id, ...snap.docs[0].data() };

  return null;
};

/**
 * Updates a user's profile fields.
 * Always updates the `updated_at` timestamp.
 * @param {string} userId
 * @param {Object} data - Partial user profile fields.
 */
export const updateUserProfile = async (userId, data) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { ...data, updated_at: serverTimestamp() });
};

/**
 * Searches users by username prefix for live search / user discovery.
 * Requires composite index: (username ASC)
 * @param {string} prefix
 * @param {number} pageSize
 */
export const searchUsersByPrefix = async (prefix, pageSize = 10) => {
  if (!prefix) return [];
  const q = query(
    collection(db, "users"),
    where("username", ">=", prefix),
    where("username", "<=", prefix + "\uf8ff"),
    orderBy("username"),
    limit(pageSize)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ─────────────────────────────────────────────────────────────────────────────
// POSTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a new post. Increments the author's post_count.
 * NOTE: Feed fan-out should be handled by a Cloud Function (onPostCreate trigger).
 * For local dev, we perform a simplified direct write.
 *
 * @param {string} userId - The author's UID.
 * @param {Object} postData - { caption, media, hashtags }
 */
export const createPost = async (userId, postData) => {
  const { caption = "", media = [], hashtags = [] } = postData;

  const normalizedHashtags = hashtags.map((t) =>
    t.startsWith("#") ? t.slice(1).toLowerCase() : t.toLowerCase()
  );

  const auth = getAuth();
  const currentUid = auth.currentUser ? auth.currentUser.uid : userId;

  const postRef = await addDoc(collection(db, "posts"), {
    user_id: userId, // Canonical Profile ID
    owner_uid: currentUid, // Raw Login UID
    caption,
    media,
    hashtags: normalizedHashtags,
    like_count: 0,
    comment_count: 0,
    is_deleted: false,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });

  // Increment author's post count
  await updateDoc(doc(db, "users", userId), {
    post_count: increment(1),
    updated_at: serverTimestamp(),
  });

  // Index hashtags
  const batch = writeBatch(db);
  normalizedHashtags.forEach((tag) => {
    const tagPostRef = doc(db, "hashtags", tag, "posts", postRef.id);
    batch.set(tagPostRef, {
      post_id: postRef.id,
      author_id: userId,
      created_at: serverTimestamp(),
    });
  });
  await batch.commit();

  return postRef.id;
};

/**
 * Soft-deletes a post by setting is_deleted = true.
 * Hard deletion of feed entries should be done via a Cloud Function trigger.
 * @param {string} postId
 * @param {string} userId - For ownership verification.
 */
export const deletePost = async (postId, userId) => {
  const postRef = doc(db, "posts", postId);
  const snap = await getDoc(postRef);
  if (!snap.exists() || snap.data().user_id !== userId) {
    throw new Error("Post not found or unauthorized.");
  }
  await updateDoc(postRef, { is_deleted: true, updated_at: serverTimestamp() });
  await updateDoc(doc(db, "users", userId), {
    post_count: increment(-1),
    updated_at: serverTimestamp(),
  });
};

/**
 * Fetches a single post by ID (returns null if soft-deleted).
 * @param {string} postId
 */
export const getPostById = async (postId) => {
  const snap = await getDoc(doc(db, "posts", postId));
  if (!snap.exists() || snap.data().is_deleted) return null;
  return { id: snap.id, ...snap.data() };
};

/**
 * Fetches a paginated list of posts for a user's profile page.
 * Requires composite index: (user_id ASC, is_deleted ASC, created_at DESC)
 * @param {string} userId
 * @param {number} pageSize
 * @param {DocumentSnapshot|null} cursor - startAfter cursor for pagination.
 */
export const getPostsByUser = async (userId, pageSize = 12, cursor = null) => {
  let q = query(
    collection(db, "posts"),
    where("user_id", "==", userId),
    where("is_deleted", "==", false),
    orderBy("created_at", "desc"),
    limit(pageSize)
  );
  if (cursor) q = query(q, startAfter(cursor));
  const snap = await getDocs(q);
  return {
    posts: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
    lastDoc: snap.docs[snap.docs.length - 1] || null,
  };
};

/**
 * Fetches posts with a given hashtag.
 * @param {string} tag
 * @param {number} pageSize
 * @param {DocumentSnapshot|null} cursor
 */
export const getPostsByHashtag = async (tag, pageSize = 20, cursor = null) => {
  const normalizedTag = tag.startsWith("#") ? tag.slice(1).toLowerCase() : tag.toLowerCase();
  let q = query(
    collection(db, "hashtags", normalizedTag, "posts"),
    orderBy("created_at", "desc"),
    limit(pageSize)
  );
  if (cursor) q = query(q, startAfter(cursor));
  const snap = await getDocs(q);
  return {
    postRefs: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
    lastDoc: snap.docs[snap.docs.length - 1] || null,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// HOME FEED
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches the home feed timeline for a user (fan-out-on-write model).
 * Requires composite index: (created_at DESC)
 * @param {string} userId
 * @param {number} pageSize
 * @param {DocumentSnapshot|null} cursor
 */
export const getHomeFeed = async (userId, pageSize = 20, cursor = null) => {
  let q = query(
    collection(db, "feeds", userId, "timeline"),
    orderBy("created_at", "desc"),
    limit(pageSize)
  );
  if (cursor) q = query(q, startAfter(cursor));
  const snap = await getDocs(q);
  return {
    items: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
    lastDoc: snap.docs[snap.docs.length - 1] || null,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// LIKES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Toggles like/unlike on a post.
 * Uses deterministic composite ID {userId}_{postId} to prevent duplicates.
 * Atomically updates the post's like_count via a transaction.
 *
 * @param {string} userId
 * @param {string} postId
 * @returns {Promise<boolean>} True if now liked, false if now unliked.
 */
export const toggleLike = async (userId, postId) => {
  const likeId = `${userId}_${postId}`;
  const likeRef = doc(db, "likes", likeId);
  const postRef = doc(db, "posts", postId);
  const userRef = doc(db, "users", userId);
  const expiresAt = Timestamp.fromDate(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  );

  return await runTransaction(db, async (transaction) => {
    const likeSnap = await transaction.get(likeRef);
    const postSnap = await transaction.get(postRef);

    if (likeSnap.exists()) {
      // Unlike
      transaction.delete(likeRef);
      transaction.update(postRef, { like_count: increment(-1) });
      return false;
    } else {
      // Like
      transaction.set(likeRef, {
        user_id: userId,
        post_id: postId,
        created_at: serverTimestamp(),
      });
      transaction.update(postRef, { like_count: increment(1) });

      // Activity log entry - specialized for "like"
      const activityRef = doc(collection(db, "activities"));
      const ninetyDays = Timestamp.fromDate(
        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      );
      
      const postData = postSnap.exists() ? postSnap.data() : {};
      
      transaction.set(activityRef, {
        user_id: userId,
        type: "like",
        target_id: postId,
        target_type: "post",
        post_preview: postData.caption ? (postData.caption.slice(0, 60) + (postData.caption.length > 60 ? "..." : "")) : "Post",
        created_at: serverTimestamp(),
        expires_at: ninetyDays,
      });

      return true;
    }
  });
};

/**
 * Checks if a user has liked a specific post. O(1) lookup.
 * @param {string} userId
 * @param {string} postId
 */
export const checkIfLiked = async (userId, postId) => {
  if (!userId || !postId) return false;
  const snap = await getDoc(doc(db, "likes", `${userId}_${postId}`));
  return snap.exists();
};

// ─────────────────────────────────────────────────────────────────────────────
// COMMENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Adds a top-level comment or a reply to an existing comment.
 * Atomically increments the post's comment_count.
 * If replying, also increments the parent comment's reply_count.
 *
 * @param {string} userId
 * @param {string} postId
 * @param {string} text
 * @param {string|null} parentCommentId - null for top-level, ID for replies.
 */
export const addComment = async (userId, postId, text, parentCommentId = null) => {
  const postRef = doc(db, "posts", postId);

  return await runTransaction(db, async (transaction) => {
    const postSnap = await transaction.get(postRef);
    if (!postSnap.exists() || postSnap.data().is_deleted) {
      throw new Error("Post not found.");
    }

    const commentRef = doc(collection(db, "comments"));
    const postData = postSnap.data();

    transaction.set(commentRef, {
      post_id: postId,
      user_id: userId,
      text,
      parent_comment_id: parentCommentId,
      reply_count: 0,
      is_deleted: false,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    transaction.update(postRef, { comment_count: increment(1) });

    // Activity log entry - specialized for "comment"
    const activityRef = doc(collection(db, "activities"));
    transaction.set(activityRef, {
      user_id: userId,
      type: "comment",
      target_id: postId,
      target_type: "post",
      text: text.slice(0, 100),
      post_preview: postData.caption ? (postData.caption.slice(0, 60) + (postData.caption.length > 60 ? "..." : "")) : "Post",
      created_at: serverTimestamp(),
      expires_at: Timestamp.fromDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)),
    });

    if (parentCommentId) {
      transaction.update(doc(db, "comments", parentCommentId), {
        reply_count: increment(1),
      });
    }

    return commentRef.id;
  });
};

/**
 * Soft-deletes a comment. Tombstones it if it has replies.
 * @param {string} commentId
 * @param {string} postId
 */
export const deleteComment = async (commentId, postId) => {
  const commentRef = doc(db, "comments", commentId);
  const postRef = doc(db, "posts", postId);
  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(commentRef);
    if (!snap.exists()) throw new Error("Comment not found.");
    transaction.update(commentRef, {
      is_deleted: true,
      text: "[deleted]",
      updated_at: serverTimestamp(),
    });
    transaction.update(postRef, { comment_count: increment(-1) });
  });
};

/**
 * Fetches top-level comments for a post (paginated).
 * Requires composite index: (post_id ASC, parent_comment_id ASC, created_at DESC)
 * @param {string} postId
 * @param {number} pageSize
 * @param {DocumentSnapshot|null} cursor
 */
export const getComments = async (postId, pageSize = 20, cursor = null) => {
  let q = query(
    collection(db, "comments"),
    where("post_id", "==", postId),
    where("parent_comment_id", "==", null),
    orderBy("created_at", "asc"),
    limit(pageSize)
  );
  if (cursor) q = query(q, startAfter(cursor));
  const snap = await getDocs(q);
  return {
    comments: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
    lastDoc: snap.docs[snap.docs.length - 1] || null,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// FOLLOWS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Follows a user. Since accounts are public by default, status is "accepted".
 * Uses deterministic composite ID: {followerId}_{followingId}
 * Atomically updates follower/following counts.
 *
 * @param {string} followerId - The user initiating the follow.
 * @param {string} followingId - The user being followed.
 */
export const followUser = async (followerId, followingId) => {
  if (followerId === followingId) throw new Error("Cannot follow yourself.");

  const followId = `${followerId}_${followingId}`;
  const followRef = doc(db, "follows", followId);
  const followerUserRef = doc(db, "users", followerId);
  const followingUserRef = doc(db, "users", followingId);

  await runTransaction(db, async (transaction) => {
    const existingSnap = await transaction.get(followRef);
    if (existingSnap.exists()) return; // Already following, no-op

    transaction.set(followRef, {
      follower_id: followerId,
      following_id: followingId,
      status: "accepted", // Public accounts: immediately accepted
      created_at: serverTimestamp(),
    });

    transaction.update(followerUserRef, {
      following_count: increment(1),
      updated_at: serverTimestamp(),
    });
    transaction.update(followingUserRef, {
      follower_count: increment(1),
      updated_at: serverTimestamp(),
    });

    // Activity log
    const activityRef = doc(collection(db, "activities"));
    const ninetyDays = Timestamp.fromDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
    
    transaction.set(activityRef, {
      user_id: followerId,
      type: "connection",
      target_id: followingId,
      target_type: "user",
      created_at: serverTimestamp(),
      expires_at: ninetyDays,
    });
  });

  // Notification (outside transaction — best-effort)
  await createNotification(followingId, "follow_accept", {
    source_user_id: followerId,
  });
};

/**
 * Unfollows a user. Atomically decrements counts.
 * @param {string} followerId
 * @param {string} followingId
 */
export const unfollowUser = async (followerId, followingId) => {
  const followId = `${followerId}_${followingId}`;
  const followRef = doc(db, "follows", followId);
  const followerUserRef = doc(db, "users", followerId);
  const followingUserRef = doc(db, "users", followingId);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(followRef);
    if (!snap.exists()) return; // Not following, no-op

    transaction.delete(followRef);
    transaction.update(followerUserRef, {
      following_count: increment(-1),
      updated_at: serverTimestamp(),
    });
    transaction.update(followingUserRef, {
      follower_count: increment(-1),
      updated_at: serverTimestamp(),
    });
  });
};

/**
 * Checks if followerId is following followingId. O(1) getDoc lookup.
 * @param {string} followerId
 * @param {string} followingId
 */
export const isFollowing = async (followerId, followingId) => {
  const snap = await getDoc(doc(db, "follows", `${followerId}_${followingId}`));
  return snap.exists() && snap.data().status === "accepted";
};

/**
 * Determines relationship status between two users.
 * @param {string} currentUserId
 * @param {string} targetUserId
 * @returns {"self"|"friends"|"following"|"follower"|"none"}
 */
export const getRelationshipStatus = async (currentUserId, targetUserId) => {
  if (!currentUserId || !targetUserId) return "none";
  if (currentUserId === targetUserId) return "self";

  const [aFollowsB, bFollowsA] = await Promise.all([
    getDoc(doc(db, "follows", `${currentUserId}_${targetUserId}`)),
    getDoc(doc(db, "follows", `${targetUserId}_${currentUserId}`)),
  ]);

  const a = aFollowsB.exists() && aFollowsB.data().status === "accepted";
  const b = bFollowsA.exists() && bFollowsA.data().status === "accepted";

  if (a && b) return "friends";
  if (a) return "following";
  if (b) return "follower";
  return "none";
};

/**
 * Fetches the list of followers for a user (paginated).
 * Requires composite index: (following_id ASC, status ASC, created_at DESC)
 * @param {string} userId
 * @param {number} pageSize
 * @param {DocumentSnapshot|null} cursor
 */
export const getFollowers = async (userId, pageSize = 30, cursor = null) => {
  let q = query(
    collection(db, "follows"),
    where("following_id", "==", userId),
    where("status", "==", "accepted"),
    orderBy("created_at", "desc"),
    limit(pageSize)
  );
  if (cursor) q = query(q, startAfter(cursor));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data().follower_id);
};

/**
 * Fetches the list of users a given user is following (paginated).
 * Requires composite index: (follower_id ASC, status ASC)
 * @param {string} userId
 * @param {number} pageSize
 * @param {DocumentSnapshot|null} cursor
 */
export const getFollowing = async (userId, pageSize = 30, cursor = null) => {
  let q = query(
    collection(db, "follows"),
    where("follower_id", "==", userId),
    where("status", "==", "accepted"),
    orderBy("created_at", "desc"),
    limit(pageSize)
  );
  if (cursor) q = query(q, startAfter(cursor));
  const snap = await getDocs(q);
  
  // Enforce resolution of user objects for each relationship
  const ids = snap.docs.map((d) => d.data().following_id);
  const userDocs = await Promise.all(ids.map(id => getDoc(doc(db, "users", id))));
  
  return userDocs.map(snap => {
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  }).filter(Boolean);
};

// ─────────────────────────────────────────────────────────────────────────────
// BLOCKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Blocks a user. Also removes any existing follow relationship.
 * Uses deterministic composite ID: {blockerId}_{blockedId}
 * @param {string} blockerId
 * @param {string} blockedId
 */
export const blockUser = async (blockerId, blockedId) => {
  const blockRef = doc(db, "blocks", `${blockerId}_${blockedId}`);
  const batch = writeBatch(db);

  batch.set(blockRef, {
    blocker_id: blockerId,
    blocked_id: blockedId,
    created_at: serverTimestamp(),
  });

  // Remove follow relationship both ways (best-effort cleanup)
  batch.delete(doc(db, "follows", `${blockerId}_${blockedId}`));
  batch.delete(doc(db, "follows", `${blockedId}_${blockerId}`));

  await batch.commit();
};

/**
 * Unblocks a user.
 * @param {string} blockerId
 * @param {string} blockedId
 */
export const unblockUser = async (blockerId, blockedId) => {
  await deleteDoc(doc(db, "blocks", `${blockerId}_${blockedId}`));
};

/**
 * Checks if blockerId has blocked blockedId. O(1) lookup.
 * @param {string} blockerId
 * @param {string} blockedId
 */
export const isBlocked = async (blockerId, blockedId) => {
  const snap = await getDoc(doc(db, "blocks", `${blockerId}_${blockedId}`));
  return snap.exists();
};

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a notification for a user.
 * Atomically increments the receiver's unread_notification_count.
 *
 * @param {string} userId - The receiver's UID.
 * @param {string} type - "like"|"comment"|"follow_request"|"follow_accept"|"reply"
 * @param {Object} payload - Optional fields: { source_user_id, post_id, comment_id }
 */
export const createNotification = async (userId, type, payload = {}) => {
  const sixtyDays = Timestamp.fromDate(
    new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
  );

  const batch = writeBatch(db);

  const notifRef = doc(collection(db, "notifications"));
  batch.set(notifRef, {
    user_id: userId, // Unified Profile ID
    owner_uid: userId, // Backup verification
    type,
    source_user_id: payload.source_user_id || null,
    post_id: payload.post_id || null,
    comment_id: payload.comment_id || null,
    is_read: false,
    expires_at: sixtyDays,
    created_at: serverTimestamp(),
  });

  // Increment unread count on the user doc
  batch.update(doc(db, "users", userId), {
    unread_notification_count: increment(1),
    updated_at: serverTimestamp(),
  });

  await batch.commit();
  return notifRef.id;
};

/**
 * Marks all of a user's unread notifications as read.
 * Resets the unread_notification_count to 0.
 * Requires composite index: (user_id ASC, is_read ASC, created_at DESC)
 * @param {string} userId
 */
export const markNotificationsRead = async (userId) => {
  const q = query(
    collection(db, "notifications"),
    where("user_id", "==", userId),
    where("is_read", "==", false)
  );

  const snap = await getDocs(q);
  if (snap.empty) return;

  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.update(d.ref, { is_read: true }));
  batch.update(doc(db, "users", userId), {
    unread_notification_count: 0,
    updated_at: serverTimestamp(),
  });

  await batch.commit();
};

/**
 * Fetches paginated notifications for a user.
 * Requires composite index: (user_id ASC, is_read ASC, created_at DESC)
 * @param {string} userId
 * @param {number} pageSize
 * @param {DocumentSnapshot|null} cursor
 */
export const getNotifications = async (userId, pageSize = 20, cursor = null) => {
  let q = query(
    collection(db, "notifications"),
    where("user_id", "==", userId),
    orderBy("is_read", "asc"),
    orderBy("created_at", "desc"),
    limit(pageSize)
  );
  if (cursor) q = query(q, startAfter(cursor));
  const snap = await getDocs(q);
  return {
    notifications: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
    lastDoc: snap.docs[snap.docs.length - 1] || null,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY LOG
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches paginated activity log for a user (actor's own trail).
 * Requires composite index: (user_id ASC, created_at DESC)
 * @param {string} userId
 * @param {number} pageSize
 * @param {DocumentSnapshot|null} cursor
 */
export const getActivityLog = async (userId, pageSize = 20, cursor = null) => {
  let q = query(
    collection(db, "activities"),
    where("user_id", "==", userId),
    orderBy("created_at", "desc"),
    limit(pageSize)
  );
  if (cursor) q = query(q, startAfter(cursor));
  const snap = await getDocs(q);
  return {
    activities: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
    lastDoc: snap.docs[snap.docs.length - 1] || null,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// LEGACY COMPAT SHIM — Remove after all consumers are updated
// ─────────────────────────────────────────────────────────────────────────────

/** @deprecated Use toggleLike instead */
export const likePost = toggleLike;

/** @deprecated Use getUserById or getUserByIdentifier */
export const syncUserWithFirestore = handleIdentitySynthesis;
