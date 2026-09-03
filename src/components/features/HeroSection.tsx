import { Play } from 'lucide-react';
import { artworkUrl } from '../../lib/utils/artworkUrl';
import { JamendoTrack } from '../../lib/types/jamendo';

interface HeroSectionProps {
  visibleTracks: JamendoTrack[];
  query: string;
  onPlayFirst: () => void;
  onRefresh: () => void;
}

export default function HeroSection({
  visibleTracks,
  query,
  onPlayFirst,
  onRefresh,
}: HeroSectionProps) {
  return (
    <div
      className="grid min-h-77.5 grid-cols-[1fr_330px] gap-0 overflow-hidden rounded-5 px-11 py-9.5 max-md:grid-cols-1 max-md:min-h-0 max-md:p-7 max-[1050px]:grid-cols-[1fr_260px]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 80% 20%, #454f26 0, #242a18 30%, #151912 62%, #111318 100%)',
      }}
    >
      <div>
        <div className="text-[11px] font-bold tracking-[0.16em] text-text-eyebrow">
          FREE MUSIC CATALOG
        </div>
        <h1 className="my-2.5 font-display text-[54px] font-bold leading-[1.03] tracking-[-0.04em] max-md:text-[42px]">
          Independent music.
          <br />
          One player.
        </h1>
        <p className="max-w-122.5 text-sm leading-[1.6] text-text-faded">
          Search the Jamendo catalog and stream real tracks directly in this
          Next.js app.
        </p>
        <div className="mt-5.5 flex gap-2.5">
          <button
            className="flex items-center gap-2 rounded-2.25 bg-accent px-4.25 py-2.75 text-[13px] font-bold text-accent-fg"
            onClick={onPlayFirst}
          >
            <Play size={18} fill="currentColor" /> Play now
          </button>
          <button
            className="rounded-2.25 border border-ghost-bd px-4.5 py-2.5 text-[13px] text-text"
            onClick={onRefresh}
          >
            Refresh catalog
          </button>
        </div>
      </div>
      {visibleTracks[0] && (
        <div className="relative flex items-center justify-center max-md:hidden">
          <img
            src={artworkUrl(visibleTracks[0])}
            alt=""
            className="z-2 h-55 w-55 rounded-xl object-cover shadow-[0_25px_50px_#0009]"
          />
          <div
            className="absolute right-4.5 z-1 h-47.5 w-47.5 translate-x-1/2 rounded-full"
            style={{
              backgroundImage:
                'repeating-radial-gradient(circle, #181818 0 3px, #090909 4px 7px)',
            }}
          />
        </div>
      )}
    </div>
  );
}
