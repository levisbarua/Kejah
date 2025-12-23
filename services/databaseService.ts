
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  increment, 
  setDoc,
  serverTimestamp,
  limit
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Listing, User, UserRole, FeedbackData } from "../types";

export const databaseService = {
  // --- USER OPERATIONS ---
  async getUserById(uid: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  },

  async createUserProfile(uid: string, profile: Partial<User>) {
    await setDoc(doc(db, "users", uid), {
      ...profile,
      uid,
      role: profile.role || UserRole.BUYER,
      isVerified: false,
      createdAt: Date.now()
    }, { merge: true });
  },

  async getAgents(): Promise<User[]> {
    const q = query(
      collection(db, "users"), 
      where("role", "==", UserRole.AGENT),
      limit(20)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as User);
  },

  // --- LISTING OPERATIONS ---
  async getListings(filters: any): Promise<Listing[]> {
    let q = query(collection(db, "listings"), where("status", "==", "active"));

    if (filters.type) {
      q = query(q, where("type", "==", filters.type));
    }
    
    // Note: Complex price ranges usually require composite indexes in Firestore
    // For simplicity in this implementation, we filter some items client-side or assume indexes exist
    const snapshot = await getDocs(q);
    let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Listing);

    // Client-side filtering for complex logic not easily handled by simple Firestore queries without indexes
    if (filters.minPrice) results = results.filter(l => l.price >= filters.minPrice);
    if (filters.maxPrice) results = results.filter(l => l.price <= filters.maxPrice);
    if (filters.city) results = results.filter(l => l.location.city.toLowerCase().includes(filters.city.toLowerCase()));
    
    if (filters.bedrooms) {
      if (filters.bedrooms === '4+') {
        results = results.filter(l => l.bedrooms >= 4);
      } else {
        results = results.filter(l => l.bedrooms === Number(filters.bedrooms));
      }
    }

    // Default sorting
    results.sort((a, b) => {
      const featuredA = a.featured ? 1 : 0;
      const featuredB = b.featured ? 1 : 0;
      if (featuredA !== featuredB) return featuredB - featuredA;
      return b.createdAt - a.createdAt;
    });

    return results;
  },

  async getListingById(id: string): Promise<Listing | null> {
    const listingDoc = await getDoc(doc(db, "listings", id));
    if (listingDoc.exists()) {
      return { id: listingDoc.id, ...listingDoc.data() } as Listing;
    }
    return null;
  },

  async addListing(listing: Omit<Listing, 'id' | 'createdAt' | 'status' | 'reportCount' | 'views'>) {
    const docRef = await addDoc(collection(db, "listings"), {
      ...listing,
      createdAt: Date.now(),
      status: 'active',
      reportCount: 0,
      views: 0
    });
    return docRef.id;
  },

  async incrementListingViews(id: string) {
    const listingRef = doc(db, "listings", id);
    await updateDoc(listingRef, {
      views: increment(1)
    });
  },

  // --- INTERACTION OPERATIONS ---
  async reportListing(listingId: string, reason: string) {
    const listingRef = doc(db, "listings", listingId);
    await updateDoc(listingRef, {
      reportCount: increment(1)
    });
    
    // Log report
    await addDoc(collection(db, "reports"), {
      listingId,
      reason,
      timestamp: Date.now()
    });
  },

  async addFeedback(feedback: FeedbackData) {
    await addDoc(collection(db, "feedback"), {
      ...feedback,
      timestamp: Date.now()
    });
  },

  async submitContactMessage(data: any) {
    await addDoc(collection(db, "contact_messages"), {
      ...data,
      timestamp: Date.now()
    });
  }
};
