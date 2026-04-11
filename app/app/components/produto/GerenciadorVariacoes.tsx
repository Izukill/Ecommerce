'use client';

import { useState } from "react";
import { Plus, Trash2, Edit2, Check } from "lucide-react";

export interface Variacao {
  tamanho: string;
  cor: string;
  quantidadeEstoque: number;
  imagemUrl?: string;
}

interface GerenciadorVariacoesProps {
  variacoes: Variacao[];
  setVariacoes: (variacoes: Variacao[]) => void;
}

const ORDEM_TAMANHOS: Record<string, number> = {
  "P": 1, "M": 2, "G": 3, "GG": 4
};

export default function GerenciadorVariacoes({ variacoes, setVariacoes }: GerenciadorVariacoesProps) {
  const [corAtual, setCorAtual] = useState("");
  const [tamanhoAtual, setTamanhoAtual] = useState("P");
  const [estoqueAtual, setEstoqueAtual] = useState("");
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [erroVariacao, setErroVariacao] = useState("");

  const formatarCor = (cor: string) => {
    if (!cor) return "";
    return cor.trim().charAt(0).toUpperCase() + cor.trim().slice(1).toLowerCase();
  };

  const handleAdicionarOuAtualizarVariacao = () => {
    setErroVariacao("");
    if (!corAtual.trim() || !estoqueAtual) {
      setErroVariacao("Preencha cor e estoque.");
      return;
    }

    const corFormatada = formatarCor(corAtual);
    const jaExiste = variacoes.some((v, idx) => v.cor === corFormatada && v.tamanho === tamanhoAtual && idx !== editandoIndex);

    if (jaExiste) {
      setErroVariacao(`A variação ${corFormatada} - ${tamanhoAtual} já existe.`);
      return;
    }

    const imagemExistenteParaCor = variacoes.find(v => v.cor === corFormatada)?.imagemUrl;

    const novaVar: Variacao = {
      tamanho: tamanhoAtual,
      cor: corFormatada,
      quantidadeEstoque: parseInt(estoqueAtual, 10),
      imagemUrl: imagemExistenteParaCor
    };

    let novasVars = [...variacoes];
    if (editandoIndex !== null) novasVars[editandoIndex] = novaVar;
    else novasVars.push(novaVar);

    //ordena a lista antes de salvar
    novasVars.sort((a, b) => {
      if (a.cor < b.cor) return -1;
      if (a.cor > b.cor) return 1;

      const pesoA = ORDEM_TAMANHOS[a.tamanho];
      const pesoB = ORDEM_TAMANHOS[b.tamanho];
      return pesoA - pesoB;
    });

    setVariacoes(novasVars);
    setCorAtual(""); setEstoqueAtual(""); setEditandoIndex(null);
  };

  return (
    <div className="space-y-4 bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
      <div className="flex justify-between items-center border-b border-neutral-800 pb-2 mb-4">
        <h3 className="text-lg font-bold text-white ">Variações (Tamanho e Estoque)</h3>
        <span className="text-xs bg-[#C2AE82]/20 text-[#C2AE82] px-2 py-1 rounded font-bold">
          Adicionados: {variacoes.length}
        </span>
      </div>

      {erroVariacao && <p className="text-xs text-red-400 mb-2 font-bold">{erroVariacao}</p>}

      <div className="grid grid-cols-12 gap-2 items-end">
        <div className="col-span-5">
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Cor</label>
          <input
            type="text" value={corAtual} onChange={(e) => setCorAtual(e.target.value)}
            placeholder="Ex: Azul" className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-[#C2AE82] outline-none"
          />
        </div>
        <div className="col-span-3">
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tam</label>
          <select
            value={tamanhoAtual} onChange={(e) => setTamanhoAtual(e.target.value)}
            className="w-full px-2 py-2 bg-black border border-neutral-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-[#C2AE82] outline-none font-bold appearance-none"
          >
            {["P", "M", "G", "GG"].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Qtd</label>
          <input
            type="number"
            value={estoqueAtual}
            onChange={(e) => setEstoqueAtual(e.target.value)}
            onFocus={(e) => e.target.select()}
            placeholder="0"
            className="w-full px-2 py-2 bg-black border border-neutral-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-[#C2AE82] outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <div className="col-span-2">
          <button
            type="button" onClick={handleAdicionarOuAtualizarVariacao}
            className="w-full h-[38px] flex items-center justify-center bg-[#C2AE82] text-black rounded-lg hover:bg-[#a8956b] transition-all shadow-md"
          >
            {editandoIndex !== null ? <Check size={20} /> : <Plus size={20} />}
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {variacoes.length === 0 ? (
          <div className="p-10 border border-dashed border-neutral-800 rounded-lg text-center text-gray-600 text-xs">
            Nenhuma variação adicionada.
          </div>
        ) : (
          variacoes.map((v, idx) => (
            <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${editandoIndex === idx ? 'bg-[#C2AE82]/10 border-[#C2AE82]' : 'bg-black border-neutral-800'}`}>
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded bg-neutral-900 border border-neutral-700 flex items-center justify-center font-black text-xs text-[#C2AE82]">{v.tamanho}</span>
                <div>
                  <p className="text-sm font-bold text-white">{v.cor}</p>
                  <p className="text-[12px] text-gray-500 font-bold">Estoque: {v.quantidadeEstoque}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => { setEditandoIndex(idx); setCorAtual(v.cor); setTamanhoAtual(v.tamanho); setEstoqueAtual(v.quantidadeEstoque.toString()); }} className="p-2 text-gray-400 hover:text-white hover:bg-neutral-800 rounded-lg"><Edit2 size={16} /></button>
                <button type="button" onClick={() => setVariacoes(variacoes.filter((_, i) => i !== idx))} className="p-2 text-red-900 hover:text-red-500 hover:bg-red-950/20 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}