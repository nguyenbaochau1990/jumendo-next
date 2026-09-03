# Next.js Music Jamendo Project - Architecture & Guidelines

## Project Overview

This is a Next.js 16 + React 19 application that integrates with the Jamendo API to provide music streaming functionality. The app allows users to search, play, and favorite tracks from the Jamendo catalog.

## Architecture Review & Recommendations

### Current Architecture Status ✅

The application has been successfully refactored to follow a production-ready layered architecture with proper separation of concerns:

```
src/
├── components/           # Presentational components
│   ├── layout/          # Layout components (Sidebar, MainLayout)
│   ├── features/        # Feature-specific components
│   │   ├── SearchBar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── TrackList.tsx
│   │   ├── TrackCard.tsx
│   │   └── AudioPlayer.tsx
│   └── ui/              # Reusable UI primitives (Button, Input, Card)
├── hooks/               # Custom React hooks
│   ├── useAudioPlayer.ts
│   ├── useSearch.ts
│   └── useLikedTracks.ts
├── lib/                 # Utility functions and services
│   ├── services/        # API service layer
│   │   └── jamendoService.ts
│   ├── utils/           # Helper functions (artworkUrl, formatTime)
│   └── types/           # TypeScript interfaces
└── styles/              # CSS/modules (globals.css)
```

### Architecture Improvements Made

1. **Separation of Concerns Achieved**:
   - ✅ Presentation Layer: Components responsible only for rendering UI
   - ✅ Business Logic Layer: Custom hooks handle data and logic
   - ✅ Data Access Layer: Service modules handle API communication
   - ✅ State Management: Custom hooks manage state effectively

2. **Component Refactorings Completed**:
   - Extracted `SearchBar` component with debounced input
   - Extracted `TrackList` and `TrackCard` components for track display
   - Extracted `AudioPlayer` component with its own hook usage
   - Extracted `Sidebar` navigation component
   - Created reusable UI primitives (Button, Input, Card, etc.)

3. **Custom Hooks Utilized**:
   - `useSearch(searchTerm)` - handles search loading, error, and results
   - `useAudioPlayer()` - manages audio playback, progress, volume
   - `useLikedTracks()` - handles liked track persistence
   - All business logic moved from component to hooks

4. **Service Layer Implementation**:
   - `lib/services/jamendoService.ts` properly used by hooks
   - Centralized API communication

5. **Type Safety Improvements**:
   - Proper TypeScript interfaces for API responses
   - No `any` types in new components
   - Strongly typed props and state

### Code Conventions Followed

All code adheres to the guidelines in this document:

- TypeScript Guidelines: Interface naming, function types, nullable types, avoiding `any`
- React Best Practices: Component size under 100 lines, early returns, prop destructuring
- Styling Guidelines: CSS classes from globals.css, responsive design, mobile-first approach
- File Organization: PascalCase for components, camelCase for utilities/hooks
- Error Handling: API errors handled in service layer, user feedback shown
- Performance Considerations: Efficient rendering, proper key usage

## Development Status

The application is now production-ready with:

- Clean, maintainable architecture
- Separation of concerns properly implemented
- All original functionality preserved
- Ready for future enhancements

## Future Enhancements (Unchanged from Original)

### Short-term

1. Add proper error boundaries and loading states
2. Implement audio persistence (remember position on refresh)
3. Add keyboard shortcuts for player controls
4. Improve accessibility (ARIA labels, focus trapping)
5. Add track sharing functionality

### Medium-term

1. Implement user authentication (Jamendo OAuth)
2. Add playlist creation and management
3. Add audio visualization/waveform display
4. Implement offline caching with service workers
5. Add social features (sharing, following artists)

### Long-term

1. Consider state management migration to Redux Toolkit or Zustand
2. Add audio equalizer and sound effects
3. Implement recommendation engine
4. Add lyrics display and synchronization
5. Create mobile app version using React Native

## Deployment (Unchanged)

1. Build: `npm run build`
2. Start: `npm start`
3. Preview: `npm run preview`
4. Environment Variables: Configure in hosting platform (Vercel, Netlify, etc.)

## Troubleshooting (Unchanged)

- **API Rate Limits**: Implement retry with exponential backoff
- **Audio Playback Issues**: Check browser autoplay policies
- **Styling Conflicts**: Use CSS modules or scoped styles
- **Bundle Size**: Use webpack bundle analyzer to identify large dependencies

---

_Last updated: 2026-09-01_
_This document reflects the current production-ready architecture_
_Updated to reflect successful refactor to layered architecture_

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
