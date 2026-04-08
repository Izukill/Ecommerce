'use client';

import { useCart } from "@/app/contexts/CartContext";

export default function ResumoPedido({ processando }: { processando: boolean }) {
  const { carrinho, valorTotal, atualizarQuantidade, removerDoCarrinho } = useCart();

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl sticky top-28">
      <h3 className="text-xl font-extrabold text-white mb-6 border-b border-neutral-800 pb-4">Resumo do Pedido</h3>

      <div className="space-y-6 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
        {carrinho.map((item: any, index: number) => (
          <div key={`${item.variacaoId}-${index}`} className="flex gap-4">

            {/* Imagem do Produto */}
            <div className="w-20 h-20 bg-black rounded-lg border border-neutral-800 overflow-hidden flex-shrink-0">
              <img src={item.imagemUrl} alt={item.nome} className="w-full h-full object-cover" />
            </div>

            {/* Informações e Controles */}
            <div className="flex-grow flex flex-col justify-center">
              <div>
                <h4 className="text-sm font-bold text-white line-clamp-1">{item.nome}</h4>
                <p className="text-xs text-gray-400 mt-0.5">{item.cor} - {item.tamanho}</p>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-x-2 gap-y-3 mt-3 w-full">

                <div className="flex items-center gap-3">
                  {/* Controle numérico */}
                  <div className="flex items-center border border-neutral-700 rounded-lg bg-black overflow-hidden h-8">
                    <button
                      type="button"
                      onClick={() => atualizarQuantidade(item.variacaoId, Number(item.quantidade) - 1)}
                      className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-white w-6 text-center">{item.quantidade}</span>
                    <button
                      type="button"
                      onClick={() => atualizarQuantidade(item.variacaoId, Number(item.quantidade) + 1)}
                      className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    title="Remover produto"
                    onClick={() => removerDoCarrinho(item.variacaoId)}
                    className="flex items-center gap-1.5 text-red-500/70 hover:text-red-400 hover:bg-red-500/10 px-2 py-1.5 rounded-md text-xs font-bold transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <span className="text-sm sm:text-base font-extrabold text-[#C2AE82] whitespace-nowrap ml-auto">
                  R$ {(item.preco * Number(item.quantidade)).toFixed(2).replace('.', ',')}
                </span>
              </div>

            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-neutral-800 mt-6 pt-6 space-y-3">
        <div className="flex justify-between text-gray-400 text-sm">
          <span>Subtotal</span>
          <span>R$ {valorTotal.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="flex justify-between text-gray-400 text-sm">
          <span>Frete</span>
          <span className="text-green-500 font-bold">Grátis</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-neutral-800">
          <span className="text-lg font-bold text-white">Total</span>
          <span className="text-2xl font-extrabold text-[#C2AE82]">R$ {valorTotal.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      <button
        type="submit"
        form="checkout-form"
        disabled={processando || carrinho.length === 0}
        className="w-full mt-8 h-14 bg-[#C2AE82] hover:bg-[#a8956b] text-black font-extrabold text-lg rounded-xl shadow-[0_10px_30px_rgba(194,174,130,0.2)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processando ? (
          <>
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            Processando...
          </>
        ) : (
          "Confirmar Pedido"
        )}
      </button>
    </div>
  );
}