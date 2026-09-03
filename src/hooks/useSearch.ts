import { useState, useCallback, useEffect, useRef } from 'react';
import { jamendoService } from '@/lib/services/jamendoService';
import { JamendoTrack } from '@/lib/types/jamendo';

const DEBOUNCE_MS = 350;

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<JamendoTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track the latest requested query so out-of-order responses don't clobber newer ones
  const latestRequest = useRef(0);

  const runSearch = useCallback(async (term: string) => {
    const requestId = ++latestRequest.current;
    setLoading(true);
    setError(null);
    try {
      const tracks = await jamendoService.searchTracks(term);
      if (requestId !== latestRequest.current) return; // stale
      setResults(tracks);
    } catch (err) {
      if (requestId !== latestRequest.current) return; // stale
      // Use the error's own message — the service layer already extracted
      // the real server error (or a descriptive network error) into err.message.
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      if (requestId === latestRequest.current) {
        setLoading(false);
      }
    }
  }, []);

  const search = useCallback(
    (term: string) => {
      setQuery(term);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        runSearch(term);
      }, DEBOUNCE_MS);
    },
    [runSearch]
  );

  // Cancel pending debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return {
    query,
    setQuery: search,
    results,
    loading,
    error,
    search: runSearch,
  };
}
