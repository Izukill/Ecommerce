'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Percent, Tag, Sparkles } from "lucide-react";

import ProdutoCard, { Produto } from "./components/produto/ProdutoCard";
import ModalProduto from "./components/produto/ModalProduto";
import Header from "./components/layout/Header";
import BackgroundAnimado from "./components/layout/BackgroundAnimado";
import VitrineProdutos from "./components/produto/VitrineProdutos";

interface VitrineCategoria {
  id: string;
  nome: string;
  ordem: number;
  produtos: Produto[];
  percentualDesconto?: number;
}

export default function HomePage() {
  const [vitrines, setVitrines] = useState<VitrineCategoria[]>([]);
  const [lancamentos, setLancamentos] = useState<Produto[]>([]);
  const [promocoes, setPromocoes] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [produtoVisualizado, setProdutoVisualizado] = useState<string | null>(null);

  useEffect(() => {
    const carregarDadosHome = async () => {
      try {
        //busca dos lançamentos
        const resLancamentos = await api.get("/produtos?page=0&size=8&sort=dataCriacao,desc");
        const dadosLancamentos = resLancamentos.data?.content || resLancamentos.data || [];
        setLancamentos(dadosLancamentos.filter((p: Produto) => p.ativo === true));

        //busca das promo
        const resPromocoes = await api.get("/produtos?page=0&size=10&sort=dataCriacao,desc");
        const dadosGerais = resPromocoes.data?.content || resPromocoes.data || [];
        const itensComDesconto = dadosGerais
          .filter((p: any) => p.ativo === true && p.precoPromocional !== null && p.precoPromocional < p.preco)
          .slice(0, 8);
        setPromocoes(itensComDesconto);

        //busca as categorias
        const resCategorias = await api.get("/categorias?sort=ordemExibicao,asc");
        const categoriasDb = resCategorias.data?.content || resCategorias.data || [];
        const categoriasAtivasNaHome = categoriasDb.filter((c: any) => c.mostrarNaHome === true);

        const vitrinesCompletas: VitrineCategoria[] = [];

        for (const cat of categoriasAtivasNaHome) {
          const res = await api.get(`/produtos?categoriaId=${cat.lookupId}&page=0&size=8&sort=dataCriacao,desc`);
          const dados = res.data?.content || res.data || [];
          const produtosAtivos = dados.filter((p: Produto) => p.ativo === true);

          if (produtosAtivos.length > 0) {
            vitrinesCompletas.push({
              id: cat.lookupId,
              nome: cat.nome,
              ordem: cat.ordemExibicao || 0,
              produtos: produtosAtivos.slice(0, 8),
              percentualDesconto: cat.percentualDesconto
            });
          }
        }

        setVitrines(vitrinesCompletas);

      } catch (error) {
        console.error("Erro ao carregar a Home:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarDadosHome();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* banner */}
        <div className="relative bg-black/70 h-[70vh] flex items-center justify-center border-b border-gray-900 shadow-2xl">
          <BackgroundAnimado />
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">Chegou a Nova Coleção</h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-400 mb-8">Roupas que acompanham o seu ritmo. Conforto e estilo para o seu treino ou para o seu dia a dia.</p>
            <div className="flex justify-center space-x-4">
              <Link href="#lancamentos" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-md text-black bg-[#C2AE82] hover:bg-[#a8956b] shadow-lg transition-all md:py-4 md:text-lg md:px-10">
                Ver Novidades
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-32">

          {carregando ? (
            <div className="py-20 flex justify-center items-center gap-3 text-[#C2AE82] font-bold tracking-widest uppercase">
              <div className="w-8 h-8 border-4 border-[#C2AE82] border-t-transparent rounded-full animate-spin"></div>
              Montando vitrines exclusivas...
            </div>
          ) : (
            <>
              {/* fixa de promos */}
              {promocoes.length > 0 && (
                <div id="ofertas" className="vitrine-section relative bg-red-950/5 p-8 rounded-3xl border border-red-900/20">
                  <div className="flex items-end justify-between mb-8 border-b border-red-600/30 pb-4">
                    <div>
                      <h2 className="text-3xl font-extrabold text-red-500 tracking-tight sm:text-4xl flex items-center gap-3">
                        <Percent className="animate-bounce" size={32} />
                        Ofertas Imperdíveis
                      </h2>
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2">Preços especiais por tempo limitado!</p>
                    </div>
                    <Link href="/produtos?emOferta=true" className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors">
                      Ver todas as ofertas &rarr;
                    </Link>
                  </div>

                  <VitrineProdutos
                    vitrine={{ id: 'promocoes', nome: 'Ofertas', ordem: -1, produtos: promocoes }}
                    onProdutoClick={setProdutoVisualizado}
                  />
                </div>
              )}

              {/* Lançamentos */}
              {lancamentos.length > 0 && (
                <div id="lancamentos" className="vitrine-section relative">
                  <div className="flex items-end justify-between mb-8 border-b border-[#C2AE82]/30 pb-4">
                    <div>
                      <h2 className="text-3xl font-extrabold text-[#C2AE82] tracking-tight sm:text-4xl flex items-center gap-3">
                        <Sparkles size={28} className="animate-pulse filter drop-shadow-[0_0_8px_rgba(194,174,130,0.8)]" />
                        Lançamentos Recentes
                      </h2>
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2">Acabaram de chegar na loja!</p>
                    </div>
                  </div>

                  <VitrineProdutos
                    vitrine={{ id: 'lancamentos', nome: 'Lançamentos', ordem: 0, produtos: lancamentos }}
                    onProdutoClick={setProdutoVisualizado}
                  />
                </div>
              )}

              {/* vitrine das categorias */}
              {vitrines.length > 0 && vitrines.map((vitrine) => (
                <div key={vitrine.id} className="vitrine-section">
                  <div className="flex items-end justify-between mb-8 border-b border-neutral-800 pb-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                          {vitrine.nome}
                        </h2>

                        {/* selo de promoção em categoria */}
                        {vitrine.percentualDesconto && vitrine.percentualDesconto > 0 && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-[12px] font-black rounded-full shadow-lg animate-pulse">
                            <Tag size={12} fill="currentColor" />
                            {vitrine.percentualDesconto}% OFF
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#C2AE82] font-bold uppercase tracking-widest">Destaques da Coleção</p>
                    </div>

                    <Link
                      href={`/produtos?categoria=${vitrine.id}`}
                      className="hidden sm:inline-flex items-center text-sm font-bold text-gray-400 hover:text-white transition-colors"
                    >
                      Ver coleção completa &rarr;
                    </Link>
                  </div>

                  <VitrineProdutos
                    vitrine={vitrine}
                    onProdutoClick={setProdutoVisualizado}
                  />
                </div>
              ))}
            </>
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