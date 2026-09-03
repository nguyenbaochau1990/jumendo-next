import { useState, useRef, useCallback, useEffect } from 'react';
import { JamendoTrack } from '@/lib/types/jamendo';

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<JamendoTrack | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  // Use refs so event handlers always see the latest values without re-binding
  const currentRef = useRef<JamendoTrack | null>(null);
  const repeatRef = useRef(false);
  useEffect(() => {
    currentRef.current = current;
  }, [current]);
  useEffect(() => {
    repeatRef.current = repeat;
  }, [repeat]);

  // Keep the audio element's volume in sync with state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Wire up audio events exactly once — handlers read from refs
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };
    const handleLoadedMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleEnded = () => {
      if (repeatRef.current && currentRef.current) {
        // restart the same track
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    };
    const handleError = () => {
      setPlaying(false);
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

  const playTrack = useCallback(async (track: JamendoTrack) => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (currentRef.current?.id !== track.id) {
        currentRef.current = track;
        setCurrent(track);
        setProgress(0);
        setDuration(0);
        audio.src = `/api/jamendo/stream/${track.id}`;
        // Wait for the new src to be ready so play() doesn't race the load
        await new Promise<void>((resolve) => {
          const onCanPlay = () => {
            audio.removeEventListener('canplay', onCanPlay);
            audio.removeEventListener('error', onError);
            resolve();
          };
          const onError = () => {
            audio.removeEventListener('canplay', onCanPlay);
            audio.removeEventListener('error', onError);
            resolve();
          };
          audio.addEventListener('canplay', onCanPlay);
          audio.addEventListener('error', onError);
          audio.load();
        });
      }

      await audio.play();
      setPlaying(true);
    } catch (err) {
      console.error('Failed to play track:', err);
    }
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentRef.current) return;
    if (audio.paused) {
      audio.play().catch((err) => console.error('Playback was blocked:', err));
    } else {
      audio.pause();
    }
  }, []);

  // Seek the underlying audio element, then mirror the new position into state.
  // Without this, the slider only moves the display — the next `timeupdate`
  // snaps playback back to its real position.
  const seek = useCallback((value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Number.isFinite(value) ? Math.max(0, value) : 0;
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = Math.min(clamped, audio.duration);
    } else {
      audio.currentTime = clamped;
    }
    setProgress(audio.currentTime);
  }, []);

  return {
    audioRef,
    current,
    playing,
    progress,
    duration,
    volume,
    shuffle,
    repeat,
    setCurrent,
    setPlaying,
    setProgress,
    setDuration,
    setVolume,
    setShuffle,
    setRepeat,
    playTrack,
    togglePlay,
    setProgressBound: seek,
    setVolumeBound: setVolume,
  };
}
