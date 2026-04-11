'use client';

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import GaleriaProduto from "./GaleriaProduto";
import SeletorVariacoes, { Variacao } from "./SeletorVariacoes";
import { useCart } from "@/app/contexts/CartContext";
import { Tag } from "lucide-react";

interface ModalProdutoProps {
  produtoId: string;
  onClose: () => void;
}

export default function ModalProduto({ produtoId, onClose }: ModalProdutoProps) {

  const { adicionarAoCarrinho } = useCart();

  const [produto, setProduto] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  const [variacaoSelecionada, setVariacaoSelecionada] = useState<Variacao | null>(null);
  const [corAtiva, setCorAtiva] = useState<string | null>(null);
  const [quantidade, setQuantidade] = useState(1);

  const seletorRef = useRef<HTMLDivElement>(null);
  const acaoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carregarProduto = async () => {
      try {
        const response = await api.get(`/produtos/${produtoId}`);
        setProduto(response.data);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      } finally {
        setCarregando(false);
      }
    };
    if (produtoId) carregarProduto();
  }, [produtoId]);

  useEffect(() => {
    setQuantidade(1);
  }, [variacaoSelecionada]);

  useEffect(() => {
    if (corAtiva && seletorRef.current) {
      setTimeout(() => {
        seletorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  }, [corAtiva]);

  useEffect(() => {
    if (variacaoSelecionada && acaoRef.current) {
      setTimeout(() => {
        acaoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  }, [variacaoSelecionada]);

  const handleAdicionarAoCarrinho = () => {
    if (!variacaoSelecionada) {
      alert("Por favor, selecione uma cor e um tamanho primeiro!");
      return;
    }

    //define qual preço aparece no carrinho (é recalculado no back)
    const precoFinal = produto.precoPromocional ? produto.precoPromocional : produto.preco;

    adicionarAoCarrinho({
      produtoId: produto.lookupId,
      variacaoId: variacaoSelecionada.lookupId,
      nome: produto.nome,
      preco: precoFinal,
      cor: variacaoSelecionada.cor,
      tamanho: variacaoSelecionada.tamanho,
      quantidade: quantidade,
      quantidadeEstoqueMaxima: variacaoSelecionada.quantidadeEstoque,
      imagemUrl: variacaoSelecionada.imagemUrl || produto.imagemUrl || "/placeholder-produto.png"
    });

    onClose();
  };

  const temEstoqueGeral = produto?.variacoes?.some((v: any) => v.quantidadeEstoque > 0);
  const emPromocao = produto && produto.precoPromocional !== undefined && produto.precoPromocional !== null && produto.precoPromocional < produto.preco;
  const porcentagemDesconto = emPromocao ? Math.round(((produto.preco - produto.precoPromocional) / produto.preco) * 100) : 0;
  const precoExibicao = emPromocao ? produto.precoPromocional : produto?.preco;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md sm:p-4">

      <div className="bg-neutral-950 border-t sm:border border-neutral-800 rounded-t-3xl sm:rounded-2xl w-full max-w-5xl h-[92vh] sm:h-auto sm:max-h-[90vh] flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-neutral-900/80 sm:bg-black/50 hover:bg-red-500 text-white rounded-full transition-colors backdrop-blur-md"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="overflow-y-auto flex-1 p-5 pt-14 sm:p-10 [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
          {carregando ? (
            <div className="py-32 flex justify-center items-center">
              <div className="w-12 h-12 border-4 border-[#C2AE82] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !produto || !produto.ativo ? (
            <div className="py-20 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Produto indisponível</h2>
              <p className="text-gray-400">Este produto não foi encontrado ou foi removido.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 relative">

              {/* selo de promoção no modal */}
              {emPromocao && (
                <div className="absolute top-0 left-0 lg:-left-4 lg:-top-4 z-70 bg-red-600 text-white text-sm font-extrabold px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-1.5 animate-in slide-in-from-top fade-in">
                  <Tag size={16} fill="currentColor" />
                  {porcentagemDesconto}% OFF
                </div>
              )}

              <div className="w-full">
                {(() => {
                  const imagemDaCorAtiva = corAtiva
                    ? produto.variacoes?.find((v: any) => v.cor === corAtiva)?.imagemUrl
                    : null;
                  return (
                    <GaleriaProduto
                      imagemCapa={produto.imagemUrl}
                      imagemVariacao={variacaoSelecionada?.imagemUrl || imagemDaCorAtiva}
                      nomeProduto={produto.nome}
                    />
                  );
                })()}
              </div>

              <div className="flex flex-col">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2 pr-10">
                  {produto.nome}
                </h1>
                <div className="mb-4 sm:mb-5">
                  {emPromocao ? (
                    <div className="flex flex-col">
                      <span className="text-sm sm:text-base text-gray-500 line-through font-medium">
                        De R$ {produto.preco.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-[#C2AE82]">
                        Por R$ {precoExibicao.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xl sm:text-2xl font-light text-[#C2AE82]">
                      R$ {precoExibicao.toFixed(2).replace('.', ',')}
                    </p>
                  )}
                </div>

                {produto.descricao && (
                  <p className="text-gray-400 text-sm leading-relaxed mb-5 sm:mb-6">
                    {produto.descricao}
                  </p>
                )}

                <div className="w-full h-px bg-neutral-800 mb-5 sm:mb-6"></div>

                {produto.variacoes && produto.variacoes.length > 0 && temEstoqueGeral ? (
                  <div ref={seletorRef} className="space-y-6 flex-grow">
                    <SeletorVariacoes
                      variacoes={produto.variacoes}
                      onVariacaoSelecionada={setVariacaoSelecionada}
                      onCorSelecionada={setCorAtiva}
                    />

                    {variacaoSelecionada && (
                      <div
                        ref={acaoRef}
                        className="sticky bottom-0 sm:static bg-neutral-950 sm:bg-transparent pt-4 pb-2 sm:pt-2 sm:pb-0 border-t border-neutral-800 sm:border-transparent mt-auto animate-in fade-in slide-in-from-bottom-4 duration-300"
                      >

                        {variacaoSelecionada.quantidadeEstoque > 0 ? (
                          <>
                            <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                              Em Estoque ({variacaoSelecionada.quantidadeEstoque})
                            </p>

                            <div className="flex flex-row gap-3">
                              <div className="flex items-center justify-between border-2 border-neutral-700 bg-black rounded-xl p-1 w-28 sm:w-32 h-12 shrink-0">
                                <button onClick={() => setQuantidade(Math.max(1, quantidade - 1))} className="w-10 h-full text-gray-400 hover:text-white">-</button>
                                <span className="font-extrabold text-white">{quantidade}</span>
                                <button onClick={() => setQuantidade(Math.min(variacaoSelecionada.quantidadeEstoque, quantidade + 1))} className="w-10 h-full text-gray-400 hover:text-white">+</button>
                              </div>

                              <button onClick={handleAdicionarAoCarrinho} className="flex-1 h-12 bg-[#C2AE82] hover:bg-[#a8956b] text-black font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap">
                                <svg className="w-5 h-5 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                Adicionar
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="bg-red-950/20 border border-red-900/50 p-4 rounded-xl text-center">
                            <p className="text-red-400 font-bold">Variação Esgotada</p>
                            <p className="text-xs text-red-500/70 mt-1">Selecione outro tamanho ou cor.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-950/20 border border-red-900/50 p-4 rounded-xl text-center">
                    <p className="text-red-400 font-bold">Produto Esgotado</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}