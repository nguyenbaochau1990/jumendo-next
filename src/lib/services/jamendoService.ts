import { JamendoTrack } from '@/lib/types/jamendo';

/**
 * Throw an Error whose message is the most informative thing we can extract
 * from a failed response — server-provided error text, or the response status.
 */
async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const data = (await res.json()) as { error?: unknown };
    if (data && typeof data.error === 'string' && data.error.trim()) {
      return data.error;
    }
  } catch {
    // body wasn't JSON — fall through
  }
  return `${fallback} (HTTP ${res.status})`;
}

export const jamendoService = {
  /**
   * Search for tracks using the Jamendo API
   */
  searchTracks: async (query: string): Promise<JamendoTrack[]> => {
    let res: Response;
    try {
      res = await fetch(`/api/jamendo/search?q=${encodeURIComponent(query)}`);
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : 'Could not reach the server'
      );
    }
    if (!res.ok) {
      throw new Error(await readError(res, 'Search request failed'));
    }
    return res.json();
  },

  /**
   * Get stream URL for a track
   */
  getStreamUrl: (trackId: string): string => {
    return `/api/jamendo/stream/${trackId}`;
  },

  /**
   * Get detailed information for a specific track
   */
  getTrackDetails: async (trackId: string): Promise<JamendoTrack> => {
    const res = await fetch(`/api/jamendo/search?q=id:${trackId}`);
    if (!res.ok) {
      throw new Error(await readError(res, 'Failed to fetch track details'));
    }
    const data = (await res.json()) as JamendoTrack[];
    if (!data || data.length === 0) {
      throw new Error('Track not found');
    }
    return data[0];
  },
};

