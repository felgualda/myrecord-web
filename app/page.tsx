"use client";

import { useState, useEffect } from "react";
import SongCard from "@/components/SongCard";

interface SpotifyTrack {
  spotifyId: string;
  title: string;
  artist: string;
  albumImage: string;
  previewUrl: string | null;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

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
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectTrack = (track: SpotifyTrack) => {
    setShowDropdown(false);
    setSearchQuery("");
    
    //adicionar
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="bg-primary-light py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Bem-vindo ao MyRecord!
          </h1>

        </div>
        
      </section>    
          <div className="relative w-full max-w-2xl mx-auto text-left z-50 py-10">
            <div className="p-[1px] rounded-full bg-linear-[65deg] from-purple-500 to-pink-500 shadow-lg">
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
            
            {showDropdown && results.length === 0 && !loading && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 text-center text-gray-500">
                Nenhuma música encontrada.
              </div>
            )}
          </div>
            
    </main>
  );
}