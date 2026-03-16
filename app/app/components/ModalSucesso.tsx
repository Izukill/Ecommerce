'use client';

import Link from "next/link";

export default function ModalSucesso({ pedidoId }: { pedidoId: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="bg-neutral-900 border border-green-500/30 rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(34,197,94,0.2)] animate-in zoom-in-95 duration-300">

        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl font-extrabold text-white mb-2">Pedido Confirmado!</h2>
        <p className="text-gray-400 text-sm mb-8">
          Seu pedido <span className="text-[#C2AE82] font-bold">#{pedidoId.substring(0, 8)}...</span> foi realizado com sucesso. Obrigado por comprar conosco!
        </p>

        <Link href="/" className="block w-full py-3 bg-green-500 hover:bg-green-400 text-black font-extrabold rounded-xl transition-all shadow-[0_5px_20px_rgba(34,197,94,0.3)]">
          Voltar para a Loja
        </Link>
      </div>
    </div>
  );
}