import { useState, useCallback, useEffect } from 'react';

export function useLikedTracks() {
  const [liked, setLiked] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Load from localStorage only after mounting on the client
  useEffect(() => {
    const saved = localStorage.getItem('likedTracks');
    if (saved) {
      setLiked(JSON.parse(saved));
    }
    setIsMounted(true);
  }, []);

  // 2. Persist to localStorage whenever liked changes (skipping the initial server render)
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('likedTracks', JSON.stringify(liked));
    }
  }, [liked, isMounted]);

  const toggleLike = useCallback((id: string) => {
    setLiked((prev) =>
      prev.includes(id)
        ? prev.filter((trackId) => trackId !== id)
        : [...prev, id]
    );
  }, []);

  return { liked, toggleLike };
}
