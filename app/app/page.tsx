'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

import ProdutoCard, { Produto } from "./components/produto/ProdutoCard";
import VitrineProdutos from "./components/produto/VitrineProdutos";
import ModalProduto from "./components/produto/ModalProduto";
import Header from "./components/layout/Header";
import BackgroundAnimado from "./components/layout/BackgroundAnimado";

interface VitrineCategoria {
  id: string;
  nome: string;
  ordem: number;
  produtos: Produto[];
}

export default function HomePage() {
  const [vitrines, setVitrines] = useState<VitrineCategoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [produtoVisualizado, setProdutoVisualizado] = useState<string | null>(null);

  useEffect(() => {
    const montarVitrinesDinamicamente = async () => {
      try {
        // 1. Busca quais categorias o Admin ligou para aparecer na Home (Ordenadas)
        const resCategorias = await api.get("/categorias?sort=ordemExibicao,asc");
        const categoriasDb = resCategorias.data?.content || resCategorias.data || [];

        // Filtra apenas as que têm mostrarNaHome = true
        const categoriasAtivasNaHome = categoriasDb.filter((c: any) => c.mostrarNaHome === true);

        // Se não houver nenhuma configurada, criamos uma vitrine "Lançamentos" genérica como fallback
        if (categoriasAtivasNaHome.length === 0) {
          const resGeral = await api.get("/produtos?page=0&size=8&sort=dataCriacao,desc");
          const dados = resGeral.data?.content || resGeral.data || [];
          setVitrines([{
            id: "lancamentos",
            nome: "Lançamentos",
            ordem: 0,
            produtos: dados.filter((p: Produto) => p.ativo === true).slice(0, 8)
          }]);
          setCarregando(false);
          return;
        }

        // 2. Para cada categoria ativa, busca os produtos correspondentes
        const vitrinesCompletas: VitrineCategoria[] = [];

        for (const cat of categoriasAtivasNaHome) {
          // Busca os 8 produtos mais recentes DESTA categoria
          const res = await api.get(`/produtos?categoriaId=${cat.lookupId}&page=0&size=8&sort=dataCriacao,desc`);
          const dados = res.data?.content || res.data || [];
          const produtosAtivos = dados.filter((p: Produto) => p.ativo === true);

          // Só cria a faixa se a categoria tiver pelo menos 1 produto ativo
          if (produtosAtivos.length > 0) {
            vitrinesCompletas.push({
              id: cat.lookupId,
              nome: cat.nome,
              ordem: cat.ordemExibicao || 0,
              produtos: produtosAtivos.slice(0, 8) // Mostra no máx 8 por faixa
            });
          }
        }

        setVitrines(vitrinesCompletas);

      } catch (error) {
        console.error("Erro ao montar as vitrines:", error);
      } finally {
        setCarregando(false);
      }
    };

    montarVitrinesDinamicamente();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* HERO BANNER */}
        <div className="relative bg-black/70 h-[70vh] flex items-center justify-center border-b border-gray-900 shadow-2xl">
          <BackgroundAnimado />
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">Chegou a Nova Coleção</h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-400 mb-8">Roupas que acompanham o seu ritmo. Conforto e estilo para o seu treino ou para o seu dia a dia.</p>
            <div className="flex justify-center space-x-4">
              <Link href="#vitrines-dinamicas" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-md text-black bg-[#C2AE82] hover:bg-[#a8956b] shadow-lg transition-all md:py-4 md:text-lg md:px-10">
                Ver Produtos
              </Link>
            </div>
          </div>
        </div>

        {/* 👇 RENDERIZAÇÃO DINÂMICA DAS VITRINES */}
        <div id="vitrines-dinamicas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-32">

          {carregando ? (
            <div className="py-20 flex justify-center items-center gap-3 text-[#C2AE82] font-bold tracking-widest uppercase">
              <div className="w-8 h-8 border-4 border-[#C2AE82] border-t-transparent rounded-full animate-spin"></div>
              Montando vitrine...
            </div>
          ) : vitrines.length === 0 ? (
            <div className="text-center py-20 bg-neutral-900 rounded-xl border border-neutral-800">
              <p className="text-gray-400 font-bold">Nenhuma vitrine configurada no momento.</p>
            </div>
          ) : (
            // Fazemos um .map no array de Vitrines para criar uma faixa para cada uma!
            vitrines.map((vitrine) => (
              <div key={vitrine.id} className="vitrine-section">

                {/* Título da Faixa (Nome da Categoria) */}
                <div className="flex items-end justify-between mb-8 border-b border-neutral-800 pb-4">
                  <div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                      {vitrine.nome}
                    </h2>
                    <p className="text-sm text-[#C2AE82] font-bold uppercase tracking-widest mt-2">Destaques da Coleção</p>
                  </div>

                  {/* Botão "Ver Tudo" que leva para a lista completa filtrada */}
                  <Link
                    href={`/#`} // 👈 (Você pode depois criar uma rota /produtos?categoria=ID)
                    className="hidden sm:inline-flex items-center text-sm font-bold text-gray-400 hover:text-white transition-colors"
                  >
                    Ver coleção completa &rarr;
                  </Link>
                </div>

                {/* Produtos da Categoria Específica */}
                <VitrineProdutos
                  vitrine={vitrine}
                  onProdutoClick={setProdutoVisualizado}
                />

              </div>
            ))
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