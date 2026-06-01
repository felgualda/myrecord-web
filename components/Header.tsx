"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {

    const router = useRouter();
    const [profilePicture, setProfilePicture] = useState<string | null>(null);


    useEffect(() => {
        const pic = localStorage.getItem("myrecord_picture");
        if (pic && pic !== "undefined") {
        setProfilePicture(pic);
        }
    }, []);

    const handleProfileClick = () => {
        const username = localStorage.getItem("myrecord_username");
        if (username) {
        router.push(`/user/${username}`);
        } else {
        router.push("/login");
        }
    };

  return (
    <header className="relative bg-background-light flex py-5 px-3">
        <button className="rounded border-1 border-background w-8 h-8 text-center text-background"> ≡ </button>

      <h1 className="text-4xl md:text-xl text-white px-3">MyRecord</h1>
      
      <nav>

      </nav>

      <button 
        onClick={handleProfileClick} 
        className="absolute top-6 right-6 md:top-2 md:right-10 transition-transform hover:scale-105"
      >
        <img 
          src={profilePicture || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"} 
          alt="Foto de perfil" 
          className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/20 object-cover shadow-md"
        />
      </button>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </header>
  );
}