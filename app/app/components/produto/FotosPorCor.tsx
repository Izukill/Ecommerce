'use client';

import { useState, ChangeEvent } from "react";
import { api } from "@/lib/api";
import { Camera, Check, Image as ImageIcon } from "lucide-react";
import { Variacao } from "./GerenciadorVariacoes";

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


interface FotosPorCorProps {
  variacoes: Variacao[];
  setVariacoes: (variacoes: Variacao[]) => void;
}

export default function FotosPorCor({ variacoes, setVariacoes }: FotosPorCorProps) {
  const [corSelecionadaParaFoto, setCorSelecionadaParaFoto] = useState<string | null>(null);
  const [fazendoUploadFoto, setFazendoUploadFoto] = useState(false);
  const [erroFoto, setErroFoto] = useState("");

  const coresUnicas = Array.from(new Set(variacoes.map(v => v.cor)));

  const getCorHex = (nomeCor: string) => {
    const corNormalizada = nomeCor.toLowerCase().trim();
    return mapaDeCores[corNormalizada] || "linear-gradient(45deg, #C2AE82, #171717)";
  };

  const handleUploadFotoPorCor = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!corSelecionadaParaFoto) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setFazendoUploadFoto(true);
    setErroFoto("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/upload/imagem", formData);
      const urlGerada = response.data;

      const novasVars = variacoes.map(v =>
        v.cor === corSelecionadaParaFoto ? { ...v, imagemUrl: urlGerada } : v
      );
      setVariacoes(novasVars);
    } catch (error) {
      setErroFoto("Erro ao enviar imagem.");
    } finally {
      setFazendoUploadFoto(false);
    }
  };

  const removerFotoDaCor = (cor: string) => {
    const novasVars = variacoes.map(v =>
      v.cor === cor ? { ...v, imagemUrl: undefined } : v
    );
    setVariacoes(novasVars);
  };

  return (
    <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800 flex flex-col">
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 mb-4">
        <ImageIcon size={18} className="text-[#C2AE82]" />
        <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Fotos por Cor</h3>
      </div>

      {erroFoto && <p className="text-xs text-red-400 mb-4">{erroFoto}</p>}

      {coresUnicas.length === 0 ? (
        <p className="text-gray-600 text-xs text-center py-10">Adicione uma variação primeiro para anexar fotos.</p>
      ) : (
        <>
          {/* Bolinhas de Cores Detectadas */}
          <div className="flex flex-wrap gap-3">
            {coresUnicas.map(cor => {
              const temFoto = variacoes.find(v => v.cor === cor)?.imagemUrl;
              const hexStyle = getCorHex(cor);
              const selecionada = corSelecionadaParaFoto === cor;

              return (
                <button
                  key={cor} type="button" onClick={() => setCorSelecionadaParaFoto(cor)}
                  className={`relative w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center focus:outline-none
                    ${selecionada ? 'border-[#C2AE82] scale-110 shadow-[0_0_15px_rgba(194,174,130,0.3)]' : 'border-neutral-700 hover:border-neutral-500'}`}
                  style={{ background: hexStyle.includes('gradient') ? hexStyle : hexStyle, backgroundColor: !hexStyle.includes('gradient') ? hexStyle : undefined }}
                  title={cor}
                >
                  {temFoto && <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black flex items-center justify-center"><Check size={10} className="text-white" /></div>}
                </button>
              );
            })}
          </div>

          {/* Area de Upload para a Cor Selecionada */}
          {corSelecionadaParaFoto ? (
            <div className="mt-4 pt-4 border-t border-neutral-800 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-xs font-bold text-gray-400 uppercase">Foto da cor: <span className="text-[#C2AE82]">{corSelecionadaParaFoto}</span></p>

              <div className="relative aspect-[4/5] bg-black rounded-xl border-2 border-dashed border-neutral-700 overflow-hidden hover:border-[#C2AE82] transition-colors group">
                {variacoes.find(v => v.cor === corSelecionadaParaFoto)?.imagemUrl ? (
                  <>
                    {/* 👇 object-contain com w-full h-full e p-2 para não encostar na borda */}
                    <img
                      src={variacoes.find(v => v.cor === corSelecionadaParaFoto)?.imagemUrl}
                      className="w-full h-full object-contain p-2"
                      alt="Cor selecionada"
                    />
                    <button
                      type="button" onClick={() => removerFotoDaCor(corSelecionadaParaFoto)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-500 font-bold text-sm"
                    >
                      REMOVER FOTO
                    </button>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    {fazendoUploadFoto ? (
                      <div className="w-8 h-8 border-4 border-[#C2AE82] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Camera size={32} strokeWidth={1.5} className="text-neutral-700 mb-2" />
                        <p className="text-[10px] text-gray-500 uppercase">Clique para enviar a foto da cor {corSelecionadaParaFoto}</p>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleUploadFotoPorCor} disabled={fazendoUploadFoto} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-[10px] text-gray-600 italic text-center py-10">Selecione uma cor acima para gerenciar a foto.</p>
          )}
        </>
      )}
    </div>
  );
}