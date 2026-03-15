'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import ProdutoCard, { Produto } from "./components/ProdutoCard";
import { useAuth } from "./contexts/AuthContext";
import { api } from "@/lib/api";
import ModalProduto from "./components/ModalProduto";

export default function HomePage() {
  const { usuario, logout } = useAuth();
  const primeiroNome = usuario && usuario.nome ? usuario.nome.split(' ')[0] : "";

  const [lancamentos, setLancamentos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Controla se o modal está aberto e qual produto mostrar
  const [produtoVisualizado, setProdutoVisualizado] = useState<string | null>(null);

  useEffect(() => {
    const carregarVitrine = async () => {
      try {
        const response = await api.get("/produtos?page=0&size=12&sort=dataCriacao,desc");
        const dados = response.data?.content || response.data || [];

        const produtosAtivos = dados.filter((p: Produto) => p.ativo === true);
        setLancamentos(produtosAtivos.slice(0, 8));
      } catch (error) {
        console.error("Erro ao carregar a vitrine:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarVitrine();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      {/* HEADER COMPLETO */}
      <header className="sticky top-0 z-50 bg-[#C2AE82] shadow-lg border-b border-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2 cursor-pointer">
                <img
                  src="/logoMirle.png"
                  alt="Logo MirlleFitness"
                  className="h-20 w-auto object-contain"
                />
                <span className="text-2xl font-extrabold tracking-tighter text-black">
                  MIRLLE<span className="text-black/70">FITNESS</span>
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex space-x-8">
              <Link href="#vitrine" className="text-black font-semibold hover:text-white transition-colors">Lançamentos</Link>
              <Link href="#" className="text-black font-semibold hover:text-white transition-colors">Moda Praia</Link>
              <Link href="#" className="text-black font-semibold hover:text-white transition-colors">Acessórios</Link>
              <Link href="#" className="text-black font-semibold hover:text-white transition-colors">Ofertas</Link>
            </nav>

            <div className="flex items-center space-x-5">
              <button className="text-black hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>

              {usuario ? (
                <div className="flex items-center gap-4 border-r border-black/20 pr-4">
                  <span className="text-black font-bold capitalize">Olá, {primeiroNome}</span>
                  {usuario.perfil === "ADM" && (
                    <Link href="/admin" className="text-xs font-bold bg-black text-[#C2AE82] px-3 py-1.5 rounded-md hover:bg-gray-800 transition">
                      Painel Admin
                    </Link>
                  )}
                  <button onClick={logout} className="text-black hover:text-white transition-colors text-sm font-bold">
                    Sair
                  </button>
                </div>
              ) : (
                <Link href="/login" className="text-black hover:text-white transition-colors" title="Fazer Login">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </Link>
              )}

              <button className="text-black hover:text-white transition-colors relative">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-[#C2AE82]">0</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">

        {/* HERO BANNER */}
        <div className="relative bg-black/70 h-[70vh] flex items-center justify-center border-b border-gray-900 shadow-2xl">
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
            <h1 className="text-xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">Chegou a Nova Coleção</h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-400 mb-8">Roupas que acompanham o seu ritmo. Conforto e estilo para o seu treino ou para o seu dia a dia.</p>
            <div className="flex justify-center space-x-4">
              <Link href="#vitrine" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-md text-black bg-[#C2AE82] hover:bg-[#a8956b] shadow-lg transition-all md:py-4 md:text-lg md:px-10">
                Ver Produtos
              </Link>
            </div>
          </div>
        </div>

        {/* VITRINE DE PRODUTOS */}
        <div id="vitrine" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-100 tracking-tight sm:text-4xl">Lançamentos</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">As peças mais desejadas da coleção atual.</p>
          </div>

          {carregando ? (
            <div className="py-20 flex justify-center items-center gap-3 text-[#C2AE82] font-bold tracking-widest uppercase">
              <div className="w-8 h-8 border-4 border-[#C2AE82] border-t-transparent rounded-full animate-spin"></div>
              Montando a vitrine...
            </div>
          ) : lancamentos.length === 0 ? (
            <div className="text-center py-20 bg-neutral-900 rounded-xl border border-neutral-800">
              <p className="text-gray-400 font-bold">Nenhum produto disponível no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {lancamentos.map((produto) => (
                <div
                  key={produto.lookupId}
                  onClick={() => setProdutoVisualizado(produto.lookupId)}
                  className="cursor-pointer transition-transform hover:-translate-y-2 duration-300"
                >
                  <ProdutoCard produto={produto} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL DE PRODUTO (Quick View) */}
      {produtoVisualizado && (
        <ModalProduto
          produtoId={produtoVisualizado}
          onClose={() => setProdutoVisualizado(null)}
        />
      )}
    </div>
  );
}