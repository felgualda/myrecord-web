"use client";

import ConfirmCard from "@/components/ConfirmCard";
import EditProfileModal from "@/components/EditProfileModal";
import HomePostCard from "@/components/HomePostCard";
import ProfileStatsPanel from "@/components/ProfileStatsPanel"; // <-- IMPORTAÇÃO ADICIONADA
import { FeedPost } from "@/types/feedpost";
import { SpotifyTrack } from "@/types/spotify";
import { UserProfileData } from "@/types/UserProfileData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserProfile() {
    const params = useParams();
    const profileUsername = params.username as string;

    const [isMyProfile, setIsMyProfile] = useState(false);
    const [profileData, setProfileData] = useState<UserProfileData | null>(null);
    const [loading, setLoading] = useState(false);

    const [following, setFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    const [unfollowAttempt, setUnfollowAttempt] = useState(false);

    const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
    const [expandedPost, setExpandedPost] = useState<string | null>(null);

    const [posts, setPosts] = useState<FeedPost[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingFeed, setLoadingFeed] = useState(false);

    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [loadingUpdatingProfile, setLoadingUpdatingProfile] = useState(false);

    const fetchUserRecords = async (pageNumber: number) => {
      try {
        setLoadingFeed(true);
        const response = await fetch(`${process.env['NEXT_PUBLIC_API_URL']}/api/users/${profileUsername}/records?page=${pageNumber}`);
        if (response.ok) {
          const data = await response.json();
          
          setPosts(prev => pageNumber === 1 ? data.records : [...prev, ...data.records]);
          setHasMore(data.hasMore);
        }
      } catch (error) {
        console.error("Erro ao buscar os records:", error);
      } finally {
        setLoadingFeed(false);
      }
    };

    const handleFollow = async () => {
      setFollowLoading(true);
      try {
        const token = localStorage.getItem("myrecord_token");
        if (!token) {
          alert("Sessão expirada. Refaça o login.");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${profileUsername}/follow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao seguir ${profileUsername}`);
        } else {
          setFollowing(true);
        }
      } catch (error) {
        console.error("Erro no fetch:", error);
        alert("Houve um erro ao seguir o usuário.");
      } finally {
        setFollowLoading(false);
      }
    };

    const handleUnfollow = async () => {
      setUnfollowAttempt(true);
    };

    const confirmUnfollow = async () => {
      setFollowLoading(true);
      try {
        const token = localStorage.getItem("myrecord_token");
        if (!token) {
          alert("Sessão expirada. Refaça o login.");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${profileUsername}/unfollow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao deixar de seguir ${profileUsername}`);
        } else {
          setFollowing(false);
        }
      } catch (error) {
        console.error("Erro no fetch:", error);
        alert("Houve um erro ao deixar de seguir o usuário.");
      } finally {
        setFollowLoading(false);
        setUnfollowAttempt(false);
      }
    };

    useEffect(() => {
        fetchUserRecords(1);
    }, [profileUsername]);

    useEffect(() => {
        const checkIdentityAndFetchData = async () => {
            setLoading(true);
            const loggedInUsername = localStorage.getItem("myrecord_username");

            if (loggedInUsername === profileUsername) {
                setIsMyProfile(true);
            } else {
                setIsMyProfile(false);
            }

            try {
                const token = localStorage.getItem("myrecord_token");
                const response = await fetch(`${process.env['NEXT_PUBLIC_API_URL']}/api/users/${profileUsername}`, {
                    method: "GET",
                    headers: { 
                      "Content-Type": "application/json",
                      ...(token && {"Authorization": `Bearer ${token}` }) 
                     },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Erro ao acessar dados do perfil.");
                }

                setFollowing(data.isFollowing);
                setProfileData(data);
            } catch (error) {
                console.error("Erro ao buscar perfil ", error);
            } finally {
                setLoading(false);
            }
        };

        checkIdentityAndFetchData();
    }, [profileUsername]);

    if (loading) return <div className="text-white text-center mt-20">Carregando perfil...</div>;

    const handleLoadMore = () => {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUserRecords(nextPage);
    };

    const handlePostClick = (post_id: string) => {
      if (expandedPost === post_id) {
        setExpandedPost(null);
      } else {
        setExpandedPost(post_id);
      }
    };

    const handleUpdateProfile = async (updatedData: Partial<UserProfileData>) => {
      if (Object.keys(updatedData).length === 0) {
        setUpdatingProfile(false);
        return;
      } 

      setLoadingUpdatingProfile(true);
      try {
        const token = localStorage.getItem("myrecord_token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/updateProfile`, {
              method: "PATCH", 
              headers: { 
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify(updatedData),
          });

          const data = await response.json();

          if (!response.ok) {
              throw new Error(data.error || data.errors?.[0] || "Erro ao atualizar perfil");
          }
          setProfileData((prev) => prev ? { ...prev, ...updatedData } : prev);

          if (updatedData.picture) {
            localStorage.setItem("myrecord_picture", updatedData.picture);
          }

          alert("Perfil updated com sucesso!");
          setUpdatingProfile(false);
      } catch (err: any) {
          console.error(err);
      } finally {
          setLoadingUpdatingProfile(false);
      }
    };

  return (
    <main className="min-h-screen bg-background p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* GRID DOS DOIS PAINÉIS LADO A LADO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            
            {/* PAINEL 1: Perfil */}
            <div className="flex flex-col items-center gap-4 w-full bg-background-light p-8 rounded-2xl border border-gray-700/50">
                <img 
                    src={profileData?.picture ? profileData?.picture : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"} 
                    alt="Foto de perfil"
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
                />
                
                <div className="text-center flex flex-col">
                    <h1 className="text-2xl font-bold text-text-main">{profileData?.nickname}</h1>
                    <h1 className="text-2xl font-bold text-text-main">@{profileUsername}</h1>
                </div>

                {isMyProfile ? (
                    <div className="flex gap-4 mt-4">
                      <button onClick={() => {setUpdatingProfile(true)}} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-bold transition-colors">
                          Editar Perfil
                      </button>
                    </div>
                ) : (
                    <div>
                    {followLoading ? (
                      <div>
                          <button disabled={true} className="mt-4 px-8 py-2 bg-background text-white rounded-full font-bold transition-colors">
                            <svg className="spinner-svg" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                            </svg>
                          </button>
                      </div>
                    ) : (
                      <div>
                          {following ? (
                            <button onClick={handleUnfollow} className={`mt-4 px-8 py-2 bg-background text-white rounded-full font-bold transition-colors`}>
                                Seguindo
                            </button>
                          ) : (
                            <button onClick={handleFollow} className={`mt-4 px-8 py-2 bg-primary hover:bg-purple-600 text-white rounded-full font-bold transition-colors`}>
                                Seguir
                            </button>
                          )}
                      </div>
                    )}
                    </div>
                )}
            </div>

            {/* PAINEL 2: Estatísticas e Medidor */}
            <ProfileStatsPanel 
                recordsCount={profileData?.recordsCount} 
                averageRank={profileData?.averageRank} 
            />
        </div>

        {/* FEED DE POSTS */}
        <div className="w-full mt-10 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-text-main mb-4">Records de {profileUsername}</h2>
        </div>

        <div className="relative w-full max-w-2xl mx-auto text-left pt-4 flex flex-col gap-6">
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
              song_deezerUrl={post.song.deezerUrl}
              song_appleMusicUrl={post.song.itunesUrl}
              song_previewUrl={post.song.previewUrl}
              comment={post.comment}
              isExpanded={(expandedPost === post.id)}
              onClickEvent={() => handlePostClick(post.id)}
            />
          ))}

          {hasMore && (
            <div className="flex justify-center mt-6 pb-15">
              <button 
                onClick={handleLoadMore}
                disabled={loadingFeed}
                className="px-6 py-2 rounded-full border border-purple-500 text-purple-400 hover:bg-purple-500/10 transition-colors disabled:opacity-50"
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

      </div>

      {/* MODALS */}
      {unfollowAttempt && (
        <ConfirmCard message={`Tem certeza que deseja parar de seguir @${profileUsername}`} onConfirm={confirmUnfollow} onClose={() => {setUnfollowAttempt(false)}} isLoading={followLoading}/>
      )}

      {updatingProfile && (
        <EditProfileModal picture={profileData?.picture} nickname={profileData?.nickname} username={profileUsername} isLoading={loadingUpdatingProfile} onClose={() => {setUpdatingProfile(false)}} onConfirm={handleUpdateProfile}/>
      )}
    </main>
  );
}