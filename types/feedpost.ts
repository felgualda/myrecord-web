// src/types/feedpost.ts

export interface FeedArtist {
  name: string;
  spotifyId: string | null;
}

export interface FeedPost {
  id: string;
  comment: string;

  user: {
    username: string;
    nickname: string;
    picture: string | null;
  };

  song: {
    spotifyId: string | null;
    title: string;
    artists: FeedArtist[];
    artistNames: string;
    albumImage: string | null;
    previewUrl: string | null;
  };
}