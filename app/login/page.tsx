"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("")
        setLoading(true);

        try {
            const response = await fetch(`${process.env['NEXT_PUBLIC_API_URL']}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.error || "Erro ao fazer login");
            }

            localStorage.setItem("myrecord_token", data.token);

            router.push("/");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false)
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-emerald-600 mb-6">Entrar no MyRecord</h1>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500" />

                    <input type="password" placeholder="Senha" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500" />              

                    <button type="submit" disabled={loading}
                    className="w-full bg-emerald-600 text-white font-bold py-3 rounded hover:bg-emerald-700 transition disabled:opacity-50">
                    {loading ? "Entrando..." : "Entrar"}
                    </button>    
                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Não tem conta? <a href="/" className="text-emerald-600 hover:underline">Cadastre-se</a>
                </p>
            </div>
        </main>
    );
}