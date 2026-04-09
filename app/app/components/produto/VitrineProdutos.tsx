'use client';

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProdutoCard, { Produto } from "./ProdutoCard";

interface VitrineCategoria {
  id: string;
  nome: string;
  ordem: number;
  produtos: Produto[];
}

interface VitrineProdutosProps {
  vitrine: VitrineCategoria;
  onProdutoClick: (id: string) => void;
}

export default function VitrineProdutos({ vitrine, onProdutoClick }: VitrineProdutosProps) {
  const carrosselRef = useRef<HTMLDivElement>(null);


  //lógica pro scroll dos produtos melhor na vitrine
  const rolar = (direcao: 'esquerda' | 'direita') => {
    if (carrosselRef.current) {
      const { clientWidth, scrollLeft, scrollWidth } = carrosselRef.current;
      const scrollAmount = clientWidth / 1.5;

      if (direcao === 'esquerda') {
        if (scrollLeft <= 10) {
          carrosselRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        } else {
          carrosselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
      } else {
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carrosselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carrosselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={() => rolar('esquerda')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-30 w-12 h-12 bg-black/80 border border-neutral-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:bg-[#C2AE82] hover:text-black hover:border-[#C2AE82] focus:outline-none hidden md:flex"
        aria-label="Rolar para a esquerda"
      >
        <ChevronLeft size={28} strokeWidth={2.5} />
      </button>

      {/* div de rolagem */}
      <div
        ref={carrosselRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 px-2 items-stretch [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden scroll-smooth"
      >
        {vitrine.produtos.map((produto) => (
          <div
            key={produto.lookupId}
            className="w-[85vw] sm:w-[280px] lg:w-[300px] h-full snap-start shrink-0 cursor-pointer transition-transform hover:-translate-y-2 duration-300"
            onClick={() => onProdutoClick(produto.lookupId)}
          >
            <div className="w-full h-full [&>div]:h-full">
              <ProdutoCard produto={produto} />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => rolar('direita')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-30 w-12 h-12 bg-black/80 border border-neutral-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:bg-[#C2AE82] hover:text-black hover:border-[#C2AE82] focus:outline-none hidden md:flex"
        aria-label="Rolar para a direita"
      >
        <ChevronRight size={28} strokeWidth={2.5} />
      </button>

      {/* Sombreamento lateral para indicar que tem mais conteúdo */}
      <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-neutral-950 to-transparent pointer-events-none z-10"></div>
    </div>
  );
}