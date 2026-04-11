'use client';

import { Tag, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";

interface CategoriaSimplificada {
  lookupId: string;
  nome: string;
  percentualDesconto?: number;
}

interface ModalPromocaoCategoriaProps {
  isOpen: boolean;
  categoria: CategoriaSimplificada | null;
  onClose: () => void;
  onAplicar: (desconto: number) => Promise<void>;
  onRemover: () => Promise<void>;
  salvandoPromocao: boolean;
}

export default function ModalPromocaoCategoria({
  isOpen,
  categoria,
  onClose,
  onAplicar,
  onRemover,
  salvandoPromocao
}: ModalPromocaoCategoriaProps) {

  const [descontoLocal, setDescontoLocal] = useState("");

  //sincroniza o valor do input quando a categoria muda
  useEffect(() => {
    if (categoria) {
      setDescontoLocal(categoria.percentualDesconto ? String(categoria.percentualDesconto) : "");
    }
  }, [categoria, isOpen]);

  if (!isOpen || !categoria) return null;

  const handleAplicar = () => {
    const valor = parseFloat(descontoLocal);
    onAplicar(valor);
  };

  //bloqueio de botão até mudar o valor
  const descontoOriginal = categoria.percentualDesconto ? String(categoria.percentualDesconto) : "";
  const isValorInalterado = descontoLocal === descontoOriginal;
  const isDescontoVazio = descontoLocal.trim() === "";

  const isBotaoDesabilitado = salvandoPromocao || isValorInalterado || isDescontoVazio;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="bg-neutral-900 border-t-4 border-red-600 rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">

        <div className="flex justify-between items-center p-5 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Tag className="text-red-500" />
            Ofertas: {categoria.nome}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-400">
            O desconto será aplicado instantaneamente em <span className="text-white font-bold">todos os produtos</span> desta categoria.
          </p>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">% de Desconto</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
              <input
                type="number"
                placeholder="Ex: 15"
                value={descontoLocal}
                onChange={(e) => setDescontoLocal(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-black border border-neutral-700 rounded-lg text-white text-lg font-bold focus:ring-2 focus:ring-red-500 outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleAplicar}
              disabled={isBotaoDesabilitado}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-lg shadow-lg shadow-red-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {salvandoPromocao ? "Processando..." : "Aplicar Desconto em Massa"}
            </button>

            {categoria.percentualDesconto && categoria.percentualDesconto > 0 && (
              <button
                onClick={onRemover}
                disabled={salvandoPromocao}
                className="w-full py-3 flex justify-center items-center gap-2 bg-transparent hover:bg-neutral-800 text-gray-300 font-bold rounded-lg border border-neutral-700 transition-colors disabled:opacity-50 text-sm"
              >
                <Trash2 size={18} className="text-gray-500"/> Remover promoções desta categoria
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}