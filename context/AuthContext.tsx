
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { mockAuth, mockFirestore } from '../services/mockFirebase';
import { User, UserRole } from '../types';

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
    const checkAuth = async () => {
      setUser(mockAuth.currentUser);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const signIn = async (email?: string, password?: string) => {
    const loggedInUser = await mockAuth.login(email, password);
    setUser(loggedInUser);
  };

  const signUp = async (name: string, email?: string, password?: string) => {
    const newUser = await mockAuth.signUp(name, email, password);
    setUser(newUser);
    setIsNewSignup(true);
  };

  const signOut = async () => {
    await mockAuth.logout();
    setUser(null);
    setIsNewSignup(false);
  };

  const verifyPhone = async (phoneNumber: string) => {
    const updatedUser = await mockAuth.verifyPhone(phoneNumber);
    setUser(updatedUser);
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
