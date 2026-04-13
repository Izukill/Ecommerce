'use client';

import { LogOut } from "lucide-react";

interface ModalLogoutProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ModalLogout({ isOpen, onClose, onConfirm }: ModalLogoutProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      ></div>
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-2">
            <LogOut size={28} strokeWidth={2.5} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Sair da conta?</h3>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              Tem certeza de que deseja encerrar sua sessão? Você precisará fazer login novamente para acompanhar seus pedidos.
            </p>
          </div>

          <div className="flex gap-3 w-full mt-6 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-bold rounded-lg transition-colors border border-neutral-700 hover:border-neutral-600"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-red-900/20"
            >
              Sim, sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}