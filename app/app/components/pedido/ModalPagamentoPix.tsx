'use client';

import { useState } from 'react';

interface PixData {
  idPagamentoMercadoPago: number;
  qrCodeBase64: string;
  qrCodeCopiaECola: string;
}

interface ModalPagamentoPixProps {
  isOpen: boolean;
  pixData: PixData | null;
  valorTotal: number;
  onClose: () => void;
}

export default function ModalPagamentoPix({ isOpen, pixData, valorTotal, onClose }: ModalPagamentoPixProps) {
  const [copiado, setCopiado] = useState(false);

  if (!isOpen || !pixData) return null;

  const copiarCodigo = () => {
    navigator.clipboard.writeText(pixData.qrCodeCopiaECola);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000); // Tira o aviso de copiado após 3s
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md px-4">
      <div className="bg-neutral-900 border border-[#C2AE82] rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center animate-in fade-in zoom-in duration-300">

        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Pagamento via PIX</h2>

        <div className="w-full bg-[#C2AE82]/10 border border-[#C2AE82]/30 rounded-xl py-4 flex flex-col items-center justify-center mt-2 mb-4">
          <span className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Total a pagar</span>
          <span className="text-4xl font-black text-[#C2AE82] tracking-tighter drop-shadow-md">
            {formatarMoeda(valorTotal)}
          </span>
        </div>

        <p className="text-gray-300 text-base text-center mb-6 leading-relaxed">
          Abra o app do seu banco e escaneie o QR Code abaixo para confirmar sua compra.
        </p>

        {/* Imagem do QR Code em Base64 */}
        <div className="bg-white p-3 rounded-xl mb-6 border-4 border-neutral-800 shadow-lg transition-transform hover:scale-105 duration-300">
          <img
            src={`data:image/jpeg;base64,${pixData.qrCodeBase64}`}
            alt="QR Code PIX"
            className="w-48 h-48 object-contain"
          />
        </div>

        {/* Botão Copia e Cola */}
        <div className="w-full space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Ou use o PIX Copia e Cola</p>
          <button
            onClick={copiarCodigo}
            className={`w-full py-4 px-4 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 shadow-md ${
              copiado
                ? "bg-green-600 text-white border border-green-500"
                : "bg-neutral-800 text-[#C2AE82] border border-[#C2AE82]/30 hover:bg-[#C2AE82]/20 hover:border-[#C2AE82]/50"
            }`}
          >
            {copiado ? (
              <>✅ Código Copiado!</>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                </svg>
                Copiar Código PIX
              </>
            )}
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-6 text-gray-500 hover:text-white text-sm underline underline-offset-4 transition-colors"
        >
          Fechar e acompanhar pedido
        </button>

      </div>
    </div>
  );
}