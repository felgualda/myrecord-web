import { SpotifyTrack } from "./spotify";

export interface FeedPost {
  id: number;
  song: SpotifyTrack;
  user: {
    username: string;
    nickname: string;
    profilePic?: string;
  }
}