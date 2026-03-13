'use client';

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  // Estados para capturar o que o usuário digita
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Estados para controle de UI (carregamento e mensagens de erro)
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Função disparada ao clicar em "Entrar"
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue
    setErro("");
    setCarregando(true);

    try {
      // Fazendo a chamada para a nossa API Spring Boot (Atenção ao context-path!)
      const response = await fetch("http://localhost:8080/Mirlle/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }), // Ajuste se o seu DTO usar nomes diferentes
      });

      if (!response.ok) {
        throw new Error("E-mail ou senha incorretos.");
      }

      // Se o Spring Boot retornar 200 OK, nós pegamos o Token!
      const data = await response.json();

      // Guardamos o Token no navegador (localStorage)
      // Ajuste o "data.token" de acordo com o nome do campo que a sua API retorna
      localStorage.setItem("mirlle_token", data.token);

      // Redireciona o usuário para o painel de pedidos ou vitrine
      router.push("/admin/pedidos");

    } catch (error: any) {
      setErro(error.message || "Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">

        {/* Cabeçalho do Login */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            MirlleFitness
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Acesse o painel administrativo ou sua conta
          </p>
        </div>

        {/* Formulário */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>

          {/* Alerta de Erro */}
          {erro && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-sm text-red-700">{erro}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                required
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={carregando}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-colors"
            >
              {carregando ? "Autenticando..." : "Entrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}