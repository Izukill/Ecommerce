'use client';

import Link from "next/link";

// Interfaces flexíveis para aceitar tanto os mocks da Home quanto os dados do Back-end
export interface CategoriaCard {
  lookupId?: string;
  nome: string;
}

export interface Produto {
  lookupId: string;
  nome: string;
  categoria: CategoriaCard | string;
  preco: number;
  ativo?: boolean; // Opcional, para não quebrar os mocks da Home
  imagemUrl?: string;
}

interface ProdutoCardProps {
  produto: Produto;
  isAdmin?: boolean; // Permite mudar o comportamento se o card estiver no Admin
}

export default function ProdutoCard({ produto, isAdmin = false }: ProdutoCardProps) {

  // Formatador de Preço
  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(preco);
  };

  // Lida com a categoria sendo texto ou Objeto
  const nomeCategoria = typeof produto.categoria === 'object' && produto.categoria?.nome
    ? produto.categoria.nome
    : String(produto.categoria).replace("_", " ");

  // Imagem fictícia elegante
  const imagemPadrao = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
  const imagem = produto.imagemUrl || imagemPadrao;

  // Verifica o status ativo
  const isAtivo = produto.ativo !== false;

  return (
    <div className={`group relative bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#C2AE82]/50 transition-all duration-300 ${!isAtivo ? 'opacity-70 grayscale-[30%]' : ''}`}>

      {/* Container da Imagem */}
      <div className="relative aspect-[4/5] bg-black overflow-hidden">
        <img
          src={imagem}
          alt={produto.nome}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
        />

        {/* Gradiente escuro na base */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Badge de Status (Ativo/Inativo) */}
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
      </div>

      {/* Informações do Produto */}
      <div className="p-5">

        {/* Categoria */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-[#C2AE82] tracking-wider uppercase bg-neutral-950 px-2.5 py-1 rounded-md border border-neutral-800">
            {nomeCategoria}
          </span>
        </div>

        {/* Nome */}
        <h3 className="text-lg font-bold text-gray-100 mb-1 leading-tight line-clamp-2 group-hover:text-[#C2AE82] transition-colors">
          {produto.nome}
        </h3>

        {/* Preço e Botão */}
        <div className="mt-4 flex items-center justify-between relative z-20">
          <p className="text-xl font-extrabold text-white">
            {formatarPreco(produto.preco)}
          </p>

          {/* ========================================== */}
          {/* MÁGICA AQUI: O botão some se for Admin!      */}
          {/* ========================================== */}
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

      {/* Link de navegação que cobre o card (só na Home) */}
      {!isAdmin && (
         <Link href={`/produtos/${produto.lookupId}`} className="absolute inset-0 z-0">
           <span className="sr-only">Ver detalhes de {produto.nome}</span>
         </Link>
      )}
    </div>
  );
}