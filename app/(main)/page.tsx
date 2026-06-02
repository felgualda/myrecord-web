"use client";

import { useState, useEffect } from "react";
import SongCard from "@/components/SongCard";
import HomePostCard from "@/components/HomePostCard";
import { SpotifyTrack } from "@/types/spotify";
import CreatePostModal from "@/components/CreatePostModal";
import { FeedPost } from "@/types/feedpost";
import { useRouter } from "next/navigation";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null)
  const [loadingPost, setLoadingPost] = useState(false)

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(false);

  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  const fetchFeed = async (pageNumber: number) => {
    setLoadingFeed(true);
    try {
      const response = await fetch(`${process.env['NEXT_PUBLIC_API_URL']}/api/records?page=${pageNumber}`);
      if (response.ok) {
        const data = await response.json();
        
        setPosts(prev => pageNumber === 1 ? data.records : [...prev, ...data.records]);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Erro ao buscar o feed:", error);
    } finally {
      setLoadingFeed(false);
    }
  };

  useEffect(() => {
    fetchFeed(1);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/spotify/search?q=${searchQuery}`);
        
        if (response.ok) {
          const data = await response.json();
          setResults(data.results); 
          setShowDropdown(true);
        }
      } catch (error) {
        console.error("Erro ao buscar na API:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectTrack = (track: SpotifyTrack) => {
    setShowDropdown(false);
    setSelectedTrack(track);
  };

const handleConfirmPost = async (postText: string) => {
    if (!selectedTrack) return;

    if (loadingPost) return;
    setLoadingPost(true)

    try {
      const token = localStorage.getItem("myrecord_token");

      if (!token) {
        alert("Sessão expirada. Refaça o login.");
        return;
      }

      const payload = {
        spotifyId: selectedTrack.spotifyId,
        title: selectedTrack.title,
        artist: selectedTrack.artist,
        comment: postText,
        albumImage: selectedTrack.albumImage,
        previewUrl: selectedTrack.previewUrl,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar a música");
      }

      console.log("Post criado com sucesso!");

      setPage(1);
      fetchFeed(1);
      
    } catch (error) {
      console.error("Erro no fetch:", error);
      alert("Houve um erro ao criar o post.");
    } finally {
      setLoadingPost(false)
      setSelectedTrack(null);
      setSearchQuery("");
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeed(nextPage);
  };

  const handlePostClick = (post_id: number) => {
    if(expandedPost === post_id) {
      setExpandedPost(null)
    } else {
      setExpandedPost(post_id);
    }
  }

  const router = useRouter();

  return (
    <main className="min-h-screen bg-background">
      <section className="relative flex bg-primary-light py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl text-white mb-6">
            Bem-vindo ao MyRecord!
          </h1>

        </div>
        
      </section>    
      
          <div className="relative w-full max-w-2xl mx-auto text-left z-50 pt-15 px-5">
            <div className="p-[1px] rounded-full bg-linear-[65deg] from-purple-500 to-pink-500 shadow-purple-500/20 shadow-[0_0_120px_rgba(168,85,247,0.7)]">
              <div className="flex bg-background-light rounded-full shadow-lg overflow-hidden p-1">
                <input 
                  type="text" 
                  placeholder="Comece a digitar o nome da música..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow px-6 py-3 text-text-main focus:outline-none bg-transparent"
                />
                {loading && (
                  <div className="px-4 py-3 text-emerald-600 flex items-center justify-center">
                    <span className="animate-pulse font-bold">...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="relative w-full max-w-2xl mx-auto text-left z-50">
              {showDropdown && results.length > 0 && (
              <ul className="absolute top-full left-0 w-full mt-2 bg-background-light rounded-xl shadow-2xl border border-background overflow-hidden divide-y divide-background-light">
                {results.map((track) => (
                  <li 
                    key={track.spotifyId} 
                    onClick={() => handleSelectTrack(track)}
                    className="flex items-center p-3 hover:bg-background-bright cursor-pointer transition-colors"
                  >
                    <img 
                      src={track.albumImage} 
                      alt={track.title} 
                      className="w-12 h-12 rounded object-cover mr-4 shadow-sm"
                    />
                    <div className="flex-grow truncate">
                      <p className="font-bold text-text-main truncate">{track.title}</p>
                      <p className="text-sm text-text-muted truncate">{track.artist}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            </div>
            
            {showDropdown && results.length === 0 && !loading && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 text-center text-gray-500">
                Nenhuma música encontrada.
              </div>
            )}
          </div>

          {selectedTrack && (
        <CreatePostModal 
          track={selectedTrack} 
          onClose={() => setSelectedTrack(null)} 
          onConfirm={handleConfirmPost} 
          loading={loadingPost}
        />
        )}

      <div className="relative w-full max-w-2xl mx-auto text-left pt-15 flex flex-col gap-6">
        {posts.map((post) => (
          <HomePostCard 
            key={post.id}
            username={post.user.username} 
            nickname={post.user.nickname} 
            user_pfp={post.user.picture || ""} 
            song_title={post.song.title} 
            song_artist={post.song.artist} 
            song_albumImage={post.song.albumImage} 
            song_spotifyUrl={`https://open.spotify.com/track/${post.song.spotifyId}`}
            comment={post.comment}
            isExpanded= {(expandedPost === post.id)}
            onClickEvent={() => handlePostClick(post.id)}
          />
        ))}

        {hasMore && (
          <div className="flex justify-center mt-6 pb-15">
            <button 
              onClick={handleLoadMore}
              disabled={loadingFeed}
              className="px-6 py-2 rounded-full border border-purple-500 text-purple-400 hover:bg-purple-500/10 transition-colors disabled:opacity-50 "
            >
              {loadingFeed ? "Carregando..." : "Carregar mais posts"}
            </button>
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <p className="text-center text-text-muted mt-6 pb-15">
            Não há mais posts para carregar.
          </p>
        )}
      </div>

    </main>
  );
}