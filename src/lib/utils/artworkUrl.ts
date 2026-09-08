import type { JamendoTrack } from '../types/jamendo';

export const artworkUrl = (
  track: JamendoTrack | null | undefined,
  size = 600
): string => {
  if (!track) return '/placeholder.png';
  const url = track.album_image || track.image;
  return url ? url.replace(/width=\d+/, `width=${size}`) : '/placeholder.png';
};

