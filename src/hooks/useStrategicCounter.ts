'use client';

import { useState, useEffect } from 'react';

export function useStrategicCounter(initial = 54) {
  const [count, setCount] = useState(initial);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        // Fluctuate slowly +1 or -1, but don't drop below 40 or go above 75
        const change = Math.random() > 0.5 ? 1 : -1;
        let next = prev + change;
        if (next < 40) next = 40;
        if (next > 75) next = 75;
        return next;
      });
    }, Math.random() * 60000 + 45000); // Between 45s and 105s

    return () => clearInterval(interval);
  }, []);

  return count;
}

