'use client';

import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useLikedTracks } from '@/hooks/useLikedTracks';
import MainLayout from './layout/MainLayout';
import SearchBar from './features/SearchBar';
import HeroSection from './features/HeroSection';
import TrackList from './features/TrackList';
import AudioPlayer from './features/AudioPlayer';
import type { JamendoTrack } from '@/lib/types/jamendo';

export default function MusicApp() {
  // Hooks
  const {
    query,
    setQuery,
    results: tracks,
    loading,
    error,
    search,
  } = useSearch();
  const {
    audioRef,
    current,
    playing,
    progress,
    duration,
    volume,
    shuffle,
    repeat,
    playTrack,
    togglePlay,
    setProgressBound,
    setVolumeBound,
    setShuffle,
    setRepeat,
  } = useAudioPlayer();
  const { liked, toggleLike } = useLikedTracks();

  // Initial load: search for empty query to get featured tracks
  useEffect(() => {
    search('');
  }, [search]);

  // Play first track helper
  const playFirstTrack = () => {
    if (tracks[0]) {
      playTrack(tracks[0]);
    }
  };

  // Refresh catalog (re-search current query)
  const refreshCatalog = () => {
    search(query);
  };

  // Next and previous track functions
  const handleNext = () => {
    if (!tracks.length) return;
    const index = current
      ? tracks.findIndex((t: JamendoTrack) => t.id === current.id)
      : -1;
    const nextIndex = shuffle
      ? Math.floor(Math.random() * tracks.length)
      : (index + 1) % tracks.length;
    playTrack(tracks[nextIndex]);
  };

  const handlePrev = () => {
    if (!tracks.length) return;
    const index = current
      ? tracks.findIndex((t: JamendoTrack) => t.id === current.id)
      : 0;
    const prevIndex = (index - 1 + tracks.length) % tracks.length;
    playTrack(tracks[prevIndex]);
  };

  return (
    <MainLayout>
      {/* Topbar with search */}
      <header className="sticky top-0 z-10 flex h-19 items-center gap-5 border-b border-topbar-border bg-topbar-bg px-8.5 backdrop-blur-[14px] max-md:px-4 max-md:[&_.history]:hidden">
        <div className="history flex gap-2">
          <button className="grid h-8 w-8 place-items-center rounded-full bg-history-btn">
            <ChevronLeft />
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-full bg-history-btn">
            <ChevronRight />
          </button>
        </div>
        <div className="flex h-10.5 w-95 items-center gap-2.5 rounded-5.5 border border-border-3 bg-surface-3 px-4.5 text-text-search max-md:w-full">
          <SearchBar value={query} onChange={setQuery} loading={loading} />
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-text-profile max-md:[&_span]:hidden">
          <div className="grid h-7.5 w-7.5 place-items-center rounded-full bg-avatar-bg text-[10px] font-bold text-text">
            BC
          </div>
          <span>Guest</span>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-295 px-8.5 py-7.5 max-md:px-4 max-md:py-5">
        {/* Error Banner */}
        {error && (
          <div className="mt-4.5 mb-0 rounded-lg border border-danger-bd bg-danger-bg px-3.5 py-2.5 text-xs text-danger-fg">
            {error}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && !tracks.length && (
          <div className="flex min-h-40 items-center justify-center gap-2.5 text-[13px] text-text-faint">
            <Loader2 className="spin" size={22} /> Loading Jamendo…
          </div>
        )}

        {/* Hero Section */}
        <HeroSection
          visibleTracks={tracks.slice(0, 12)}
          query={query}
          onPlayFirst={playFirstTrack}
          onRefresh={refreshCatalog}
        />

        {/* Track List */}
        <TrackList
          tracks={tracks}
          current={current}
          playing={playing}
          liked={liked}
          onPlayTrack={playTrack}
          onToggleLike={toggleLike}
          onPlay={togglePlay}
          onPause={togglePlay}
          onPrev={handlePrev}
          onNext={handleNext}
          shuffle={shuffle}
          repeat={repeat}
        />
      </section>

      {/* Audio Player */}
      <AudioPlayer
        audioRef={audioRef}
        current={current}
        playing={playing}
        progress={progress}
        duration={duration}
        volume={volume}
        shuffle={shuffle}
        repeat={repeat}
        onTogglePlay={togglePlay}
        onPrev={handlePrev}
        onNext={handleNext}
        onSetShuffle={setShuffle}
        onSetRepeat={setRepeat}
        onSetProgress={setProgressBound}
        onSetVolume={setVolumeBound}
        onToggleLike={toggleLike}
        liked={liked}
      />
    </MainLayout>
  );
}
