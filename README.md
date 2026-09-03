# Pulse — Next.js music streaming app

Next.js music player powered by the Jamendo API. It searches Jamendo's independent-music catalog and streams tracks in the browser with the HTML5 Audio API.

Jamendo documents `709fa152` as a client ID for testing the read API. For your own app, create a developer application and put its client ID in `.env.local`.

- API docs: https://developer.jamendo.com/v3.0/docs
- Tracks: https://developer.jamendo.com/v3.0/tracks
- Stream endpoint: https://developer.jamendo.com/v3.0/tracks/file
- Developer portal: https://devportal.jamendo.com/

## Run
```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Architecture
- `/api/jamendo/search` keeps the client ID server-side and searches Jamendo.
- `/api/jamendo/stream/[id]` requests Jamendo's `action=stream` endpoint and redirects to the playable audio URL.
- React manages queue, playback, seek, volume, shuffle, repeat and likes.

Check Jamendo's current licensing terms before commercial deployment or redistribution.
