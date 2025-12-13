'use client';

import { useRef, useEffect } from 'react';

export function useClientOnce(fn: () => void): void {
  const canCall = useRef(true);
  useEffect(() => {
    if (typeof window !== 'undefined' && canCall.current) {
      canCall.current = false;
      fn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}