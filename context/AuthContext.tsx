import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { mockAuth } from '../services/mockFirebase';

interface AuthContextType {
  user: User | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  verifyPhone: (phoneNumber: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial auth check
    const initAuth = async () => {
      // In real Firebase: onAuthStateChanged
      await new Promise(r => setTimeout(r, 500));
      setLoading(false);
    };
    initAuth();
  }, []);

  const signIn = async () => {
    try {
      const u = await mockAuth.login();
      setUser(u);
    } catch (e) {
      console.error(e);
    }
  };

  const signOut = async () => {
    await mockAuth.logout();
    setUser(null);
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

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, verifyPhone, loading }}>
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