import { SpotifyTrack, formatArtists } from "@/types/spotify";

interface SongOfTheDayCardProps {
    track: SpotifyTrack | null;
}

export default function SongOfTheDayCard({ track }: SongOfTheDayCardProps) {
    const coverImage = track?.album?.coverImage;
    const artistNames = track ? formatArtists(track.artists) : "";

    return (
        <div className="w-120 p-8 border border-background-light rounded-xl bg-background flex flex-col items-center justify-center text-center">
            
            <h2 className="text-text-main font-bold text-xl mb-4">
                Música do dia
            </h2>

            <div className="w-full border-t border-background-light/60 mb-6"></div>

            <div className="flex flex-col items-center">
                <img 
                    src={coverImage ? coverImage : "https://i0.wp.com/unleash-gods-dream.com/wp-content/uploads/2023/03/placeholder-image-blue-square.png?fit=500%2C500&ssl=1&w=640"}
                    alt={`Capa do álbum da música ${track?.title ?? ""}`}
                    className="w-50 h-50 object-cover rounded-xl border border-gray-600/50 shadow-lg"
                />

                <div className="mt-4">
                    <h3 className="text-text-main font-bold text-lg">{track?.title}</h3>
                    <p className="text-text-muted text-sm mt-1">{artistNames}</p>
                </div>
            </div>

        </div>
    );
}