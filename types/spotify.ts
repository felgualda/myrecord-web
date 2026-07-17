// src/types/spotify.ts

export interface SpotifyArtist {
  spotifyId: string | null;
  name: string;
}

export interface SpotifyAlbum {
  spotifyId: string | null;
  title: string | null;
  coverImage: string | null;
  releaseDate: string | null;
}

export interface SpotifyTrack {
  spotifyId: string;
  title: string;
  previewUrl: string | null;
  artists: SpotifyArtist[];
  album: SpotifyAlbum | null;
}
export function formatArtists(artists: SpotifyArtist[]): string {
  return artists.map((a) => a.name).join(", ");
}