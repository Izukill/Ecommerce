'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

import ProdutoCard, { Produto } from "./components/ProdutoCard";
import ModalProduto from "./components/ModalProduto";
import Header from "./components/Header"; // 👇 IMPORTA O NOVO HEADER

export default function HomePage() {
  const [lancamentos, setLancamentos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
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
      {/* USO DO COMPONENTE */}
      <Header />

      <main className="flex-grow">
        {/* HERO BANNER */}
        <div className="relative bg-black/70 h-[70vh] flex items-center justify-center border-b border-gray-900 shadow-2xl">
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">Chegou a Nova Coleção</h1>
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

      {produtoVisualizado && (
        <ModalProduto
          produtoId={produtoVisualizado}
          onClose={() => setProdutoVisualizado(null)}
        />
      )}
    </div>
  );
}