'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useStore } from '@/store/useStore';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const { setDisplayName } = useStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        setCurrentUser(user);
        if (user) {
          if (user.displayName) {
            setDisplayName(user.displayName);
          }
          // Ensure user document exists in Firestore
          try {
            const { ensureUserDocument } = await import('@/lib/db');
            await ensureUserDocument(user);
          } catch (err) {
            console.error("Failed to ensure user document:", err);
          }
        }
        setLoading(false);
      },
      (error) => {
        console.error("Auth State Error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [setDisplayName]);

  // Prevent SSR hydration mismatch by only providing actual state after mount, 
  // but we can render children immediately to allow layout rendering.
  const value = {
    currentUser: isMounted ? currentUser : null,
    loading: !isMounted || loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

