"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Art } from "@/types/art";
import arts from "@/app/data/arts.json";
import SongOfTheDayCard from "@/components/SongOfTheDayCard";
import { SpotifyTrack } from "@/types/spotify";

export default function SignupPage() {
    const router = useRouter();

    const [randomBackground, setRandomBackground] = useState<Art | null>(null);
    const [sotd, setSotd] = useState<SpotifyTrack | null>(null);

    const [formData, setFormData] = useState({
        username: "", nickname: "", email: "", password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    }

    useEffect(() => {
        const index = Math.floor(Math.random() * arts.length);

        setRandomBackground(arts[index]);

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

    if (!randomBackground) {
        return <main className="min-h-screen bg-background"></main>;
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${process.env['NEXT_PUBLIC_API_URL']}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.errors?.[0] || "Erro ao criar conta");
            }

            alert("Conta criada com sucesso!")
            router.push("/login");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false)
        }
    };

    return(
        <main style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
        
        <div style={{ width: "40%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", zIndex: 10, borderRight: "2px solid rgba(255, 255, 255, 0.15)"  }}
            className="bg-background shadow-2xl">
            <div className=" w-full max-w-md p-8 rounded-xl">
                <h1 className="text-2xl font-bold text-center text-text-main mb-6">Criar conta</h1>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="py-1">
                        <input type="text" name="username" placeholder="Nome de usuário" required onChange={handleChange}
                        className="bg-background-light w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder-text-dark text-text-main" />
                    </div>

                    <div className="py-1">                    
                        <input type="text" name="nickname" placeholder="Apelido" required onChange={handleChange}
                        className="bg-background-light w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder-text-dark text-text-main" />
                    </div>

                    <div className="py-1">                                         
                        <input type="email" name="email" placeholder="Endereço de Email" required onChange={handleChange}
                        className="bg-background-light w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder-text-dark text-text-main" />
                    </div>                    
                    
                    <div className="pb-5">                          
                        <input type="password" name="password" placeholder="Senha (mín. 8 caracteres)" required onChange={handleChange}
                        className="bg-background-light w-full p-3 rounded focus:outline-none focus:ring-2 focus:ringaccent/50 placeholder-text-dark text-text-main" />
                    </div>                       

                    <button type="submit" disabled={loading}
                    className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-secondary transition disabled:opacity-50">
                        {loading ? "Aguarde..." : "Cadastrar"}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-4">
                    Já tem conta? <a href="/login" className="text-primary hover:underline">Fazer login</a>
                </p>
            </div>
        </div>

        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <img
                src={randomBackground.imagePath}
                alt={randomBackground.title}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />

            <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1 }} />

            <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
                <div className="p-4 rounded-lg">
                    <SongOfTheDayCard track={sotd} />
                </div>
            </div>

            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.5rem", background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
                <p style={{ color: "white", fontWeight: 600, fontSize: "1.125rem", margin: 0 }}>{randomBackground.title}</p>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem", margin: 0 }}>{randomBackground.artist}</p>
            </div>
        </div>
        
    </main>
    )
}