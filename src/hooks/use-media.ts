'use client';
import { useState, useEffect } from 'react';

function useMedia(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Set initial value on mount (client-side only)
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const updateMatch = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener('change', updateMatch);
    return () => mediaQueryList.removeEventListener('change', updateMatch);
  }, [query]);

  return matches;
}

export default useMedia;
