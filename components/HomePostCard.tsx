import { FeedPost } from "@/types/feedpost";

interface PostCardProps {
    post_id: number,
    nickname: string,
    username: string,
    user_pfp: string,

    song_title: string,
    song_artist: string,
    song_albumImage: string,
    song_spotifyUrl: string,

    comment: string,

    isExpanded: boolean,
    onClickEvent: (post_id: number) => void
}

export default function HomePostCard({post_id, nickname, username, user_pfp, song_title, song_artist, song_albumImage, song_spotifyUrl, comment, isExpanded, onClickEvent} : PostCardProps) {
    return (
<div id={`${post_id}`} className="py-1 px-5" style={{ containerType: 'inline-size' }}>
        <div 
            className={`relative flex flex-col w-full aspect-square rounded-2xl shadow-sm overflow-hidden min-h-[5rem] transition-all duration-500 ease-in-out origin-top`}
            style={{ 
                minHeight: '7rem',
                maxHeight: isExpanded ? 'min(100cqw, 400px)' : '5rem' 
            }}
            onClick={() => onClickEvent(post_id)}
        >
    
            {song_albumImage ? (
                <>
                    <div 
                        className="absolute -inset-px bg-cover bg-center z-0 transition-all duration-500"
                        style={{ backgroundImage: `url(${song_albumImage})` }}
                    />
                    <div className="absolute -inset-px bg-gradient-to-b from-background/90 via-background/80 to-background/50 z-0" />
                </>
            ) : (
                <div className="absolute -inset-px bg-background-light z-0" />
            )}
            
            <div className="relative z-10 flex w-full">
                <div className="pl-5 pt-5 pb-2 flex flex-col flex-1 pr-4">
                    <h3 className="text-text-main font-bold text-lg">{`${song_title}`}</h3>
                    <p className="text-text-muted text-sm">{`${song_artist}`}</p>
                </div>

                <div className="p-4 flex items-start flex-shrink-0">
                    <img 
                        src={user_pfp ? user_pfp : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"}
                        alt={`Foto de perfil de ${username}`}
                        className="w-10 h-10 object-cover rounded-full border border-gray-600/50"
                    />
                </div>
            </div>

            <div 
                className={`relative z-10 px-5 pt-2 pb-5 flex-1 flex flex-col overflow-hidden transition-opacity duration-300 ${
                    isExpanded ? "opacity-100 delay-200" : "opacity-0"
                }`}
            >
                {comment ? (
                    <div className="pt-20">
                        <p className="text-text-main text-sm italic border-gray-400/50 pl-3 text-l"><b>{`${username}`}</b> disse...</p>
                        <p className="text-text-main break-words text-sm italic border-gray-400/50 pb-3 px-3 text-xl">
                            "{comment}"
                        </p>
                    </div>
                ) : (
                    <div className="pt-20">
                        <p className="text-text-main text-sm italic border-gray-400/50 pl-3 text-l"><b>{`${username}`}</b> escutou essa música...</p>
                    </div>
                )}
            </div>

        </div>    
    </div>
    )
}