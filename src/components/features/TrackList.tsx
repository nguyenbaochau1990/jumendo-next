import { JamendoTrack } from '@/lib/types/jamendo';
import { artworkUrl } from '@/lib/utils/artworkUrl';
import { formatTime } from '@/lib/utils/formatTime';
import { usePlayerStore } from '@/stores/playerStore';
import { useLikedStore } from '@/stores/likedStore';
import TrackCard from './TrackCard';
import { Heart, MoreHorizontal } from 'lucide-react';

const CARD_LIMIT = 12;
const TABLE_LIMIT = 8;

export default function TrackList({ tracks }: { tracks: JamendoTrack[] }) {
  const visibleCards = tracks.slice(0, CARD_LIMIT);
  const visibleTable = tracks.slice(0, TABLE_LIMIT);

  return (
    <>
      {!tracks.length ? (
        <p className="py-4 text-center text-text-faint">No tracks found</p>
      ) : (
        <>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="font-display text-[21px] font-semibold">
                Featured results
              </h2>
              <p className="mt-1 text-xs text-section-meta">
                {tracks.length} tracks from the Jamendo catalog
              </p>
            </div>
          </div>

          {/* Card Grid */}
          <div className="mb-8 grid grid-cols-6 gap-4.5 max-md:grid-cols-2 max-[1050px]:grid-cols-4">
            {visibleCards.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>

          {/* Table View */}
          <div className="border-t border-table-divider">
            <div className="mb-4 mt-8 flex items-end justify-between">
              <div>
                <h2 className="font-display text-[21px] font-semibold">
                  Catalog tracks
                </h2>
                <p className="mt-1 text-xs text-section-meta">
                  Double-click a row to start playback.
                </p>
              </div>
            </div>
            <div>
              {visibleTable.map((track, i) => (
                <TableRow key={track.id} track={track} index={i} />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

function TableRow({ track, index }: { track: JamendoTrack; index: number }) {
  // Each row subscribes only to its own relevant slices so the table doesn't
  // re-render every time `progress` ticks.
  const isCurrent = usePlayerStore((s) => s.current?.id === track.id);
  const playing = usePlayerStore((s) => s.playing);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const toggleLike = usePlayerStore((s) => s.toggleLike);
  const isLiked = useLikedStore(
    (s) => s.hasHydrated && s.liked.includes(track.id)
  );

  return (
    <div
      onDoubleClick={() => playTrack(track)}
      className={`grid min-h-20 cursor-pointer grid-cols-[40px_60px_1.4fr_1fr_38px_60px_35px] items-center gap-3.5 border-b border-divider px-1.5 py-2.5 text-text-faded-2 hover:bg-surface-2 max-md:grid-cols-[25px_42px_1fr_38px_45px] ${isCurrent ? 'bg-surface-2' : ''}`}
    >
      <div className="text-center text-xs text-text-faint">
        {isCurrent && playing ? (
          <span className="tracking-[-2px] text-accent">▮▮▮</span>
        ) : (
          index + 1
        )}
      </div>
      <img
        src={artworkUrl(track, 100)}
        alt={track.name}
        className="h-15 w-15 rounded-lg object-cover"
      />
      <div className="flex min-w-0 flex-col">
        <b className="truncate text-[15px] font-semibold text-text">
          {track.name}
        </b>
        <span className="mt-1 truncate text-xs text-text-dim">
          {track.artist_name}
        </span>
      </div>
      <span className="truncate text-xs text-text-dim max-md:hidden">
        {track.album_name || 'Single'}
      </span>
      <button
        onClick={() => toggleLike(track.id)}
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
  );
}
