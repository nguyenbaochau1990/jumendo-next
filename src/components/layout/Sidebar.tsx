import { Home, Search, Library, Heart, Plus } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex w-60 flex-col overflow-y-auto overflow-x-hidden border-r border-border bg-surface px-4.5 py-6.5 scrollbar-thin">
      <div className="mb-9 ml-2.5 flex items-center gap-2.5 font-display text-2xl font-bold">
        <div className="grid h-8 w-8 place-items-center rounded-2.5 bg-accent text-xl text-accent-fg">
          P
        </div>
        <span>pulse</span>
      </div>

      <nav className="flex flex-col gap-1.5 border-b border-border-2 pb-6">
        <a className="flex items-center gap-3 rounded-2.5 bg-nav-active-bg px-3 py-2.5 text-sm text-text">
          <Home size={19} /> Home
        </a>
        <a className="flex items-center gap-3 rounded-2.5 px-3 py-2.5 text-sm text-text-muted">
          <Search size={19} /> Search
        </a>
        <a className="flex items-center gap-3 rounded-2.5 px-3 py-2.5 text-sm text-text-muted">
          <Library size={19} /> Your Library
        </a>
      </nav>

      <div className="flex flex-col gap-1.5 py-6">
        <div className="mb-2 flex items-center justify-between px-3 text-[10px] font-bold uppercase tracking-widest text-text-search">
          Your Library <Plus size={16} />
        </div>
        <a className="flex items-center gap-3 rounded-2.5 px-3 py-2.5 text-sm text-text">
          <Heart size={17} fill="currentColor" /> Liked Songs
        </a>
        <a className="flex items-center gap-3 rounded-2.5 px-3 py-2.5 text-sm text-text-muted">
          Recently Played
        </a>
        <a className="flex items-center gap-3 rounded-2.5 px-3 py-2.5 text-sm text-text-muted">
          Made For You
        </a>
      </div>

      <div className="flex flex-col gap-0.5">
        <div className="mb-2 flex items-center justify-between px-3 text-[10px] font-bold uppercase tracking-widest text-text-search">
          Playlists <Plus size={16} />
        </div>
        <a className="block rounded-2.5 px-3 py-2 text-sm text-text-muted">
          Late Night Coding
        </a>
        <a className="block rounded-2.5 px-3 py-2 text-sm text-text-muted">
          Focus
        </a>
        <a className="block rounded-2.5 px-3 py-2 text-sm text-text-muted">
          Weekend Energy
        </a>
        <a className="block rounded-2.5 px-3 py-2 text-sm text-text-muted">
          Discover Weekly
        </a>
      </div>

      <div
        className="mt-auto rounded-3.5 border border-border-4 p-4"
        style={{
          backgroundImage:
            'linear-gradient(145deg, var(--color-upgrade-from), var(--color-upgrade-to))',
        }}
      >
        <div className="font-bold">Jamendo</div>
        <p className="mt-2 text-xs leading-normal text-text-faint">
          Stream independent music from the Jamendo catalog.
        </p>
        <a
          className="mt-3 inline-block rounded-lg bg-white px-3 py-2 text-xs font-bold text-accent-fg"
          href="https://www.jamendo.com/"
          target="_blank"
          rel="noreferrer"
        >
          Explore Jamendo
        </a>
      </div>
    </aside>
  );
}
