'use client';

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import InputSenha from "@/app/components/InputSenha";

// Função nativa para decodificar o token (sem instalar libs)
const decodificarToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const response = await api.post("/login", { email, senha });
      const tokenJWT = response.data.token;

      localStorage.setItem("mirlle_token", tokenJWT);

      const dadosDoToken = decodificarToken(tokenJWT);

      if (dadosDoToken && dadosDoToken.perfil === "ADM") {
        router.push("/admin");
      } else {
        router.push("/");
      }

    } catch (error: any) {
      setErro("E-mail ou senha incorretos.");
    } finally {
      setCarregando(false);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center px-4">
      {/* CARD: */}
      <div className="max-w-md w-full space-y-8 bg-black p-10 rounded-xl shadow-2xl border-t-4 border-[#C2AE82]">

        {/* Cabeçalho do Login  */}
        <div className="text-center">
          <Link href="/" className="text-3xl font-extrabold text-white tracking-tighter cursor-pointer">
            MIRLLE<span className="text-[#C2AE82]">FITNESS</span>
          </Link>
          <p className="mt-2 text-sm text-gray-400 font-medium">
            Acesse a sua conta
          </p>
        </div>

        {/* Formulário */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>

          {erro && (
            <div className="bg-red-950 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-sm text-red-200 font-semibold">{erro}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Input de E-mail */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-100">
                E-mail
              </label>
              <div className="relative mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C2AE82] focus:border-transparent bg-black sm:text-sm [&:autofill]:shadow-[inset_0_0_0px_1000px_#000000] [&:autofill]:[-webkit-text-fill-color:#F3F4F6]"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Input de Senha (já atualizado acima) */}
            <div>
              <InputSenha
                id="senha"
                label="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
          </div>

          <div>
            {/* Botão Principal: Fundo Preto, Texto Dourado */}
            <button
              type="submit"
              disabled={carregando}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-[#C2AE82] bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-all shadow-md"
            >
              {carregando ? "Autenticando..." : "Entrar"}
            </button>
          </div>

          <div className="text-center mt-4">
            {/* Texto de Footer Claro e Link Dourado */}
            <p className="text-sm text-gray-400">
              Não tem uma conta? <Link href="/registro" className="font-bold text-[#C2AE82] hover:underline">Criar conta</Link>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}