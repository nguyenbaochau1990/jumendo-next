import { JamendoTrack } from '@/lib/types/jamendo';
import { artworkUrl } from '@/lib/utils/artworkUrl';
import { formatTime } from '@/lib/utils/formatTime';
import { Play, Heart, MoreHorizontal } from 'lucide-react';

interface TrackCardProps {
  track: JamendoTrack;
  onPlay: (track: JamendoTrack) => void;
  onLike: (id: string) => void;
  liked: string[];
}

export default function TrackCard({
  track,
  onPlay,
  onLike,
  liked,
}: TrackCardProps) {
  const isLiked = liked.includes(track.id);

  return (
    <div className="group min-w-0">
      <div className="relative aspect-square overflow-hidden rounded-2.5 bg-card-bg">
        <img
          src={artworkUrl(track)}
          alt={track.name}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <button
          onClick={() => onPlay(track)}
          aria-label={`Play ${track.name}`}
          className="absolute bottom-2 right-2 grid h-9.5 w-9.5 translate-y-1 place-items-center rounded-full bg-accent text-accent-fg opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Play size={18} fill="currentColor" />
        </button>
      </div>
      <div className="mt-2.5 truncate text-[13px] font-semibold">
        {track.name}
      </div>
      <div className="mt-1 truncate text-[11px] text-text-dim">
        {track.artist_name} · {track.musicinfo?.tags?.genres?.[0] || 'Music'}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <button
          onClick={() => onLike(track.id)}
          aria-label="Toggle like"
          className={`p-1 transition-colors hover:text-accent ${isLiked ? 'text-accent' : 'text-icon-idle'}`}
        >
          <Heart size={17} fill={isLiked ? 'currentColor' : 'none'} />
        </button>
        <span className="text-xs text-text-dim">
          {formatTime(track.duration)}
        </span>
        <button
          aria-label="More options"
          className="text-icon-idle-3 transition-colors hover:text-text-faded-2"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}
