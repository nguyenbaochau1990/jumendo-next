# Plan: Migrate to Tailwind CSS v4

## Context

The project currently uses a hand-written `app/globals.css` (683 lines) with class names like `.sidebar`, `.row`, `.player`, `.cover-wrap`, `.cards`, `.section-head`, etc. Several components (`SearchBar`, `TrackCard`, `TrackList`, `AudioPlayer`) also have inline `style={{}}` blocks. The user wants to switch to Tailwind for all styling.

Tailwind v4 is the current major release. It uses a CSS-first config (`@theme` blocks inside CSS, no `tailwind.config.js` needed) and the new `@tailwindcss/postcss` plugin (replaces the old `tailwindcss` + `autoprefixer` + PostCSS pipeline). The user picked the "full conversion" option: every component should use Tailwind utilities, the hand-written class rules are removed from `globals.css`, and the look is preserved by mapping the current colors/spacing into a `@theme` block.

The project is Next.js 16.3.3 with Turbopack and React 19. Tailwind v4 supports both webpack and Turbopack through `@tailwindcss/postcss`, so no Next config changes are needed.

## Files to create

- `postcss.config.mjs` — PostCSS config wiring `@tailwindcss/postcss` (the v4 plugin).
- `app/globals.css` (rewritten) — `@import "tailwindcss"` + `@theme` block with the design tokens below + a tiny reset.

## Files to modify

- `package.json` — add `tailwindcss@^4` and `@tailwindcss/postcss@^4` to dependencies.
- All 11 component files in `src/components/` — replace hand-written class names and inline `style={{}}` blocks with Tailwind utility classes. Remove the now-unused `import './globals.css'` style blocks where I had inline styles.
- `app/layout.tsx` — no change; it already imports `./globals.css`.

## Design tokens (extracted from current `globals.css`)

These become the `@theme` block so Tailwind generates utilities that match the current look:

```
--color-bg:           #090a0d   (body)
--color-surface:      #0d0f13   (sidebar)
--color-surface-2:    #11141a   (row hover)
--color-surface-3:    #121419   (search input bg)
--color-surface-4:    #15171c   (history button)
--color-border:       #1b1d23
--color-border-2:     #1d2026
--color-border-3:     #242730
--color-border-4:     #242832
--color-text:         #f5f5f5
--color-text-muted:   #9da1aa
--color-text-dim:     #70757f
--color-text-faint:   #7e838d
--color-accent:       #d7ff3f   (lime)
--color-accent-fg:    #10120d   (text on accent)
--color-danger-bg:    #211516
--color-danger-bd:    #513535
--color-danger-fg:    #ffb6b6
--font-sans:          "DM Sans", system-ui, sans-serif
--font-display:       "Space Grotesk", system-ui, sans-serif
```

The Google Fonts `@import url(...)` stays in `globals.css` at the top so it loads before Tailwind's reset (or move to `next/font` in `app/layout.tsx` — but keeping the existing @import avoids layout-shift changes during migration).

## Component-by-component conversion (representative)

The full conversion is mechanical. A few representative mappings so the executor has a model:

- **`<aside className="sidebar">`** — `fixed inset-y-0 left-0 w-60 bg-surface border-r border-border p-[26px_18px] flex flex-col z-10 overflow-y-auto`
- **`<div className="row">`** — `min-h-20 grid grid-cols-[40px_60px_1.4fr_1fr_38px_60px_35px] items-center gap-3.5 px-1.5 py-2.5 border-b border-[#16181d] text-text-muted cursor-pointer hover:bg-surface-2`
- **`<div className="player">`** — `fixed bottom-0 inset-x-0 h-[92px] bg-[rgba(13,15,19,0.97)] border-t border-border-3 grid grid-cols-[1.2fr_1.5fr_1fr] items-center px-6 z-20 backdrop-blur-xl`
- **`<button className="play-btn">`** — `w-9 h-9 rounded-full bg-white text-[#111] grid place-items-center`
- **`<div className="error-banner">`** — `mt-[18px] px-3.5 py-2.5 border border-danger-bd bg-danger-bg text-danger-fg rounded-lg text-xs`
- **`<div className="loading">`** — `min-h-40 flex items-center justify-center gap-2.5 text-text-faint text-[13px]`
- **`<div className="cover-wrap">`** — `relative aspect-square rounded-[10px] overflow-hidden bg-[#16181d]`
- **`<button className="card-play">`** — `absolute right-2 bottom-2 w-[38px] h-[38px] rounded-full bg-accent text-accent-fg grid place-items-center opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0`

The hero, topbar, content, and table views get the same treatment. Where a CSS rule used pseudo-classes (`.row:hover`, `.row.selected`, `.play-btn`, `.nav a.active`), I use Tailwind's hover/aria utilities inline. The `spin` keyframe animation moves into `globals.css` inside `@layer utilities` as a custom `@keyframes spin` + a `.animate-spin` utility (Tailwind ships `animate-spin` by default, so this might be a no-op — verified during execution).

The `::-webkit-scrollbar` and `scrollbar-width` rules for `.sidebar` move into a `@layer components` block in `globals.css` (Tailwind doesn't have first-class scrollbar utilities).

## The 4 components with inline `style={{}}`

- `SearchBar.tsx` — drop the wrapper `<div style>` and the input `style`, replace with `relative w-full`, `w-full bg-transparent border-0 outline-0 text-white text-[13px] pr-[22px]`, and `absolute right-0 top-1/2 -translate-y-1/2 text-[#777d87] flex`.
- `TrackCard.tsx` — drop the inner flex wrapper `style`, replace with `flex items-center justify-between mt-2`.
- `TrackList.tsx` — drop the "No tracks found" `style`, replace with `text-center text-text-faint py-4`.
- `AudioPlayer.tsx` — the `<audio style={{ display: 'none' }} />` becomes `className="hidden"`.

## Verification

1. `npm install` (or `pnpm install`) — pulls tailwindcss@^4 and @tailwindcss/postcss@^4.
2. `npx tsc --noEmit` — type check, no new errors expected (Tailwind is build-time, not a TS dep).
3. `npx next build` — build must succeed. Look at the route table in the output for 4 static pages and 2 API routes.
4. Manual check on the running dev server (port 3001 is already up): refresh the page and confirm:
   - Sidebar renders with the brand, nav, library, playlists, and upgrade card all visible.
   - Scrolling the sidebar works when content overflows.
   - Search input fires a request on each keystroke (debounced 350ms) and shows results.
   - Track cards and table rows render with the right colors and the bigger row height we set earlier.
   - Clicking the play button on a card starts audio.
5. Browser devtools — confirm no console errors, and confirm the computed styles for `.sidebar` etc. are now coming from Tailwind (e.g. `bg-surface` resolves to `rgb(13, 15, 19)`).

## Out of scope

- Migrating the small set of `Keyframes`-only CSS (the `spin` rule) beyond what's needed.
- Refactoring component structure — only class names and inline styles change; the JSX shape stays the same.
- Adding new features or design changes. The look must match what the app has now.
