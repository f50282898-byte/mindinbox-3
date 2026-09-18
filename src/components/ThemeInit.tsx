'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export default function ThemeInit() {
  const { setTheme } = useStore();

  useEffect(() => {
    // Determine theme based on local time
    const hour = new Date().getHours();
    // Day mode: 6 AM to 6 PM (6 to 17)
    // Night mode: 6 PM to 6 AM (18 to 5)
    if (hour >= 6 && hour < 18) {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }, [setTheme]);

  return null;
}

