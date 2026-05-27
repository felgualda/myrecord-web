"use client";

import ConfirmCard from "@/components/ConfirmCard";
import { UserProfileData } from "@/types/UserProfileData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserProfile() {
    const params = useParams()

    const profileUsername = params.username as string;

    const [isMyProfile, setIsMyProfile] = useState(false);
    const [profileData, setProfileData] = useState<UserProfileData | null>(null);
    const [loading, setLoading] = useState(false);

    const [following, setFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    const [unfollowAttempt, setUnfollowAttempt] = useState(false);

    const handleFollow = async () => {
      setFollowLoading(true);

      try{
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

        if(!response.ok) {
          throw new Error(`Erro ao seguir ${profileUsername}`)
        } else {
          setFollowing(true)
        }
      } catch (error) {
        console.error("Erro no fetch:", error);
        alert("Houve um erro ao seguir o usuário.");
      } finally {
        setFollowLoading(false)
      }
    };

    const handleUnfollow = async () => {
      setUnfollowAttempt(true);
    }

    const confirmUnfollow = async () => {
      setFollowLoading(true);

      try{
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

        if(!response.ok) {
          throw new Error(`Erro ao deixar de seguir ${profileUsername}`)
        } else {
          setFollowing(false)
        }
      } catch (error) {
        console.error("Erro no fetch:", error);
        alert("Houve um erro ao deixar de seguir o usuário.");
      } finally {
        setFollowLoading(false)
        setUnfollowAttempt(false)
      }
    };

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

                if(!response.ok) {
                    throw new Error(data.error || "Erro ao acessar dados do perfil.");
                }

                setFollowing(data.isFollowing);

                setProfileData(data)
            } catch (error) {
                console.error("Erro ao buscar perfil ", error);
            } finally {
                setLoading(false);
            }
        };

        checkIdentityAndFetchData()
    }, [profileUsername]);


    if (loading) return <div className="text-white text-center mt-20">Carregando perfil...</div>

    return (
<main className="min-h-screen bg-background p-10">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        
        <div className="flex flex-col items-center gap-4 w-full bg-background-light p-8 rounded-2xl border border-gray-700/50">
          <img 
            src={"https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} 
            alt="Foto de perfil"
            className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
          />
          
          <div className="text-center flex flex-col">
            <h1 className="text-2xl font-bold text-text-main">{profileData?.nickname}</h1>
            <h1 className="text-2xl font-bold text-text-main">@{profileUsername}</h1>
          </div>

          {isMyProfile ? (
            <div className="flex gap-4 mt-4">
              <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-bold transition-colors">
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

        <div className="w-full mt-10 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-text-main mb-4">Records de {profileUsername}</h2>
        </div>

      </div>

      {unfollowAttempt && (
        <ConfirmCard message={`Tem certeza que deseja parar de seguir @${profileUsername}`} onConfirm={confirmUnfollow} onClose={() => {setUnfollowAttempt(false)}} isLoading={followLoading}/>
      )}

    </main>
  );
}