import React, { createContext, useContext, useState, useEffect, ReactNode, PropsWithChildren } from 'react';
import { User } from '../types';
import { mockAuth } from '../services/mockFirebase';

interface AuthContextType {
  user: User | null;
  signIn: (email?: string, password?: string) => Promise<void>;
  signUp: (name: string, email?: string, password?: string) => Promise<void>;
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
    // Simulate initial auth check
    const initAuth = async () => {
      // In real Firebase: onAuthStateChanged
      await new Promise(r => setTimeout(r, 500));
      setLoading(false);
    };
    initAuth();
  }, []);

  const signIn = async (email?: string, password?: string) => {
    try {
      const u = await mockAuth.login(email, password);
      setUser(u);
      setIsNewSignup(false);
    } catch (e) {
      console.error(e);
    }
  };

  const signUp = async (name: string, email?: string, password?: string) => {
    try {
      const u = await mockAuth.signUp(name, email, password);
      setUser(u);
      setIsNewSignup(true);
    } catch (e) {
      console.error(e);
    }
  };

  const signOut = async () => {
    await mockAuth.logout();
    setUser(null);
    setIsNewSignup(false);
  };

  const verifyPhone = async (phoneNumber: string) => {
    try {
      const updatedUser = await mockAuth.verifyPhone(phoneNumber);
      setUser(updatedUser);
    } catch (e) {
      console.error(e);
      throw e;
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