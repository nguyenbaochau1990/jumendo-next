import { create } from 'zustand';
import { jamendoService } from '@/lib/services/jamendoService';
import type { JamendoTrack } from '@/lib/types/jamendo';

const DEBOUNCE_MS = 350;

type SearchState = {
  query: string;
  results: JamendoTrack[];
  loading: boolean;
  error: string | null;
  // Debounced setter — used by the search input. Updates `query` immediately
  // (so the input stays responsive) and schedules a fetch.
  setQuery: (term: string) => void;
  // Immediate re-run with the current term. Used by "Refresh catalog".
  refresh: () => void;
  // Bypass debounce entirely — used for the initial '' load on mount.
  search: (term: string) => void;
};

export const useSearchStore = create<SearchState>((set, get) => {
  // Closure-held: the debounce timer and the latest-request token need to
  // outlive any single component, but they belong to this store alone, so
  // they live in the factory closure rather than as module-scope state.
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let latestRequest = 0;

  const run = async (term: string) => {
    const id = ++latestRequest;
    set({ loading: true, error: null });
    try {
      const results = await jamendoService.searchTracks(term);
      if (id !== latestRequest) return; // stale
      set({ results });
    } catch (err) {
      if (id !== latestRequest) return;
      set({ error: err instanceof Error ? err.message : 'Search failed' });
    } finally {
      if (id === latestRequest) set({ loading: false });
    }
  };

  return {
    query: '',
    results: [],
    loading: false,
    error: null,
    setQuery: (term) => {
      set({ query: term });
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => run(term), DEBOUNCE_MS);
    },
    refresh: () => run(get().query),
    search: (term) => {
      set({ query: term });
      if (debounceTimer) clearTimeout(debounceTimer);
      run(term);
    },
  };
});

