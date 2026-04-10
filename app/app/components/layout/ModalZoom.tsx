'use client';

import { X } from "lucide-react";

interface ModalZoomImagemProps {
  imagemUrl: string | null;
  onClose: () => void;
}

export default function ModalZoomImagem({ imagemUrl, onClose }: ModalZoomImagemProps) {
  if (!imagemUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md px-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-neutral-900 text-gray-400 hover:text-red-500 hover:bg-red-500/10 border border-neutral-700 hover:border-red-500/30 p-2 rounded-full transition-all shadow-xl z-10"
        >
          <X size={24} strokeWidth={2.5} />
        </button>

        <img
          src={imagemUrl}
          alt="Zoom do produto"
          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 border border-neutral-800"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}