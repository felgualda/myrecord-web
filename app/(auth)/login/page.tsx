"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Art } from "@/types/art";
import arts from "@/app/data/arts.json";

export default function LoginPage() {
    const router = useRouter();
    
    const [randomBackground, setRandomBackground] = useState<Art | null>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const index = Math.floor(Math.random() * arts.length);

        setRandomBackground(arts[index]);

    }, []);

    if (!randomBackground) {
        return <main className="min-h-screen bg-background-light"></main>;
    }

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
        
        <div style={{ width: "40%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", zIndex: 10 }}
            className="bg-background shadow-2xl">
            <div className=" w-full max-w-md p-8 rounded-xl shadow-md">
                <h1 className="text-2xl font-bold text-center text-primary mb-6">Entrar no MyRecord</h1>

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

        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <img
                src={randomBackground.imagePath}
                alt={randomBackground.title}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />

            <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.2)", zIndex: 1 }} />

            <div className="absolute inset-0 bg-black/40" />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.5rem", background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
                <p style={{ color: "white", fontWeight: 600, fontSize: "1.125rem", margin: 0 }}>{randomBackground.title}</p>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem", margin: 0 }}>{randomBackground.artist}</p>
            </div>
        </div>
        
    </main>
);
}