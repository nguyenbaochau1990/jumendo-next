'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Home,
  Search,
  Library,
  Heart,
  Plus,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat2,
  Volume2,
  ListMusic,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';

type JamendoTrack = {
  id: string;
  name: string;
  duration: number;
  artist_name: string;
  album_name?: string;
  album_image?: string;
  image?: string;
  releasedate?: string;
  musicinfo?: { tags?: { genres?: string[] } };
};

const fmt = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
const artwork = (track: JamendoTrack, size = 600) => {
  const url = track.album_image || track.image;
  return url ? url.replace(/width=\d+/, `width=${size}`) : '/placeholder.png';
};

export default function MusicApp() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [tracks, setTracks] = useState<JamendoTrack[]>([]);
  const [current, setCurrent] = useState<JamendoTrack | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [query, setQuery] = useState('');
  const [liked, setLiked] = useState<string[]>([]);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [searching, setSearching] = useState(true);
  const [error, setError] = useState('');

  const search = async (term: string) => {
    setSearching(true);
    setError('');
    try {
      const response = await fetch(
        `/api/jamendo/search?q=${encodeURIComponent(term)}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Search failed');
      setTracks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed');
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    // Initialize with empty search to load featured tracks
    const initSearch = async () => {
      await search('');
    };
    initSearch();
  }, []);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => search(query), 350);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [query]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  const visibleTracks = useMemo(() => tracks.slice(0, 12), [tracks]);

  async function playTrack(track: JamendoTrack) {
    const audio = audioRef.current;
    if (!audio) return;
    setError('');
    const src = `/api/jamendo/stream/${track.id}`;
    if (current?.id !== track.id) {
      audio.src = src;
      setCurrent(track);
      setProgress(0);
    }
    try {
      await audio.play();
      setPlaying(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not play this track');
    }
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (audio.paused)
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setError('Playback was blocked by the browser'));
    else {
      audio.pause();
      setPlaying(false);
    }
  }

  function next() {
    if (!tracks.length) return;
    const index = current ? tracks.findIndex((t) => t.id === current.id) : -1;
    const nextIndex = shuffle
      ? Math.floor(Math.random() * tracks.length)
      : (index + 1) % tracks.length;
    playTrack(tracks[nextIndex]);
  }

  function prev() {
    if (!tracks.length) return;
    const index = current ? tracks.findIndex((t) => t.id === current.id) : 0;
    playTrack(tracks[(index - 1 + tracks.length) % tracks.length]);
  }

  function toggleLike(id: string) {
    setLiked((items) =>
      items.includes(id) ? items.filter((x) => x !== id) : [...items, id]
    );
  }

  const title = current?.name || 'Nothing playing';
  const artist = current?.artist_name || 'Search the Jamendo catalog';

  return (
    <div className="app-shell">
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => (repeat ? playTrack(current!) : next())}
        onError={() =>
          setError('This track could not be streamed. Try another track.')
        }
      />
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">P</div>
          <span>pulse</span>
        </div>
        <nav className="nav">
          <a className="active">
            <Home size={19} /> Home
          </a>
          <a>
            <Search size={19} /> Search
          </a>
          <a>
            <Library size={19} /> Your Library
          </a>
        </nav>
        <div className="side-section">
          <div className="side-title">
            Your Library <Plus size={16} />
          </div>
          <a>
            <Heart size={17} fill="currentColor" /> Liked Songs
          </a>
          <a>Recently Played</a>
          <a>Made For You</a>
        </div>
        <div className="playlist-list">
          <div className="side-title">
            Playlists <Plus size={16} />
          </div>
          <a>Late Night Coding</a>
          <a>Focus</a>
          <a>Weekend Energy</a>
          <a>Discover Weekly</a>
        </div>
        <div className="upgrade">
          <div className="upgrade-title">Jamendo</div>
          <p>Stream independent music from the Jamendo catalog.</p>
          <a
            className="upgrade-link"
            href="https://www.jamendo.com/"
            target="_blank"
            rel="noreferrer"
          >
            Explore Jamendo
          </a>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="history">
            <button>
              <ChevronLeft />
            </button>
            <button>
              <ChevronRight />
            </button>
          </div>
          <div className="search">
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search songs, artists and albums"
            />
          </div>
          <div className="profile">
            <div className="avatar">BC</div>
            <span>Guest</span>
          </div>
        </header>

        <section className="content">
          <div className="hero">
            <div>
              <div className="eyebrow">FREE MUSIC CATALOG</div>
              <h1>
                Independent music.
                <br />
                One player.
              </h1>
              <p>
                Search the Jamendo catalog and stream real tracks directly in
                this Next.js app.
              </p>
              <div className="hero-actions">
                <button
                  className="primary"
                  onClick={() =>
                    visibleTracks[0] && playTrack(visibleTracks[0])
                  }
                >
                  <Play size={18} fill="currentColor" /> Play now
                </button>
                <button className="ghost" onClick={() => search(query)}>
                  Refresh catalog
                </button>
              </div>
            </div>
            {visibleTracks[0] && (
              <div className="hero-art">
                <img src={artwork(visibleTracks[0])} alt="" />
                <div className="vinyl" />
              </div>
            )}
          </div>

          {error && <div className="error-banner">{error}</div>}

          <div className="section-head">
            <div>
              <h2>{query ? 'Search results' : 'Featured results'}</h2>
              <p>
                {searching
                  ? 'Searching Jamendo…'
                  : `${tracks.length} tracks from the Jamendo catalog`}
              </p>
            </div>
            <button className="see" onClick={() => search(query)}>
              Refresh
            </button>
          </div>

          {searching ? (
            <div className="loading">
              <Loader2 className="spin" size={22} /> Loading Jamendo…
            </div>
          ) : (
            <div className="cards">
              {visibleTracks.map((track) => (
                <article className="card" key={track.id}>
                  <div className="cover-wrap">
                    <img src={artwork(track)} alt="" />
                    <button
                      className="card-play"
                      onClick={() => playTrack(track)}
                    >
                      <Play size={18} fill="currentColor" />
                    </button>
                  </div>
                  <div className="card-title">{track.name}</div>
                  <div className="card-meta">
                    {track.artist_name} ·{' '}
                    {track.musicinfo?.tags?.genres?.[0] || 'Music'}
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="section-head">
            <div>
              <h2>Catalog tracks</h2>
              <p>Double-click a row to start playback.</p>
            </div>
          </div>
          <div className="table">
            {visibleTracks.slice(0, 8).map((track, i) => (
              <div
                className={`row ${track.id === current?.id ? 'selected' : ''}`}
                key={track.id}
                onDoubleClick={() => playTrack(track)}
              >
                <div className="num">
                  {track.id === current?.id && playing ? (
                    <span className="bars">▮▮▮</span>
                  ) : (
                    i + 1
                  )}
                </div>
                <img src={artwork(track, 100)} alt="" />
                <div className="track-info">
                  <b>{track.name}</b>
                  <span>{track.artist_name}</span>
                </div>
                <span className="album">{track.album_name || 'Single'}</span>
                <button
                  className={`heart ${liked.includes(track.id) ? 'liked' : ''}`}
                  onClick={() => toggleLike(track.id)}
                >
                  <Heart
                    size={17}
                    fill={liked.includes(track.id) ? 'currentColor' : 'none'}
                  />
                </button>
                <span className="duration">{fmt(track.duration)}</span>
                <button className="more">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="player">
        <div className="now">
          {current ? (
            <img src={artwork(current, 200)} alt="" />
          ) : (
            <div className="now-placeholder">♪</div>
          )}
          <div>
            <b>{title}</b>
            <span>{artist}</span>
          </div>
          {current && (
            <button
              className={`heart ${liked.includes(current.id) ? 'liked' : ''}`}
              onClick={() => toggleLike(current.id)}
            >
              <Heart
                size={17}
                fill={liked.includes(current.id) ? 'currentColor' : 'none'}
              />
            </button>
          )}
        </div>
        <div className="controls">
          <div className="control-buttons">
            <button
              onClick={() => setShuffle(!shuffle)}
              className={shuffle ? 'on' : ''}
            >
              <Shuffle size={16} />
            </button>
            <button onClick={prev}>
              <SkipBack size={19} fill="currentColor" />
            </button>
            <button className="play-btn" onClick={togglePlay}>
              {playing ? (
                <Pause size={19} fill="currentColor" />
              ) : (
                <Play size={19} fill="currentColor" />
              )}
            </button>
            <button onClick={next}>
              <SkipForward size={19} fill="currentColor" />
            </button>
            <button
              onClick={() => setRepeat(!repeat)}
              className={repeat ? 'on' : ''}
            >
              <Repeat2 size={16} />
            </button>
          </div>
          <div className="progress">
            <span>{fmt(progress)}</span>
            <input
              aria-label="Track progress"
              type="range"
              min="0"
              max={Math.max(duration, 1)}
              value={Math.min(progress, duration || 1)}
              onChange={(e) => {
                const value = Number(e.target.value);
                setProgress(value);
                if (audioRef.current) audioRef.current.currentTime = value;
              }}
            />
            <span>{fmt(duration)}</span>
          </div>
        </div>
        <div className="player-tools">
          <ListMusic size={18} />
          <Volume2 size={18} />
          <input
            aria-label="Volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
