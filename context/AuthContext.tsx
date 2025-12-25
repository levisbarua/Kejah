
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebaseConfig';
import { databaseService } from '../services/databaseService';
import { firebaseAuth } from '../services/firebaseAuth';
import { mockAuth } from '../services/mockFirebase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  verifyPhone: (phoneNumber: string) => Promise<void>;
  loading: boolean;
  isNewSignup: boolean;
  clearNewSignupParams: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewSignup, setIsNewSignup] = useState(false);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const profile = await databaseService.getUserById(firebaseUser.uid);
          setUser(profile);
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Mock Auth initialization
      setUser(mockAuth.currentUser);
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    if (isFirebaseConfigured) {
      await firebaseAuth.signIn(email, password);
    } else {
      const user = await mockAuth.login(email, password);
      setUser(user);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    if (isFirebaseConfigured) {
      await firebaseAuth.signUp(name, email, password);
    } else {
      const user = await mockAuth.signUp(name, email, password);
      setUser(user);
    }
    setIsNewSignup(true);
  };

  const signOut = async () => {
    if (isFirebaseConfigured) {
      await firebaseAuth.logout();
    } else {
      await mockAuth.logout();
    }
    setUser(null);
    setIsNewSignup(false);
  };

  const verifyPhone = async (phoneNumber: string) => {
    if (isFirebaseConfigured) {
      // Logic for Firebase Phone Auth would go here
      // For now, we update the profile to simulate success
      console.warn("Phone verification triggered. Ensure Firebase Phone Auth is enabled.");
    } else {
      const updatedUser = await mockAuth.verifyPhone(phoneNumber);
      setUser(updatedUser);
    }
  };

  const clearNewSignupParams = () => setIsNewSignup(false);

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, verifyPhone, loading, isNewSignup, clearNewSignupParams }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
