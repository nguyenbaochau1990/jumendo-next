import { RefObject } from 'react';
import { formatTime } from '../../lib/utils/formatTime';
import { artworkUrl } from '../../lib/utils/artworkUrl';
import type { JamendoTrack } from '../../lib/types/jamendo';
import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat2,
  ListMusic,
  Volume2,
  Heart,
} from 'lucide-react';

interface AudioPlayerProps {
  audioRef: RefObject<HTMLAudioElement | null>;
  current: JamendoTrack | null;
  playing: boolean;
  progress: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSetShuffle: (value: boolean) => void;
  onSetRepeat: (value: boolean) => void;
  onSetProgress: (value: number) => void;
  onSetVolume: (value: number) => void;
  onToggleLike: (id: string) => void;
  liked: string[];
  likedMounted: boolean;
}

export default function AudioPlayer({
  audioRef,
  current,
  playing,
  progress,
  duration,
  volume,
  shuffle,
  repeat,
  onTogglePlay,
  onPrev,
  onNext,
  onSetShuffle,
  onSetRepeat,
  onSetProgress,
  onSetVolume,
  onToggleLike,
  liked,
  likedMounted,
}: AudioPlayerProps) {
  // Render unliked during SSR + first client paint; flip to the real value
  // once liked tracks have been rehydrated from localStorage.
  const isLiked = likedMounted && current ? liked.includes(current.id) : false;
  const title = current?.name || 'Nothing playing';
  const artist = current?.artist_name || 'Search the Jamendo catalog';
  const artwork = artworkUrl(current, 200);

  return (
    <>
      {/* The single audio element that powers playback */}
      <audio ref={audioRef} preload="metadata" className="hidden" />

      <div
        className="fixed inset-x-0 bottom-0 z-20 grid h-23 grid-cols-[1.2fr_1.5fr_1fr] items-center border-t border-border-3 px-6 backdrop-blur-xl max-md:h-19 max-md:grid-cols-[1fr_1.4fr] max-md:px-3 max-[1050px]:grid-cols-[1fr_1.4fr_0.7fr]"
        style={{ background: 'rgba(13, 15, 19, 0.97)' }}
      >
        <div className="flex min-w-0 items-center gap-3">
          {current ? (
            <img
              src={artwork}
              alt={current.name}
              className="h-13 w-13 rounded-md object-cover"
            />
          ) : (
            <div className="grid h-13 w-13 place-items-center rounded-md bg-now-bg text-[22px] text-accent">
              ♪
            </div>
          )}
          <div className="flex min-w-0 flex-col">
            <b className="truncate text-[13px]">{title}</b>
            <span className="mt-1 truncate text-[11px] text-text-meta">
              {artist}
            </span>
          </div>
          {current && (
            <button
              onClick={() => onToggleLike(current.id)}
              aria-label="Toggle like"
              className={`ml-2 p-1 transition-colors hover:text-accent ${isLiked ? 'text-accent' : 'text-icon-idle'}`}
            >
              <Heart size={17} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4 max-md:gap-2.5">
            <button
              onClick={() => onSetShuffle(!shuffle)}
              aria-label="Shuffle"
              aria-pressed={shuffle}
              className={shuffle ? 'text-accent' : 'text-icon-idle-2'}
            >
              <Shuffle size={16} />
            </button>
            <button
              onClick={onPrev}
              aria-label="Previous"
              className="text-icon-idle-2"
            >
              <SkipBack size={19} fill="currentColor" />
            </button>
            <button
              onClick={onTogglePlay}
              aria-label={playing ? 'Pause' : 'Play'}
              className="grid h-8.5 w-8.5 place-items-center rounded-full bg-white"
              style={{ color: '#111' }}
            >
              {playing ? (
                <Pause size={19} fill="currentColor" />
              ) : (
                <Play size={19} fill="currentColor" />
              )}
            </button>
            <button
              onClick={onNext}
              aria-label="Next"
              className="text-icon-idle-2"
            >
              <SkipForward size={19} fill="currentColor" />
            </button>
            <button
              onClick={() => onSetRepeat(!repeat)}
              aria-label="Repeat"
              aria-pressed={repeat}
              className={repeat ? 'text-accent' : 'text-icon-idle-2'}
            >
              <Repeat2 size={16} />
            </button>
          </div>
          <div className="flex w-full items-center gap-2 text-[9px] text-text-subtle max-md:gap-1.5">
            <span>{formatTime(progress)}</span>
            <input
              type="range"
              min={0}
              max={Math.max(duration, 1)}
              value={Math.min(progress, duration || 1)}
              onChange={(e) => {
                onSetProgress(Number(e.target.value));
              }}
              aria-label="Track progress"
              className="w-full accent-accent"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 text-icon-tools max-md:hidden">
          <ListMusic size={18} />
          <Volume2 size={18} />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => onSetVolume(Number(e.target.value))}
            aria-label="Volume"
            className="w-full max-w-25 accent-accent"
          />
        </div>
      </div>
    </>
  );
}
