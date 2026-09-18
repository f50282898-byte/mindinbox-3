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
  const { setDisplayName } = useStore();

  useEffect(() => {
    // If auth is not initialized (e.g. on SSR), we skip
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        if (user && user.displayName) {
          setDisplayName(user.displayName);
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

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

