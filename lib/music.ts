export type Track = {
  id: number;
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: number;
  audio: string;
  genre: string;
};

export const tracks: Track[] = [
  {
    id: 1,
    title: 'Midnight Drive',
    artist: 'Neon Coast',
    album: 'After Hours',
    cover:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80',
    duration: 215,
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    genre: 'Electronic',
  },
  {
    id: 2,
    title: 'Golden Hour',
    artist: 'Maya Bloom',
    album: 'Soft Focus',
    cover:
      'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=600&q=80',
    duration: 198,
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    genre: 'Indie Pop',
  },
  {
    id: 3,
    title: 'Ocean Eyes',
    artist: 'The Waves',
    album: 'Blue Lines',
    cover:
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80',
    duration: 242,
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    genre: 'Alternative',
  },
  {
    id: 4,
    title: 'Night Bloom',
    artist: 'Luna Park',
    album: 'City Lights',
    cover:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80',
    duration: 188,
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    genre: 'R&B',
  },
  {
    id: 5,
    title: 'Static Hearts',
    artist: 'North Avenue',
    album: 'Static Hearts',
    cover:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
    duration: 226,
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    genre: 'Rock',
  },
  {
    id: 6,
    title: 'Velvet',
    artist: 'Sora',
    album: 'Velvet',
    cover:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    duration: 204,
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    genre: 'Chill',
  },
  {
    id: 7,
    title: 'Parallel',
    artist: 'Kai Rivers',
    album: 'Parallel',
    cover:
      'https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?auto=format&fit=crop&w=600&q=80',
    duration: 231,
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    genre: 'Electronic',
  },
  {
    id: 8,
    title: 'Home Again',
    artist: 'Juniper',
    album: 'Small Rooms',
    cover:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    duration: 176,
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    genre: 'Acoustic',
  },
];
