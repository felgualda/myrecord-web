import { SpotifyTrack } from "./spotify";

export interface FeedPost {
  id: number;
  song: SpotifyTrack;
  comment: string;
  user: {
    username: string;
    nickname: string;
    profilePic?: string;
  }
}