"use client";

import { UserProfileData } from "@/types/UserProfileData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserProfile() {
    const params = useParams()

    const profileUsername = params.username as string;

    const [isMyProfile, setIsMyProfile] = useState(false);
    const [profileData, setProfileData] = useState<UserProfileData | null>(null);
    const [loading, setLoading] = useState(false);

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
                const response = await fetch(`${process.env['NEXT_PUBLIC_API_URL']}/api/users/${profileUsername}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                const data = await response.json();

                if(!response.ok) {
                    throw new Error(data.error || "Erro ao acessar dados do perfil.");
                }

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
            <button className="mt-4 px-8 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-bold transition-colors">
              Seguir
            </button>
          )}
        </div>

        <div className="w-full mt-10 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-text-main mb-4">Records de {profileUsername}</h2>
        </div>

      </div>
    </main>
  );
}