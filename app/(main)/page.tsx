"use client";

import { useState, useEffect, useRef } from "react";
import HomePostCard from "@/components/HomePostCard";
import { SpotifyTrack, formatArtists } from "@/types/spotify";
import CreatePostModal from "@/components/CreatePostModal";
import { FeedPost } from "@/types/feedpost";
import { useRouter } from "next/navigation";


const MIN_PANEL_WIDTH = 300; 
const MAX_PANEL_WIDTH = 550; 
const FEED_WIDTH = 672;     
const PANEL_GAP = 10;        

const BREAKPOINT_DESKTOP = FEED_WIDTH + 2 * (MIN_PANEL_WIDTH + PANEL_GAP + 40);
// ==========================================

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const [loadingPost, setLoadingPost] = useState(false);

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(false);

  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const centerPanelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    
    if (window.innerWidth < 1024 && centerPanelRef.current) {
      centerPanelRef.current.scrollIntoView({
        behavior: "instant",
        inline: "center",
      });
    }
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
    setLoadingPost(true);

    try {
      const token = localStorage.getItem("myrecord_token");
      if (!token) {
        alert("Sessão expirada. Refaça o login.");
        return;
      }

      const payload = {
        spotifyId: selectedTrack.spotifyId,
        title: selectedTrack.title,
        comment: postText,
        previewUrl: selectedTrack.previewUrl,
        artists: selectedTrack.artists,
        album: selectedTrack.album?.spotifyId ? selectedTrack.album : null,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao salvar a música");

      setPage(1);
      fetchFeed(1);
    } catch (error) {
      console.error("Erro no fetch:", error);
      alert("Houve um erro ao criar o post.");
    } finally {
      setLoadingPost(false);
      setSelectedTrack(null);
      setSearchQuery("");
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeed(nextPage);
  };

  const handlePostClick = (post_id: string) => {
    setExpandedPost(expandedPost === post_id ? null : post_id);
  };

  return (
    <main
      ref={containerRef}
      className="flex w-full h-[calc(100vh-72px)] overflow-x-auto overflow-y-hidden snap-x snap-mandatory lg:grid lg:grid-cols-[1fr_minmax(0,672px)_1fr] lg:overflow-hidden lg:snap-none bg-background hide-scrollbar"
    >
      <style>{`
        @media (min-width: 1024px) and (max-width: ${BREAKPOINT_DESKTOP - 1}px) {
          .dynamic-side-panel {
            display: none !important;
          }
        }
        
        @media (min-width: ${BREAKPOINT_DESKTOP}px) {
          .dynamic-panel-inner {
            width: 100% !important;
            min-width: ${MIN_PANEL_WIDTH}px !important;
            max-width: ${MAX_PANEL_WIDTH}px !important;
          }
        }
      `}</style>

      {/* PAINEL ESQUERDO */}
      <aside className="dynamic-side-panel w-full h-full flex-shrink-0 snap-center snap-always overflow-y-auto py-15 px-5 hide-scrollbar lg:pl-10 lg:flex lg:w-auto lg:justify-center lg:px-0 lg:pt-[11.25rem]">
        <div 
          className="dynamic-panel-inner w-full" 
        >
          <div className="bg-background border border-1 border-background-light p-6 rounded-xl text-text-main shadow-lg shadow-background-dark h-full">
            <h2 className="font-bold text-lg mb-4">❔ Novo</h2>
            <p className="text-text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas id faucibus arcu. Duis fringilla auctor sem. Praesent dapibus augue nunc, sed porta quam condimentum in. Cras nec tortor posuere, vulputate turpis sed, bibendum metus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur efficitur lacus vitae est ultricies, ut ornare est iaculis. In sit amet sapien ac est congue feugiat nec non orci. Sed ut dolor sed diam placerat placerat ut eu magna. Nulla facilisi. Curabitur nec gravida libero. Donec sit amet justo eu urna sodales ultrices quis vel augue. Phasellus lacinia tellus at eros faucibus, at pulvinar libero suscipit. In hac habitasse platea dictumst. Quisque enim augue, ullamcorper nec arcu sit amet, pulvinar ornare ex. Praesent eget urna quam. Aenean posuere hendrerit ipsum. Nulla urna eros, dictum ut ornare non, interdum eu nisi. In hac habitasse platea dictumst. Mauris egestas enim non ullamcorper gravida. Ut in lacinia justo.</p>
          </div>
        </div>
      </aside>

      {/* CENTRO (FEED) */}
      <section
        ref={centerPanelRef}
        className="relative w-full h-full flex-shrink-0 snap-center snap-always overflow-y-auto lg:w-auto lg:col-start-2 hide-scrollbar"
      >
        <div className="sticky top-0 w-full z-50 bg-background pt-15 pb-15 px-5">
          <div className="relative w-full max-w-2xl mx-auto text-left">
            <div className="p-[1px] rounded-full bg-linear-[65deg] from-purple-500 to-pink-500 shadow-purple-500/20">
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

            {showDropdown && results.length > 0 && (
              <ul className="absolute top-full left-0 w-full mt-2 bg-background-light rounded-xl shadow-2xl border border-background overflow-hidden divide-y divide-background-light">
                {results.map((track) => (
                  <li
                    key={track.spotifyId}
                    onClick={() => handleSelectTrack(track)}
                    className="flex items-center p-3 hover:bg-background-bright cursor-pointer transition-colors"
                  >
                    {track.album?.coverImage && (
                      <img
                        src={track.album.coverImage}
                        alt={track.title}
                        className="w-12 h-12 rounded object-cover mr-4 shadow-sm"
                      />
                    )}
                    <div className="flex-grow truncate">
                      <p className="font-bold text-text-main truncate">{track.title}</p>
                      <p className="text-sm text-text-muted truncate">{formatArtists(track.artists)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {showDropdown && results.length === 0 && !loading && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 text-center text-gray-500">
                Nenhuma música encontrada.
              </div>
            )}
          </div>
        </div>

        <div className="relative w-full max-w-2xl mx-auto text-left flex flex-col gap-6 px-5 pb-15">
          {posts.map((post) => (
            <HomePostCard
              key={post.id}
              post_id={post.id}
              username={post.user.username}
              nickname={post.user.nickname}
              user_pfp={post.user.picture || ""}
              song_title={post.song.title}
              song_artist={post.song.artistNames}
              song_albumImage={post.song.albumImage || ""}
              song_spotifyUrl={`https://open.spotify.com/track/${post.song.spotifyId}`}
              song_previewUrl={post.song.previewUrl}
              comment={post.comment}
              isExpanded={expandedPost === post.id}
              onClickEvent={() => handlePostClick(post.id)}
            />
          ))}

          {hasMore && (
            <div className="flex justify-center mt-6">
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
            <p className="text-center text-text-muted mt-6">
              Não há mais posts para carregar.
            </p>
          )}
        </div>
      </section>

      {/* PAINEL DIREITO */}
      <aside className="dynamic-side-panel w-full h-full flex-shrink-0 snap-center snap-always overflow-y-auto py-15 px-5 hide-scrollbar lg:flex lg:pr-10 lg:w-auto lg:justify-center lg:px-0 lg:pt-[11.25rem]">
        <div 
          className="dynamic-panel-inner w-full" 
        >
          <div className="bg-background border border-1 border-background-light p-6 rounded-xl text-text-main shadow-lg shadow-background-dark h-full">
            <h2 className="font-bold text-lg mb-4">🔥Quente</h2>
            <p className="text-text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas id faucibus arcu. Duis fringilla auctor sem. Praesent dapibus augue nunc, sed porta quam condimentum in. Cras nec tortor posuere, vulputate turpis sed, bibendum metus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur efficitur lacus vitae est ultricies, ut ornare est iaculis. In sit amet sapien ac est congue feugiat nec non orci. Sed ut dolor sed diam placerat placerat ut eu magna. Nulla facilisi. Curabitur nec gravida libero. Donec sit amet justo eu urna sodales ultrices quis vel augue. Phasellus lacinia tellus at eros faucibus, at pulvinar libero suscipit. In hac habitasse platea dictumst. Quisque enim augue, ullamcorper nec arcu sit amet, pulvinar ornare ex. Praesent eget urna quam. Aenean posuere hendrerit ipsum. Nulla urna eros, dictum ut ornare non, interdum eu nisi. In hac habitasse platea dictumst. Mauris egestas enim non ullamcorper gravida. Ut in lacinia justo.</p>
          </div>
        </div>
      </aside>
    
      {selectedTrack && (
        <CreatePostModal
          track={selectedTrack}
          onClose={() => setSelectedTrack(null)}
          onConfirm={handleConfirmPost}
          loading={loadingPost}
        />
      )}
    </main>
  );
}