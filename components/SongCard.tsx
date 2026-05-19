interface SongCardProps {
    title: string;
    artist: string;
    albumImage?: string;
    onActionClick?: () => void;
}

export default function SongCard({title, artist, albumImage, onActionClick}: SongCardProps) {
    return (
        <div className="bg-white rounded--xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-col">
            <div className="h-48 w-full bg-gray-200 relative">
                {albumImage ? (
                    <img
                    src={albumImage}
                    alt={`Capa do álbum de ${title}`}
                    className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Sem capa
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-lg truncate" title={title}>
          {title}
        </h3>
        <p className="text-gray-500 text-sm truncate mb-4" title={artist}>
          {artist}
        </p>
        <button 
          onClick={onActionClick}
          className="mt-auto w-full bg-emerald-100 text-emerald-700 font-semibold py-2 rounded hover:bg-emerald-200 transition-colors"
        >
          Salvar Música
        </button>
      </div>
        </div>
    )
}