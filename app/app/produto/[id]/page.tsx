'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

import GaleriaProduto from "@/app/components/GaleriaProduto";
import SeletorVariacoes, { Variacao } from "@/app/components/SeletorVariacoes";

export default function DetalhesProdutoPage() {
  const params = useParams();
  const router = useRouter();
  const produtoId = params.id as string;

  const [produto, setProduto] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  // Estado que recebe a variação exata que o usuário escolheu no Seletor
  const [variacaoSelecionada, setVariacaoSelecionada] = useState<Variacao | null>(null);
  const [quantidade, setQuantidade] = useState(1);

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

  // Reseta a quantidade para 1 sempre que a usuária trocar de cor ou tamanho
  useEffect(() => {
    setQuantidade(1);
  }, [variacaoSelecionada]);

  const handleAdicionarAoCarrinho = () => {
    if (!variacaoSelecionada) {
      alert("Por favor, selecione uma cor e um tamanho primeiro!");
      return;
    }

    // AQUI ENTRARÁ A LÓGICA DO CONTEXTO DE CARRINHO NO FUTURO
    const itemCarrinho = {
      produtoId: produto.lookupId,
      nome: produto.nome,
      preco: produto.preco,
      variacaoId: variacaoSelecionada.lookupId,
      cor: variacaoSelecionada.cor,
      tamanho: variacaoSelecionada.tamanho,
      quantidade: quantidade,
      imagem: variacaoSelecionada.imagemUrl || produto.imagemUrl
    };

    console.log("Adicionado ao carrinho:", itemCarrinho);
    alert(`Oba! ${quantidade}x ${produto.nome} (${variacaoSelecionada.cor} - ${variacaoSelecionada.tamanho}) adicionado ao carrinho! 🛒`);
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-neutral-950 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-[#C2AE82] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!produto || !produto.ativo) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl mb-4">🥲</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Produto indisponível</h2>
        <p className="text-gray-400 mb-6">Este produto não foi encontrado ou foi removido da loja.</p>
        <Link href="/" className="px-6 py-3 bg-[#C2AE82] text-black font-bold rounded-lg hover:bg-[#a8956b] transition-colors">Voltar para a Home</Link>
      </div>
    );
  }

  // Verifica se o produto tem alguma variação cadastrada e com estoque
  const temEstoqueGeral = produto.variacoes && produto.variacoes.length > 0;

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMB (Navegação estrutural) */}
        <nav className="mb-8 flex items-center text-sm font-bold text-gray-500 gap-2">
          <Link href="/" className="hover:text-[#C2AE82] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-300">{produto.categoria?.nome || "Produto"}</span>
          <span>/</span>
          <span className="text-[#C2AE82] truncate">{produto.nome}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* ESQUERDA: GALERIA DE FOTOS */}
          <div className="w-full">
            <GaleriaProduto
              imagemCapa={produto.imagemUrl}
              imagemVariacao={variacaoSelecionada?.imagemUrl}
              nomeProduto={produto.nome}
            />
          </div>

          {/* DIREITA: DETALHES E COMPRA */}
          <div className="flex flex-col">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              {produto.nome}
            </h1>

            <p className="text-3xl font-light text-[#C2AE82] mb-6">
              R$ {produto.preco.toFixed(2).replace('.', ',')}
            </p>

            {produto.descricao && (
              <p className="text-gray-400 text-base leading-relaxed mb-10">
                {produto.descricao}
              </p>
            )}

            <div className="w-full h-px bg-neutral-800 mb-8"></div>

            {temEstoqueGeral ? (
              <div className="space-y-8 flex-grow">
                {/* COMPONENTE SELETOR */}
                <SeletorVariacoes
                  variacoes={produto.variacoes}
                  onVariacaoSelecionada={setVariacaoSelecionada}
                />

                {/* CONTROLE DE QUANTIDADE E BOTÃO DE COMPRA */}
                {variacaoSelecionada && (
                  <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      Em Estoque ({variacaoSelecionada.quantidadeEstoque} peças)
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">

                      {/* BOTOES DE QUANTIDADE (+ e -) */}
                      <div className="flex items-center justify-between border-2 border-neutral-700 bg-black rounded-xl p-1 w-full sm:w-32 h-14">
                        <button
                          onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                          className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="font-extrabold text-white">{quantidade}</span>
                        <button
                          onClick={() => setQuantidade(Math.min(variacaoSelecionada.quantidadeEstoque, quantidade + 1))}
                          className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      {/* BOTÃO ADICIONAR AO CARRINHO */}
                      <button
                        onClick={handleAdicionarAoCarrinho}
                        className="flex-1 h-14 bg-[#C2AE82] hover:bg-[#a8956b] text-black font-extrabold text-lg rounded-xl shadow-[0_10px_30px_rgba(194,174,130,0.2)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        Adicionar ao Carrinho
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-950/20 border border-red-900/50 p-6 rounded-xl text-center">
                <p className="text-red-400 font-bold text-lg mb-1">Produto Esgotado</p>
                <p className="text-red-500/70 text-sm">Fique de olho, em breve teremos reposição!</p>
              </div>
            )}

            {/* SELOS DE CONFIANÇA */}
            <div className="mt-12 grid grid-cols-2 gap-4 border-t border-neutral-800 pt-8">
              <div className="flex items-center gap-3 text-gray-400">
                <svg className="w-8 h-8 text-[#C2AE82]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <span className="text-xs font-bold uppercase tracking-wider">Compra 100% Segura</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <svg className="w-8 h-8 text-[#C2AE82]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                <span className="text-xs font-bold uppercase tracking-wider">Primeira Troca Grátis</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}