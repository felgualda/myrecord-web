"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("myrecord_token");
    const pic = localStorage.getItem("myrecord_picture");
    const storedUsername = localStorage.getItem("myrecord_username");

    const isTokenValid = (t: string) => {
      try {
        const payload = JSON.parse(atob(t.split(".")[1]));
        return payload.exp * 1000 > Date.now();
      } catch (error) {
        return false;
      }
    };

    if (token && isTokenValid(token)) {
      if (pic && pic !== "undefined") setProfilePicture(pic);
      if (storedUsername) setUsername(storedUsername);
    } else {
      localStorage.removeItem("myrecord_token");
      localStorage.removeItem("myrecord_picture");
      localStorage.removeItem("myrecord_username");
    }
    
    setIsLoading(false);
  }, []);

  const handleGoToProfile = () => {
    setIsDropdownOpen(false);
    if (username) {
      router.push(`/user/${username}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("myrecord_token");
    localStorage.removeItem("myrecord_picture");
    localStorage.removeItem("myrecord_username");
    
    setUsername(null);
    setProfilePicture(null);
    setIsDropdownOpen(false);
    
    //router.push("/login");
  };

  const handleHomeClick = () => {
    router.push("/");
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-[100] w-full bg-background-light flex items-center justify-between py-3 px-5 shadow-sm relative">
      
      <div className="flex items-center gap-4">
        <button className="rounded border border-white/20 w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          ≡
        </button>
        <h1 
          className="text-2xl md:text-xl text-white font-bold cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={handleHomeClick}
        >
          MyRecord
        </h1>
      </div>

      <div className="flex items-center">
        {isLoading ? (
          <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse"></div>
        ) : username ? (
          <div className="relative w-full">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center w-full gap-3 bg-background border border-white/10 hover:border-purple-500/50 hover:bg-white/5 py-1 px-1 pr-4 rounded-full transition-all cursor-pointer group"
            >
              <img 
                src={profilePicture || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} 
                alt="Foto de perfil" 
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shrink-0"
              />
              <div className="flex flex-col text-left overflow-hidden">
                <span className="text-xs text-text-muted leading-tight">Logado como</span>
                <span className="text-sm text-white font-semibold leading-tight truncate group-hover:text-purple-400 transition-colors">
                  @{username}
                </span>
              </div>
            </button>

            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsDropdownOpen(false)}
                ></div>
                
                <div className="absolute top-full left-0 mt-2 w-full bg-background border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                  <button 
                    onClick={handleGoToProfile}
                    className="w-full text-center md:text-left px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors"
                  >
                    Meu Perfil
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-center md:text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors border-t border-white/5"
                  >
                    Sair
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button 
            onClick={handleLoginClick}
            className="flex justify-center w-25 h-10 items-center bg-primary text-white font-bold rounded hover:bg-secondary transition disabled:opacity-50"
          >
            Entrar
          </button>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </header>
  );
}