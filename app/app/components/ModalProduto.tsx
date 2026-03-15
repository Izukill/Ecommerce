'use client';

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import GaleriaProduto from "./GaleriaProduto";
import SeletorVariacoes, { Variacao } from "./SeletorVariacoes";
import { useCart } from "@/app/contexts/CartContext";

interface ModalProdutoProps {
  produtoId: string;
  onClose: () => void;
}

export default function ModalProduto({ produtoId, onClose }: ModalProdutoProps) {

  const { adicionarAoCarrinho } = useCart();

  const [produto, setProduto] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  const [variacaoSelecionada, setVariacaoSelecionada] = useState<Variacao | null>(null);
  const [quantidade, setQuantidade] = useState(1);

  // Busca os detalhes completos do produto assim que o modal abre
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

  const handleAdicionarAoCarrinho = () => {
    if (!variacaoSelecionada) {
      alert("Por favor, selecione uma cor e um tamanho primeiro!");
      return;
    }

    // Chama a função real do nosso Contexto!
    adicionarAoCarrinho({
      produtoId: produto.lookupId,
      variacaoId: variacaoSelecionada.lookupId,
      nome: produto.nome,
      preco: produto.preco,
      cor: variacaoSelecionada.cor,
      tamanho: variacaoSelecionada.tamanho,
      quantidade: quantidade,
      quantidadeEstoqueMaxima: variacaoSelecionada.quantidadeEstoque,
      imagemUrl: variacaoSelecionada.imagemUrl || produto.imagemUrl || "/placeholder-produto.png"
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-6">

      {/* Container Principal do Modal com Scroll Interno */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200">

        {/* Botão de Fechar (X) fixo no topo direito */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-red-500 text-white rounded-full transition-colors backdrop-blur-sm"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-6 sm:p-10">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

              {/* ESQUERDA: GALERIA */}
              <div className="w-full">
                <GaleriaProduto
                  imagemCapa={produto.imagemUrl}
                  imagemVariacao={variacaoSelecionada?.imagemUrl}
                  nomeProduto={produto.nome}
                />
              </div>

              {/* DIREITA: DETALHES E COMPRA */}
              <div className="flex flex-col">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2 pr-8">
                  {produto.nome}
                </h1>

                <p className="text-2xl font-light text-[#C2AE82] mb-4">
                  R$ {produto.preco.toFixed(2).replace('.', ',')}
                </p>

                {produto.descricao && (
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {produto.descricao}
                  </p>
                )}

                <div className="w-full h-px bg-neutral-800 mb-6"></div>

                {produto.variacoes && produto.variacoes.length > 0 ? (
                  <div className="space-y-6 flex-grow">
                    <SeletorVariacoes
                      variacoes={produto.variacoes}
                      onVariacaoSelecionada={setVariacaoSelecionada}
                    />

                    {variacaoSelecionada && (
                      <div className="pt-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                          Em Estoque ({variacaoSelecionada.quantidadeEstoque})
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex items-center justify-between border-2 border-neutral-700 bg-black rounded-xl p-1 w-full sm:w-32 h-12">
                            <button onClick={() => setQuantidade(Math.max(1, quantidade - 1))} className="w-10 h-full text-gray-400 hover:text-white">-</button>
                            <span className="font-extrabold text-white">{quantidade}</span>
                            <button onClick={() => setQuantidade(Math.min(variacaoSelecionada.quantidadeEstoque, quantidade + 1))} className="w-10 h-full text-gray-400 hover:text-white">+</button>
                          </div>

                          <button onClick={handleAdicionarAoCarrinho} className="flex-1 h-12 bg-[#C2AE82] hover:bg-[#a8956b] text-black font-extrabold rounded-xl transition-all flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            Adicionar ao Carrinho
                          </button>
                        </div>
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