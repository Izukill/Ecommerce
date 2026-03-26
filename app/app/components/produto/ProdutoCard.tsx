'use client';

import { useState } from "react";
import Link from "next/link";

export interface CategoriaCard {
  lookupId?: string;
  nome: string;
}

export interface Variacao {
  tamanho: string;
  cor: string;
  quantidadeEstoque: number;
  imagemUrl?: string;
}

export interface Produto {
  lookupId: string;
  nome: string;
  categoria: CategoriaCard | string;
  preco: number;
  ativo?: boolean;
  imagemUrl?: string;
  variacoes?: Variacao[];
}

interface ProdutoCardProps {
  produto: Produto;
  isAdmin?: boolean;
}

const mapaDeCores: Record<string, string> = {
  "preto": "#000000",
  "branco": "#FFFFFF",
  "vermelho": "#EF4444",
  "azul": "#3B82F6",
  "verde": "#10B981",
  "amarelo": "#F59E0B",
  "rosa": "#EC4899",
  "roxo": "#8B5CF6",
  "cinza": "#6B7280",
  "marrom": "#78350F",
  "laranja": "#F97316",
  "bege": "#D4D4D8",
  "azul marinho": "#1E3A8A",
  "verde musgo": "#064E3B",
};

export default function ProdutoCard({ produto, isAdmin = false }: ProdutoCardProps) {

  const imagemPadrao = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
  const imagemCapaOriginal = produto.imagemUrl || imagemPadrao;

  const [corFixada, setCorFixada] = useState<string | null>(null);
  const [corHover, setCorHover] = useState<string | null>(null);

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(preco);
  };

  const nomeCategoria = typeof produto.categoria === 'object' && produto.categoria?.nome
    ? produto.categoria.nome
    : String(produto.categoria).replace("_", " ");

  const isAtivo = produto.ativo !== false;

  const variacoes = produto.variacoes || [];
  const tamanhosUnicos = Array.from(new Set(variacoes.map(v => v.tamanho)));

  const coresUnicas = variacoes.reduce((acc, varAtual) => {
    const jaExiste = acc.find(c => c.nome === varAtual.cor);
    if (!jaExiste) {
      acc.push({
        nome: varAtual.cor,
        imagem: varAtual.imagemUrl || imagemCapaOriginal
      });
    }
    return acc;
  }, [] as { nome: string; imagem: string }[]);

  const getCorHex = (nomeCor: string) => {
    const corNormalizada = nomeCor.toLowerCase().trim();
    return mapaDeCores[corNormalizada] || "linear-gradient(45deg, #C2AE82, #171717)";
  };

  // ==========================================
  // LÓGICA DE EXIBIÇÃO DA IMAGEM
  // ==========================================
  let imagemExibicao = imagemCapaOriginal;
  if (corHover) {
    const corAchada = coresUnicas.find(c => c.nome === corHover);
    if (corAchada) imagemExibicao = corAchada.imagem;
  } else if (corFixada) {
    const corAchada = coresUnicas.find(c => c.nome === corFixada);
    if (corAchada) imagemExibicao = corAchada.imagem;
  }

  return (
    <div className={`group relative bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#C2AE82]/50 transition-all duration-300 ${!isAtivo ? 'opacity-70 grayscale-[30%]' : ''}`}>

      <div className="relative aspect-[4/5] bg-black overflow-hidden">
        <img
          src={imagemExibicao}
          alt={produto.nome}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-300"></div>

        {produto.ativo !== undefined && (
          <div className="absolute top-3 right-3 z-10">
            {isAtivo ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/90 text-white shadow-lg backdrop-blur-sm uppercase tracking-wider">
                Ativo
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-600/90 text-white shadow-lg backdrop-blur-sm uppercase tracking-wider">
                Inativo
              </span>
            )}
          </div>
        )}

        {tamanhosUnicos.length > 0 && (
          <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-1">
            {tamanhosUnicos.map(tamanho => (
              <span key={tamanho} className="w-6 h-6 rounded bg-neutral-900/80 backdrop-blur-md text-gray-200 border border-neutral-600 flex items-center justify-center text-[10px] font-extrabold shadow-md">
                {tamanho}
              </span>
            ))}
          </div>
        )}

        {coresUnicas.length > 0 && (
          <div className="absolute bottom-3 right-3 z-20 flex flex-wrap gap-1.5 justify-end">
            {coresUnicas.map(cor => {
              const hexStyle = getCorHex(cor.nome);
              const isSelecionada = corFixada === cor.nome;

              return (
                <button
                  key={cor.nome}
                  type="button"
                  title={cor.nome}
                  onMouseEnter={() => setCorHover(cor.nome)}
                  onMouseLeave={() => setCorHover(null)}
                  onClick={(e) => {
                    e.preventDefault();

                    // MÁGICA AQUI: Se for desativar, limpa a Fixada E limpa o Hover instantaneamente!
                    if (corFixada === cor.nome) {
                      setCorFixada(null);
                      setCorHover(null);
                    } else {
                      setCorFixada(cor.nome);
                    }
                  }}
                  className={`w-5 h-5 rounded-full border-2 shadow-lg transition-all focus:outline-none focus:border-[#C2AE82]
                    ${isSelecionada ? 'border-[#C2AE82] scale-125' : 'border-neutral-400 hover:border-white hover:scale-125'}`}
                  style={{
                    background: hexStyle.includes('gradient') ? hexStyle : hexStyle,
                    backgroundColor: !hexStyle.includes('gradient') ? hexStyle : undefined
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-[#C2AE82] tracking-wider uppercase bg-neutral-950 px-2.5 py-1 rounded-md border border-neutral-800">
            {nomeCategoria}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-100 mb-1 leading-tight line-clamp-2 group-hover:text-[#C2AE82] transition-colors">
          {produto.nome}
        </h3>

        <div className="mt-4 flex items-center justify-between relative z-20">
          <p className="text-xl font-extrabold text-white">
            {formatarPreco(produto.preco)}
          </p>

          {!isAdmin && (
            <button
              className="h-10 w-10 bg-[#C2AE82] hover:bg-[#a8956b] text-black rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
              title="Adicionar ao Carrinho"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {!isAdmin && (
         <div className="absolute inset-0 z-0">
           <span className="sr-only">Ver detalhes de {produto.nome}</span>
         </div>
      )}
    </div>
  );
}