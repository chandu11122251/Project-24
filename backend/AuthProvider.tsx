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

      if (firebaseUser?.uid) {
        // v2 Schema: Use Firebase UID as the Firestore document key
        const userDocRef = doc(db, "users", firebaseUser.uid);
        unsubscribeDoc = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = { id: docSnap.id, ...docSnap.data() };
              console.log("[Auth] onSnapshot: doc EXISTS, username:", data.username, "email:", data.email);
              setUserData(data);
            } else {
              console.warn("[Auth] onSnapshot: doc DOES NOT EXIST for uid:", firebaseUser.uid);
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
        setUserData(null);
        setLoading(false);
        clearTimeout(safetyTimeout);
      }
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
