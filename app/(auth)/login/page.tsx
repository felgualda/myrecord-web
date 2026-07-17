"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Art } from "@/types/art";
import arts from "@/app/data/arts.json";
import SongOfTheDayCard from "@/components/SongOfTheDayCard";
import { SpotifyTrack } from "@/types/spotify";

export default function LoginPage() {
    const router = useRouter();
    
    const [sotd, setSotd] = useState<SpotifyTrack | null>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getSOTD = async () => {
            try {
                const response = await fetch(`${process.env['NEXT_PUBLIC_API_URL']}/api/spotify/sotd`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                const data = await response.json();

                if(!response.ok) {
                    throw new Error(data.error || "Erro ao receber música do dia");
                } else {
                    setSotd(data);
                }
            } catch (err: any) {
                console.error(err);
            } finally {

            }
        }

        getSOTD();

    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("")
        setLoading(true);

        try {
            const response = await fetch(`${process.env['NEXT_PUBLIC_API_URL']}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.error || "Erro ao fazer login");
            }

            localStorage.setItem("myrecord_token", data.token);
            localStorage.setItem("myrecord_username", data.username);

            console.log(data.picture)
            localStorage.setItem("myrecord_picture", data.picture);

            router.push("/");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false)
        }
    };

    return (
    <main style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
        
        <div style={{ width: "40%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", zIndex: 10, borderRight: "1px solid rgba(255, 255, 255, 0.15)" }}
            className="bg-background shadow-2xl">
            <div className=" w-full max-w-md p-8 rounded-xl">
                <h1 className="text-2xl font-bold text-center text-text-main mb-6">Entrar no MyRecord</h1>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="py-1">
                        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-background-light rounded focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder-text-dark text-text-main" />
                    </div>

                    <div className="pb-5">
                        <input type="password" placeholder="Senha" required value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 bg-background-light rounded focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder-text-dark text-text-main" />              
                    </div>

                    <button type="submit" disabled={loading}
                    className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-secondary transition disabled:opacity-50">
                    {loading ? "Entrando..." : "Entrar"}
                    </button>    
                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Não tem conta? <a href="/signup" className="text-primary hover:underline">Cadastre-se</a>
                </p>
            </div>
        </div>

        <div className="bg-background-dark w-full flex items-center justify-center">
            <SongOfTheDayCard spotifyId={sotd?.spotifyId} title={sotd?.title} artist={sotd?.artist} albumImage={sotd?.albumImage}/>
        </div>
        
    </main>
);
}