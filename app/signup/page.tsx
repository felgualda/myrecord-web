"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: "", nickname: "", email: "", password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${process.env['NEXT_PUBLIC_API_URL']}/api/users/signup`, {
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
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-emerald-600 mb-6">Criar conta</h1>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSignup} className="space-y-4">
                    <input type="text" name="username" placeholder="Nome de usuário" required onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    
                    <input type="text" name="nickname" placeholder="Apelido" required onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    
                    <input type="email" name="email" placeholder="Endereço de Email" required onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    
                    <input type="password" name="password" placeholder="Senha (mín. 8 caracteres)" required onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500" />

                    <button type="submit" disabled={loading}
                    className="w-full bg-emerald-600 text-white font-bold py-3 rounded hover:bg-emerald-700 transition disabled:opacity-50">
                        {loading ? "Aguarde..." : "Cadastrar"}
                    </button>
                </form>
            </div>
        </main>
    )
}