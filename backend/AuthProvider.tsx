"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

interface AuthContextType {
  user: User | null;
  userData: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    // Safety Timeout: Force loading to false if Firebase/Firestore hangs (6s)
    const safetyTimeout = setTimeout(() => {
      setLoading((current) => {
        if (current) {
          console.warn("[Auth] Safety timeout reached. Forcing loading to false.");
          return false;
        }
        return current;
      });
    }, 6000);

    // With popup auth, identity synthesis runs inline during signInWithGoogle/GitHub.
    // By the time onAuthStateChanged fires, the user doc already exists in Firestore.
    // No need for processRedirectResult — just listen for auth state + user doc.
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("[Auth] onAuthStateChanged:", firebaseUser?.uid || "null", firebaseUser?.email || "");
      setUser(firebaseUser);

      // Clean up previous Firestore listener
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      let unsubscribeUserDoc: (() => void) | null = null;

      if (firebaseUser?.uid) {
        // Resolve canonical Identity
        const rawProvider = firebaseUser.providerData[0]?.providerId || "email";
        const providerKey =
          rawProvider === "google.com" ? "google"
          : rawProvider === "github.com" ? "github"
          : "email";

        const identityRef = doc(db, "auth_identities", `${providerKey}:${firebaseUser.uid}`);
        
        unsubscribeDoc = onSnapshot(
          identityRef,
          (identitySnap) => {
            if (identitySnap.exists()) {
              const canonicalUid = identitySnap.data().user_id;

              if (unsubscribeUserDoc) unsubscribeUserDoc();

              unsubscribeUserDoc = onSnapshot(
                doc(db, "users", canonicalUid),
                (docSnap) => {
                  if (docSnap.exists()) {
                    const data = { id: docSnap.id, ...docSnap.data() } as any;
                    console.log("[Auth] onSnapshot: doc EXISTS, username:", data.username, "email:", data.email);
                    setUserData(data);
                  } else {
                    console.warn("[Auth] onSnapshot: doc DOES NOT EXIST for canonical uid:", canonicalUid);
                    setUserData(null);
                  }
                  setLoading(false);
                  clearTimeout(safetyTimeout);
                },
                (error) => {
                  console.error("[Auth] Firestore sync error:", error);
                  setUserData(null);
                  setLoading(false);
                  clearTimeout(safetyTimeout);
                }
              );
            } else {
              console.log("[Auth] Identity doc not ready yet. Waiting...");
            }
          },
          (error) => {
            console.error("[Auth] Identity sync error:", error);
            setUserData(null);
            setLoading(false);
            clearTimeout(safetyTimeout);
          }
        );
      } else {
        setUserData(null);
        setLoading(false);
        clearTimeout(safetyTimeout);
      }

      // Capture unsubscribe for outer useEffect cleanup
      const originalUnsubscribeDoc = unsubscribeDoc;
      unsubscribeDoc = () => {
        if (originalUnsubscribeDoc) originalUnsubscribeDoc();
        if (unsubscribeUserDoc) unsubscribeUserDoc();
      };
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
      clearTimeout(safetyTimeout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
