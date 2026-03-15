'use client';

import { useState, useEffect } from "react";

export interface Variacao {
  lookupId: string;
  cor: string;
  tamanho: string;
  quantidadeEstoque: number;
  imagemUrl?: string;
}

interface SeletorVariacoesProps {
  variacoes: Variacao[];
  onVariacaoSelecionada: (variacao: Variacao | null) => void;
}

export default function SeletorVariacoes({ variacoes, onVariacaoSelecionada }: SeletorVariacoesProps) {
  const [corSelecionada, setCorSelecionada] = useState<string | null>(null);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string | null>(null);

  // Extrai as cores únicas para montar os botões de cor
  const coresDisponiveis = Array.from(new Set(variacoes.map(v => v.cor)));

  // Filtra as variações baseado na cor que a usuária clicou
  const variacoesDaCor = variacoes.filter(v => v.cor === corSelecionada);

  // Quando a usuária troca a cor, resetamos o tamanho
  const handleSelecionarCor = (cor: string) => {
    if (corSelecionada === cor) return;
    setCorSelecionada(cor);
    setTamanhoSelecionado(null);
    onVariacaoSelecionada(null); // Reseta a seleção final pro componente pai
  };

  // Quando a usuária clica no tamanho, achamos a variação exata no array e mandamos pro Pai
  const handleSelecionarTamanho = (tamanho: string) => {
    setTamanhoSelecionado(tamanho);
    const varExata = variacoesDaCor.find(v => v.tamanho === tamanho);
    onVariacaoSelecionada(varExata || null);
  };

  return (
    <div className="space-y-6">
      {/* SELETOR DE COR */}
      <div>
        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-3">
          1. Escolha a Cor {corSelecionada && <span className="text-[#C2AE82] ml-2">{corSelecionada}</span>}
        </h3>
        <div className="flex flex-wrap gap-3">
          {coresDisponiveis.map(cor => (
            <button
              key={cor}
              onClick={() => handleSelecionarCor(cor)}
              className={`px-4 py-2 rounded-lg font-bold text-sm border-2 transition-all ${
                corSelecionada === cor
                  ? "border-[#C2AE82] bg-[#C2AE82]/10 text-[#C2AE82]"
                  : "border-neutral-700 bg-black text-gray-400 hover:border-neutral-500"
              }`}
            >
              {cor}
            </button>
          ))}
        </div>
      </div>

      {/* SELETOR DE TAMANHO (Só aparece depois que escolhe a cor) */}
      {corSelecionada && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-3">
            2. Escolha o Tamanho
          </h3>
          <div className="flex flex-wrap gap-3">
            {variacoesDaCor.map(variacao => {
              const semEstoque = variacao.quantidadeEstoque <= 0;
              const selecionado = tamanhoSelecionado === variacao.tamanho;

              return (
                <button
                  key={variacao.lookupId}
                  disabled={semEstoque}
                  onClick={() => handleSelecionarTamanho(variacao.tamanho)}
                  className={`w-14 h-14 rounded-lg font-extrabold text-lg flex items-center justify-center border-2 transition-all
                    ${semEstoque
                      ? "border-neutral-800 bg-neutral-900 text-neutral-700 cursor-not-allowed line-through"
                      : selecionado
                        ? "border-[#C2AE82] bg-[#C2AE82] text-black shadow-[0_0_15px_rgba(194,174,130,0.3)]"
                        : "border-neutral-700 bg-black text-gray-300 hover:border-[#C2AE82]/50 hover:text-white"
                    }
                  `}
                >
                  {variacao.tamanho}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}