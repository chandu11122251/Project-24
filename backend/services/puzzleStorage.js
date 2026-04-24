import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // Or use service account JSON
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  });
}

const db = admin.firestore();

export const storePuzzle = async (type, data) => {
  const puzzlesRef = db.collection("daily_puzzles");
  
  // Get the current count to determine the tag
  const snapshot = await puzzlesRef.where("type", "==", type).count().get();
  const count = snapshot.data().count;
  const tag = `#${count + 1}`;

  const puzzleDoc = {
    type,
    data,
    tag,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
  };

  const docRef = await puzzlesRef.add(puzzleDoc);
  console.log(`Stored ${type} puzzle with tag ${tag}. Doc ID: ${docRef.id}`);
  return { id: docRef.id, tag };
};

export const getLatestPuzzle = async (type) => {
  const puzzlesRef = db.collection("daily_puzzles");
  const snapshot = await puzzlesRef
    .where("type", "==", type)
    .orderBy("created_at", "desc")
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  return snapshot.docs[0].data();
};
