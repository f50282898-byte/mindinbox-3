'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';

export const useAutoGhost = (timeoutSeconds: number = 45) => {
  const [isGhostMode, setIsGhostMode] = useState(false);
  const { isPro } = useStore(); // Could check if user is logged in if we have auth state

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      setIsGhostMode(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsGhostMode(true);
      }, timeoutSeconds * 1000);
    };

    // Initialize timer
    resetTimer();

    // Listeners for activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [timeoutSeconds]);

  return isGhostMode;
};

