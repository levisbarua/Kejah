import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  setDoc,
  limit, 
  orderBy
} from "firebase/firestore/lite";
import { db, isFirebaseConfigured } from "./firebaseConfig";
import { mockFirestore } from "./mockFirebase";
import { Listing, User, UserRole, FeedbackData } from "../types";

// Helper to handle the service toggle
const useMock = !isFirebaseConfigured || !db;

export const databaseService = {
  async getUserById(uid: string): Promise<User | null> {
    if (useMock) return mockFirestore.getUserById(uid);
    
    try {
      const userDoc = await getDoc(doc(db!, "users", uid));
      return userDoc.exists() ? (userDoc.data() as User) : null;
    } catch (error: any) {
      console.error("❌ Firestore Error (getUserById):", error.message);
      // Fallback to mock only on permission errors to avoid breaking the UI completely during setup
      if (error.message.includes("permission-denied")) {
        console.warn("👉 Fix: Go to Firebase Console > Firestore > Rules and set them to Test Mode.");
      }
      return null;
    }
  },

  async createUserProfile(uid: string, profile: Partial<User>) {
    if (useMock) return;

    try {
      await setDoc(doc(db!, "users", uid), {
        ...profile,
        uid,
        role: profile.role || UserRole.BUYER,
        isVerified: false,
        createdAt: Date.now()
      }, { merge: true });
    } catch (error: any) {
      console.error("❌ Firestore Error (createUserProfile):", error.message);
    }
  },

  async getAgents(): Promise<User[]> {
    if (useMock) return mockFirestore.getAgents();

    try {
      // Get users who have the role of agent
      const q = query(collection(db!, "users"), where("role", "==", UserRole.AGENT), limit(20));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }) as User);
    } catch (error: any) {
      console.error("❌ Firestore Error (getAgents):", error.message);
      return [];
    }
  },

  async getListings(filters: any): Promise<Listing[]> {
    if (useMock) return mockFirestore.getListings(filters);

    try {
      // Start with base query for active listings
      // Note: Firestore requires composite indexes for complex queries. 
      // If you see "The query requires an index" in console, follow the link provided by Firebase.
      const listingsRef = collection(db!, "listings");
      let q = query(listingsRef, where("status", "==", "active"));

      if (filters.type) {
        q = query(q, where("type", "==", filters.type));
      }
      
      const snapshot = await getDocs(q);
      
      // Map and Filter in memory to reduce index requirements on the backend for this demo
      let results = snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          // Handle Timestamp conversion if it comes back as a Firestore Timestamp
          createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt
        } as Listing;
      });

      // Apply client-side filtering for numeric ranges and text matching
      if (filters.minPrice) results = results.filter(l => l.price >= filters.minPrice);
      if (filters.maxPrice) results = results.filter(l => l.price <= filters.maxPrice);
      if (filters.city) results = results.filter(l => l.location.city.toLowerCase().includes(filters.city.toLowerCase()));
      
      if (filters.bedrooms) {
        if (filters.bedrooms === '4+') results = results.filter(l => l.bedrooms >= 4);
        else results = results.filter(l => l.bedrooms === Number(filters.bedrooms));
      } else if (filters.minBeds) {
        results = results.filter(l => l.bedrooms >= filters.minBeds);
      }

      // Client-side sorting
      results.sort((a, b) => {
        const featuredA = a.featured ? 1 : 0;
        const featuredB = b.featured ? 1 : 0;
        
        if (featuredA !== featuredB) {
          return featuredB - featuredA; // Featured first
        }
        return b.createdAt - a.createdAt; // Newest first
      });

      return results;
    } catch (error: any) {
      console.error("❌ Firestore Error (getListings):", error.message);
      return [];
    }
  },

  async getListingById(id: string): Promise<Listing | null> {
    if (useMock) return mockFirestore.getListingById(id);

    try {
      const listingDoc = await getDoc(doc(db!, "listings", id));
      if (listingDoc.exists()) {
        const data = listingDoc.data();
        return { 
          id: listingDoc.id, 
          ...data,
          createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt
        } as Listing;
      }
      return null;
    } catch (error: any) {
      console.error("❌ Firestore Error (getListingById):", error.message);
      return null;
    }
  },

  async addListing(listing: Omit<Listing, 'id' | 'createdAt' | 'status' | 'reportCount' | 'views'>) {
    if (useMock) return (await mockFirestore.addListing(listing)).id;

    try {
      const docRef = await addDoc(collection(db!, "listings"), {
        ...listing,
        createdAt: Date.now(), // Storing as number for consistency with type
        status: 'active',
        reportCount: 0,
        views: 0
      });
      return docRef.id;
    } catch (error: any) {
      console.error("❌ Firestore Error (addListing):", error.message);
      throw error;
    }
  },

  async incrementListingViews(id: string) {
    if (useMock) return mockFirestore.incrementListingViews(id);
    try {
      const ref = doc(db!, "listings", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await updateDoc(ref, { views: (snap.data().views || 0) + 1 });
      }
    } catch (error) {
      // Ignore view increment errors
    }
  },

  async reportListing(listingId: string, reason: string) {
    if (useMock) return mockFirestore.reportListing(listingId, reason);
    try {
      const ref = doc(db!, "listings", listingId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await updateDoc(ref, { reportCount: (snap.data().reportCount || 0) + 1 });
      }
      await addDoc(collection(db!, "reports"), { listingId, reason, timestamp: Date.now() });
    } catch (error) {
       console.error("Error reporting listing", error);
    }
  },

  async addFeedback(feedback: FeedbackData) {
    if (useMock) return mockFirestore.addFeedback(feedback);
    try {
      await addDoc(collection(db!, "feedback"), { ...feedback, timestamp: Date.now() });
    } catch (error) {
      console.error("Error sending feedback", error);
    }
  },

  async submitContactMessage(data: any) {
    if (useMock) return mockFirestore.submitContactMessage(data);
    try {
      await addDoc(collection(db!, "contact_messages"), { ...data, timestamp: Date.now() });
    } catch (error) {
      console.error("Error sending contact message", error);
    }
  }
};