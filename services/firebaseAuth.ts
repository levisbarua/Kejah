
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebaseConfig";
import { databaseService } from "./databaseService";
import { UserRole } from "../types";

/**
 * This service handles the actual "talking" to Firebase's login system.
 */
export const firebaseAuth = {
  async signUp(name: string, email: string, pass: string) {
    if (!isFirebaseConfigured) throw new Error("Firebase configuration missing.");
    if (!auth) throw new Error("Firebase Auth is not available. Check your API key and Identity Toolkit status.");
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    
    await updateProfile(user, { displayName: name });
    
    // Save their profile in the database
    await databaseService.createUserProfile(user.uid, {
      email,
      displayName: name,
      role: UserRole.BUYER 
    });
    
    return user;
  },

  async signIn(email: string, pass: string) {
    if (!isFirebaseConfigured) throw new Error("Firebase configuration missing.");
    if (!auth) throw new Error("Firebase Auth is not available.");
    return await signInWithEmailAndPassword(auth, email, pass);
  },

  async logout() {
    if (!auth) return;
    return await signOut(auth);
  }
};
