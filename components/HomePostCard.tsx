interface PostCardProps {
    nickname: string,
    username: string,
    user_pfp: string,

    song_title: string,
    song_artist: string,
    song_albumImage: string,
    song_spotifyUrl: string
}

export default function HomePostCard({nickname, username, user_pfp, song_title, song_artist, song_albumImage, song_spotifyUrl} : PostCardProps) {
    return (
    <div className="py-1 px-5">
        <div className="relative flex rounded-2xl shadow-sm overflow-hidden min-h-[5rem]">
            {/* aspect-square no tailwind pra ficar inteiro ^ */}
        
            {song_albumImage ? (
                <>
                    <div 
                        className="absolute -inset-px bg-cover bg-center z-0"
                        style={{ backgroundImage: `url(${song_albumImage})` }}
                    />

                    <div className=" absolute -inset-px bg-gradient-to-b from-background/90 via-background/80 via to-background/50 z-0" />
                </>
            ) : (
                <div className="absolute -inset-px bg-background-light z-0" />
            )}
            
            <div className="relative z-10 pl-5 pt-5 pb-15 flex flex-col flex-1 pr-4">

                <h3 className="text-text-main font-bold text-lg">{`${song_title}`}</h3>
                <p className="text-text-muted text-sm">{`${song_artist}`}</p>
            </div>

            <div className="relative z-10 p-4 flex items-start flex-shrink-0">
                <img 
                    src={user_pfp ? user_pfp : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"}
                    alt={`Foto de perfil de ${username}`}
                    className="w-10 h-10 object-cover rounded-full border border-gray-600/50"
                />
            </div>

        </div>
    </div>
    )
}