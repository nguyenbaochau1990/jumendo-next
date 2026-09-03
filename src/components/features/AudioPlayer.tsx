import { useEffect, useRef } from 'react';
import { usePlayerStore, setAudioElement } from '@/stores/playerStore';
import { useLikedStore } from '@/stores/likedStore';
import { formatTime } from '@/lib/utils/formatTime';
import { artworkUrl } from '@/lib/utils/artworkUrl';
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

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Hand the <audio> element to the store so actions can drive it without
  // threading a ref through every caller. The store has a module-level
  // singleton ref + a setter; we register on mount, unregister on unmount.
  useEffect(() => {
    setAudioElement(audioRef.current);
    return () => setAudioElement(null);
  }, []);

  // Wire up audio events exactly once. Handlers push state into the store;
  // the store's actions read from the audio element via the singleton.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      usePlayerStore.setState({ progress: audio.currentTime });
    };
    const handleLoadedMetadata = () => {
      usePlayerStore.setState({
        duration: Number.isFinite(audio.duration) ? audio.duration : 0,
      });
    };
    const handlePlay = () => usePlayerStore.setState({ playing: true });
    const handlePause = () => usePlayerStore.setState({ playing: false });
    const handleEnded = () => {
      if (usePlayerStore.getState().repeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    };
    const handleError = () => {
      usePlayerStore.setState({ playing: false });
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} preload="metadata" className="hidden" />
      <div
        className="fixed inset-x-0 bottom-0 z-20 grid h-23 grid-cols-[1.2fr_1.5fr_1fr] items-center border-t border-border-3 px-6 backdrop-blur-xl max-md:h-19 max-md:grid-cols-[1fr_1.4fr] max-md:px-3 max-[1050px]:grid-cols-[1fr_1.4fr_0.7fr]"
        style={{ background: 'rgba(13, 15, 19, 0.97)' }}
      >
        <NowPlaying />
        <PlayerControls />
        <VolumeControl />
      </div>
    </>
  );
}

// --- Subcomponents -----------------------------------------------------------
// Each subscribes only to the slices it cares about. ProgressBar re-renders
// ~4x/s from `progress`/`duration`; everything else only re-renders when
// its own slice changes.

function NowPlaying() {
  const current = usePlayerStore((s) => s.current);
  const title = current?.name || 'Nothing playing';
  const artist = current?.artist_name || 'Search the Jamendo catalog';
  const artwork = artworkUrl(current, 200);

  return (
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
      {current && <LikeButton trackId={current.id} />}
    </div>
  );
}

function LikeButton({ trackId }: { trackId: string }) {
  // Render unliked during SSR + first client paint; flip to the real value
  // once the liked store has rehydrated from localStorage.
  const isLiked = useLikedStore(
    (s) => s.hasHydrated && s.liked.includes(trackId)
  );
  const toggleLike = usePlayerStore((s) => s.toggleLike);

  return (
    <button
      onClick={() => toggleLike(trackId)}
      aria-label="Toggle like"
      className={`ml-2 p-1 transition-colors hover:text-accent ${isLiked ? 'text-accent' : 'text-icon-idle'}`}
    >
      <Heart size={17} fill={isLiked ? 'currentColor' : 'none'} />
    </button>
  );
}

function PlayerControls() {
  const playing = usePlayerStore((s) => s.playing);
  const shuffle = usePlayerStore((s) => s.shuffle);
  const repeat = usePlayerStore((s) => s.repeat);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const toggleRepeat = usePlayerStore((s) => s.toggleRepeat);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-4 max-md:gap-2.5">
        <button
          onClick={toggleShuffle}
          aria-label="Shuffle"
          aria-pressed={shuffle}
          className={shuffle ? 'text-accent' : 'text-icon-idle-2'}
        >
          <Shuffle size={16} />
        </button>
        <button
          onClick={prev}
          aria-label="Previous"
          className="text-icon-idle-2"
        >
          <SkipBack size={19} fill="currentColor" />
        </button>
        <button
          onClick={togglePlay}
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
          onClick={next}
          aria-label="Next"
          className="text-icon-idle-2"
        >
          <SkipForward size={19} fill="currentColor" />
        </button>
        <button
          onClick={toggleRepeat}
          aria-label="Repeat"
          aria-pressed={repeat}
          className={repeat ? 'text-accent' : 'text-icon-idle-2'}
        >
          <Repeat2 size={16} />
        </button>
      </div>
      <ProgressBar />
    </div>
  );
}

function ProgressBar() {
  // Only this component re-renders on each timeupdate tick.
  const progress = usePlayerStore((s) => s.progress);
  const duration = usePlayerStore((s) => s.duration);
  const seek = usePlayerStore((s) => s.seek);

  return (
    <div className="flex w-full items-center gap-2 text-[9px] text-text-subtle max-md:gap-1.5">
      <span>{formatTime(progress)}</span>
      <input
        type="range"
        min={0}
        max={Math.max(duration, 1)}
        value={Math.min(progress, duration || 1)}
        onChange={(e) => seek(Number(e.target.value))}
        aria-label="Track progress"
        className="w-full accent-accent"
      />
      <span>{formatTime(duration)}</span>
    </div>
  );
}

function VolumeControl() {
  const volume = usePlayerStore((s) => s.volume);
  const setVolume = usePlayerStore((s) => s.setVolume);

  return (
    <div className="flex items-center justify-end gap-3 text-icon-tools max-md:hidden">
      <ListMusic size={18} />
      <Volume2 size={18} />
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        aria-label="Volume"
        className="w-full max-w-25 accent-accent"
      />
    </div>
  );
}
