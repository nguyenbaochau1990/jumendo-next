export interface JamendoTrack {
  id: string;
  name: string;
  duration: number;
  artist_name: string;
  album_name?: string;
  album_image?: string;
  image?: string;
  releasedate?: string;
  musicinfo?: {
    tags?: {
      genres?: string[];
    };
  };
}
