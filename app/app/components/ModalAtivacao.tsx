'use client';

import { ReactNode } from "react";

interface ModalAtivacaoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo: string;
  mensagem: ReactNode;
}

export default function ModalAtivacao({
  isOpen,
  onClose,
  onConfirm,
  titulo,
  mensagem,
}: ModalAtivacaoProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="bg-neutral-900 border-t-4 border-green-500 rounded-xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-extrabold text-white mb-2">{titulo}</h3>

        <div className="text-gray-400 text-sm mb-6">
          {mensagem}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-gray-300 bg-neutral-800 rounded-lg hover:bg-neutral-700 hover:text-white transition-colors border border-neutral-700"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-lg"
          >
            Sim, Ativar
          </button>
        </div>
      </div>
    </div>
  );
}