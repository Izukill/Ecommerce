'use client';

import { useState, ChangeEvent } from "react";
import { api } from "@/lib/api";

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

export default function GerenciadorVariacoes({ variacoes, setVariacoes }: GerenciadorVariacoesProps) {
  const [corAtual, setCorAtual] = useState("");
  const [tamanhoAtual, setTamanhoAtual] = useState("P");
  const [estoqueAtual, setEstoqueAtual] = useState("");
  const [imagemVariacaoAtual, setImagemVariacaoAtual] = useState("");
  const [fazendoUploadVariacao, setFazendoUploadVariacao] = useState(false);

  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [erroVariacao, setErroVariacao] = useState("");

  const handleUploadImagemVariacao = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFazendoUploadVariacao(true);
    setErroVariacao("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/upload/imagem", formData);
      setImagemVariacaoAtual(response.data);
    } catch (error) {
      setErroVariacao("Falha ao enviar a foto desta cor.");
    } finally {
      setFazendoUploadVariacao(false);
    }
  };

  const formatarCor = (cor: string) => {
    if (!cor) return "";
    const corLimpa = cor.trim();
    return corLimpa.charAt(0).toUpperCase() + corLimpa.slice(1).toLowerCase();
  };

  // Função auxiliar para limpar tudo de uma vez
  const limparCamposVariacao = () => {
    setCorAtual("");
    setEstoqueAtual("");
    setImagemVariacaoAtual("");
    if (editandoIndex !== null) setEditandoIndex(null);
  };

  const handleAdicionarOuAtualizarVariacao = () => {
    setErroVariacao("");

    // Validação 1: Campos Vazios
    if (!corAtual.trim() || !estoqueAtual) {
      setErroVariacao("Preencha a cor e o estoque.");
      limparCamposVariacao(); // Limpa ao dar erro
      return;
    }

    const corFormatada = formatarCor(corAtual);

    // Validação 2: Variação exata já existe
    const jaExiste = variacoes.some((v, index) =>
      v.cor === corFormatada && v.tamanho === tamanhoAtual && index !== editandoIndex
    );

    if (jaExiste) {
      setErroVariacao(`Atenção: A variação "${corFormatada} - ${tamanhoAtual}" já está na lista.`);
      limparCamposVariacao(); // Limpa ao dar erro
      return;
    }

    // Validação 3: Cor já possui uma imagem diferente
    if (imagemVariacaoAtual) {
      const corJaTemOutraImagem = variacoes.some((v, index) =>
        v.cor === corFormatada && v.imagemUrl !== undefined && v.imagemUrl !== imagemVariacaoAtual && index !== editandoIndex
      );

      if (corJaTemOutraImagem) {
        setErroVariacao("Erro, a cor já possui uma imagem relacionada.");
        limparCamposVariacao(); // Limpa ao dar erro
        return;
      }
    }

    const novaVariacao: Variacao = {
      tamanho: tamanhoAtual,
      cor: corFormatada,
      quantidadeEstoque: parseInt(estoqueAtual, 10),
      imagemUrl: imagemVariacaoAtual || undefined
    };

    if (editandoIndex !== null) {
      const novasVariacoes = [...variacoes];
      novasVariacoes[editandoIndex] = novaVariacao;
      setVariacoes(novasVariacoes);
    } else {
      setVariacoes([...variacoes, novaVariacao]);
    }

    // Limpa após o sucesso
    limparCamposVariacao();
  };

  const handleEditarVariacao = (index: number) => {
    const varEdicao = variacoes[index];
    setCorAtual(varEdicao.cor);
    setTamanhoAtual(varEdicao.tamanho);
    setEstoqueAtual(varEdicao.quantidadeEstoque.toString());
    setImagemVariacaoAtual(varEdicao.imagemUrl || "");
    setEditandoIndex(index);
    setErroVariacao("");
  };

  const handleRemoverVariacao = (indexParaRemover: number) => {
    setVariacoes(variacoes.filter((_, index) => index !== indexParaRemover));
    if (editandoIndex === indexParaRemover) {
      limparCamposVariacao();
    }
  };

  return (
    <div className="space-y-4 bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
      <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
        <h3 className="text-lg font-bold text-white">Variações e Estoque *</h3>
        <span className="text-xs bg-[#C2AE82]/20 text-[#C2AE82] px-2 py-1 rounded font-bold">
          Adicionados: {variacoes.length}
        </span>
      </div>

      {erroVariacao && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm font-bold p-3 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {erroVariacao}
        </div>
      )}

      <div className="grid grid-cols-12 gap-2 items-end">
        <div className="col-span-2 flex flex-col items-center">
          <label className="block text-[10px] font-bold text-gray-400 mb-1">Foto (Cor)</label>
          <div className="relative w-10 h-10 bg-black border border-neutral-600 rounded-md flex items-center justify-center overflow-hidden cursor-pointer group">
            {fazendoUploadVariacao ? (
              <div className="w-4 h-4 border-2 border-[#C2AE82] border-t-transparent rounded-full animate-spin"></div>
            ) : imagemVariacaoAtual ? (
              <>
                <img src={imagemVariacaoAtual} alt="Cor" className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                  onClick={(e) => { e.preventDefault(); setImagemVariacaoAtual(""); }}
                >
                  <span className="text-red-400 font-bold text-xs">X</span>
                </div>
              </>
            ) : (
              <span className="text-xs">📷</span>
            )}
            {!imagemVariacaoAtual && (
              <input type="file" accept="image/*" onChange={handleUploadImagemVariacao} className="absolute inset-0 opacity-0 cursor-pointer" disabled={fazendoUploadVariacao} />
            )}
          </div>
        </div>

        <div className="col-span-4">
          <label className="block text-xs font-bold text-gray-400 mb-1">Cor</label>
          <input
            type="text" placeholder="Ex: Azul"
            className="w-full px-2 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-gray-100 focus:ring-1 focus:ring-[#C2AE82] outline-none"
            value={corAtual} onChange={(e) => setCorAtual(e.target.value)}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-bold text-gray-400 mb-1">Tamanho</label>
          <select
            className="w-full px-1 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-gray-100 focus:ring-1 focus:ring-[#C2AE82] outline-none appearance-none font-bold text-center"
            value={tamanhoAtual} onChange={(e) => setTamanhoAtual(e.target.value)}
          >
            <option value="P">P</option><option value="M">M</option><option value="G">G</option><option value="GG">GG</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-bold text-gray-400 mb-1">Estoque</label>
          <input
            type="number" min="0" placeholder="Qtd"
            className="w-full px-2 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-gray-100 focus:ring-1 focus:ring-[#C2AE82] outline-none"
            value={estoqueAtual} onChange={(e) => setEstoqueAtual(e.target.value)}
          />
        </div>

        <div className="col-span-2">
          <button
            type="button" onClick={handleAdicionarOuAtualizarVariacao}
            className={`w-full py-2 font-bold rounded-lg transition-colors text-xs border shadow-md h-[38px] ${editandoIndex !== null ? "bg-blue-900/50 text-blue-300 border-blue-700/50" : "bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700"}`}
          >
            {editandoIndex !== null ? "Salvar" : "+ Add"}
          </button>
        </div>
      </div>

      {variacoes.length > 0 ? (
        <div className="mt-4 flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
          {variacoes.map((v, index) => (
            <div key={index} className={`flex items-center justify-between bg-black border p-2 rounded-lg transition-all ${editandoIndex === index ? "border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]" : "border-neutral-800"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-neutral-900 border border-neutral-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {v.imagemUrl ? <img src={v.imagemUrl} alt={v.cor} className="w-full h-full object-cover" /> : <span className="text-[10px] text-gray-600">Sem Foto</span>}
                </div>
                <span className="w-8 h-8 rounded bg-neutral-800 text-[#C2AE82] flex items-center justify-center font-extrabold text-sm border border-neutral-700">{v.tamanho}</span>
                <div>
                  <p className="text-sm font-bold text-gray-200">{v.cor}</p>
                  <p className="text-xs text-gray-500">Estoque: {v.quantidadeEstoque}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => handleEditarVariacao(index)} className="text-blue-500 p-1.5 hover:bg-blue-950/30 rounded-md">Editar</button>
                <button type="button" onClick={() => handleRemoverVariacao(index)} className="text-red-500 p-1.5 hover:bg-red-950/30 rounded-md">Remover</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 p-4 border border-dashed border-neutral-700 rounded-lg text-center"><p className="text-sm text-gray-500">Nenhuma variação adicionada ainda.</p></div>
      )}
    </div>
  );
}