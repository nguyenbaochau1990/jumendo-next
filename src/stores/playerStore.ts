import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { JamendoTrack } from '@/lib/types/jamendo';
import { useLikedStore } from './likedStore';

// The single <audio> element lives outside the store (a useRef can't live
// inside a Zustand factory). The component that renders <audio> calls
// setAudioElement() once on mount; store actions read it via audio() below.
let _audioEl: HTMLAudioElement | null = null;
export function setAudioElement(el: HTMLAudioElement | null) {
  _audioEl = el;
}
function audio(): HTMLAudioElement {
  if (!_audioEl) {
    throw new Error('Audio element accessed before mount');
  }
  return _audioEl;
}

type PlayerState = {
  // state
  current: JamendoTrack | null;
  playing: boolean;
  progress: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: boolean;
  // The current track list (synced from useSearch by MusicApp). Needed for
  // next/prev to know what to play. Not persisted.
  tracks: JamendoTrack[];
  // actions
  playTrack: (track: JamendoTrack) => Promise<void>;
  togglePlay: () => void;
  seek: (value: number) => void;
  setVolume: (value: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  next: () => void;
  prev: () => void;
  toggleLike: (id: string) => void;
  setTracks: (tracks: JamendoTrack[]) => void;
  // internal: keep volume + prefs in sync with the <audio> element
  _bindVolume: () => void;
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      current: null,
      playing: false,
      progress: 0,
      duration: 0,
      volume: 0.8,
      shuffle: false,
      repeat: false,
      tracks: [],

      _bindVolume: () => {
        try {
          audio().volume = get().volume;
        } catch {
          // audio element not mounted yet — fine, bind later
        }
      },

      playTrack: async (track) => {
        try {
          const a = audio();
          if (get().current?.id !== track.id) {
            set({ current: track, progress: 0, duration: 0 });
            a.src = `/api/jamendo/stream/${track.id}`;
            // Wait for the new src to be ready so play() doesn't race the load.
            await new Promise<void>((resolve) => {
              const onCanPlay = () => {
                a.removeEventListener('canplay', onCanPlay);
                a.removeEventListener('error', onError);
                resolve();
              };
              const onError = () => {
                a.removeEventListener('canplay', onCanPlay);
                a.removeEventListener('error', onError);
                resolve();
              };
              a.addEventListener('canplay', onCanPlay);
              a.addEventListener('error', onError);
              a.load();
            });
          }
          get()._bindVolume();
          await a.play();
          set({ playing: true });
        } catch (err) {
          console.error('Failed to play track:', err);
        }
      },

      togglePlay: () => {
        try {
          const a = audio();
          if (!get().current) return;
          if (a.paused) {
            a.play().catch((err) => console.error('Playback was blocked:', err));
          } else {
            a.pause();
          }
        } catch {
          // no audio element — ignore
        }
      },

      // Seek the underlying audio element, then mirror the new position
      // into state. Without this, the slider only moves the display — the
      // next `timeupdate` snaps playback back to its real position.
      seek: (value) => {
        try {
          const a = audio();
          const clamped = Number.isFinite(value) ? Math.max(0, value) : 0;
          if (Number.isFinite(a.duration) && a.duration > 0) {
            a.currentTime = Math.min(clamped, a.duration);
          } else {
            a.currentTime = clamped;
          }
          set({ progress: a.currentTime });
        } catch {
          // no audio element — ignore
        }
      },

      setVolume: (value) => {
        set({ volume: value });
        try {
          audio().volume = value;
        } catch {
          // not mounted yet
        }
      },

      toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
      toggleRepeat: () => set((s) => ({ repeat: !s.repeat })),

      next: () => {
        const { tracks, current, shuffle } = get();
        if (!tracks.length) return;
        const i = current
          ? tracks.findIndex((t) => t.id === current.id)
          : -1;
        const ni = shuffle
          ? Math.floor(Math.random() * tracks.length)
          : (i + 1) % tracks.length;
        get().playTrack(tracks[ni]);
      },

      prev: () => {
        const { tracks, current, shuffle } = get();
        if (!tracks.length) return;
        const i = current
          ? tracks.findIndex((t) => t.id === current.id)
          : 0;
        const pi = shuffle
          ? Math.floor(Math.random() * tracks.length)
          : (i - 1 + tracks.length) % tracks.length;
        get().playTrack(tracks[pi]);
      },

      toggleLike: (id) => useLikedStore.getState().toggle(id),

      setTracks: (tracks) => set({ tracks }),
    }),
    {
      name: 'pulse-player',
      // Only persist user preferences — never the playback state.
      partialize: (s) => ({
        volume: s.volume,
        shuffle: s.shuffle,
        repeat: s.repeat,
      }),
    }
  )
);
