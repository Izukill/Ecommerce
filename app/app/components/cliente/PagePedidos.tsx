'use client';

import {useState} from 'react';

export default function AbaPedidos() {
  const [pedidos, setPedidos] = useState([
    { id: '12345', data: '26/03/2026', total: 149.90, status: 'PAGO' }
  ]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const totalPaginas = 1;

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-neutral-800 pb-4">Histórico de Pedidos</h2>
      <div className="space-y-4">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition">
            <div>
              <p className="text-gray-400 text-sm">Pedido <span className="text-white font-bold">#{pedido.id}</span></p>
            </div>
            <div className="flex items-center gap-6 mt-4 sm:mt-0">
              <span className="font-bold text-[#C2AE82]">{formatarMoeda(pedido.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}