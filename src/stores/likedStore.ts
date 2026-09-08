import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LikedState = {
  liked: string[];
  hasHydrated: boolean;
  toggle: (id: string) => void;
  isLiked: (id: string) => boolean;
  setHasHydrated: (value: boolean) => void;
};

export const useLikedStore = create<LikedState>()(
  persist(
    (set, get) => ({
      liked: [],
      hasHydrated: false,
      toggle: (id) =>
        set((s) => ({
          liked: s.liked.includes(id)
            ? s.liked.filter((x) => x !== id)
            : [...s.liked, id],
        })),
      isLiked: (id) => get().liked.includes(id),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'likedTracks',
      onRehydrateStorage: () => (state) => {
        // Fires after the persisted state is merged in. Flip the flag so
        // components can render the real "liked" value without a hydration
        // mismatch.
        state?.setHasHydrated(true);
      },
    }
  )
);

