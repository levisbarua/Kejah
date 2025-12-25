import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore/lite";
import { getStorage, FirebaseStorage } from "firebase/storage";

// --------------------------------------------------------
// TODO: PASTE YOUR FIREBASE CONFIGURATION HERE
// Go to Firebase Console > Project Settings > General > Your Apps
// --------------------------------------------------------
const firebaseConfig = {
  apiKey: "", 
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Logic to check if Firebase is actually configured
export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey.length > 10 && // Basic check to ensure it's not empty
  !firebaseConfig.apiKey.startsWith("PASTE_")
);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

if (isFirebaseConfigured) {
  try {
    const existingApps = getApps();
    app = existingApps.length > 0 ? existingApps[0] : initializeApp(firebaseConfig);
    
    // Services are initialized using the app instance
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    console.log("✅ Firebase services initialized successfully (Live Mode).");
  } catch (error: any) {
    console.error("❌ Firebase Initialization Error:", error.message);
  }
} else {
  console.log("⚠️ Firebase not configured. Using internal Mock Data.");
}

export { auth, db, storage };