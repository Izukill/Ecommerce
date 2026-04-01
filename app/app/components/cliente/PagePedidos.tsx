'use client';

import { useState, useEffect } from 'react';
import { api } from "@/lib/api";
import ModalDetalhesPedido from "@/app/components/pedido/ModalDetalhesPedido";

export interface Pedido {
  lookupId: number | string;
  valorTotal: number;
  status: string;
  dataHora: string;
  cliente: any;
  enderecoEntrega?: any;
  itens?: any[];
}

export default function AbaPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);

  const [paginaAtual, setPaginaAtual] = useState(0);
  const totalPaginas = 1;

  const formatarMoeda = (valor: number) => {
      return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
  };

  const formatarData = (dataIso: string) => {
      if (!dataIso) return "Data não informada";
      const data = new Date(dataIso);
      return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
      }).format(data);
    };

  const getStatusBadge = (status: string) => {
      switch (status?.toUpperCase()) {
        case 'PAGO': return 'bg-green-500/10 text-green-500 border-green-500/20';
        case 'ENVIADO': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        case 'AGUARDANDO_PAGAMENTO': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        case 'CANCELADO': return 'bg-red-500/10 text-red-500 border-red-500/20';
        default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      }
    };

  const handleAtualizarStatus = async (pedidoId: string, novoStatus: string) => {
      try {
        // Exemplo de requisição: await api.patch(`/pedidos/${pedidoId}/status`, { status: novoStatus });
        toast.success(`Status atualizado para ${novoStatus}!`);
        setPedidoSelecionado(null);
        // Aqui você poderia chamar buscarDados() novamente para atualizar a lista
      } catch (error) {
        toast.error("Erro ao atualizar o status do pedido.");
      }
    };

  useEffect(() => {
      const buscarDados = async () => {
        try {
          const response = await api.get('/pedidos/meus-pedidos');
          const dadosDoBanco = response.data;

          if (dadosDoBanco && dadosDoBanco.content) {
            setPedidos(dadosDoBanco.content);
          } else if (Array.isArray(dadosDoBanco)) {
            setPedidos(dadosDoBanco);
          } else {
            setPedidos([]);
          }

        } catch (error: any) {
          console.error("Erro na API:", error.response?.status, error.response?.data || error.message);
        } finally {
          setCarregando(false);
        }
    };
    buscarDados();
  }, []);


  if (carregando) {
    return <div className="text-[#C2AE82] text-center mt-10 animate-pulse">Buscando seus pedidos...</div>;
  }

  return (
    <div className="animate-in fade-in duration-300 relative">
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-neutral-800 pb-4">Histórico de Pedidos</h2>

      {pedidos.length === 0 ? (
        <p className="text-gray-500 text-center py-10 bg-neutral-900/50 rounded-xl border border-neutral-800">
          Você ainda não realizou nenhum pedido.
        </p>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div key={pedido.lookupId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-[#C2AE82] transition-colors group">
              <div className="flex-1">
                <p className="text-gray-200 text-lg">
                  Pedido
                </p>
                <p className="text-neutral-600 text-xs mt-0.5 font-mono">
                  {pedido.lookupId}
                </p>
              </div>
              <div className="mt-3 sm:mt-0 flex-1 flex sm:justify-center">
                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${getStatusBadge(pedido.status)}`}>
                  {pedido.status || "DESCONHECIDO"}
                </span>
              </div>
              <div className="flex-1 flex items-center justify-start sm:justify-end gap-6 mt-4 sm:mt-0">
                <span className="font-bold text-[#C2AE82] text-lg">
                  {formatarMoeda(pedido.valorTotal)}
                </span>

                <button
                  onClick={() => setPedidoSelecionado(pedido)}
                  className="text-sm font-bold text-gray-400 hover:text-white transition opacity-100 sm:opacity-0 sm:group-hover:opacity-100 border sm:border-transparent border-neutral-700 px-3 py-1.5 rounded-md"
                >
                  Ver Detalhes &rarr;
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* 👇 5. Renderização do Modal fora do fluxo da lista */}
      <ModalDetalhesPedido
        isOpen={!!pedidoSelecionado} // Se tiver pedido, abre. Se for null, fecha.
        pedidoSelecionado={pedidoSelecionado}
        onClose={() => setPedidoSelecionado(null)} // Clicar no X limpa o estado e fecha o modal
        formatarData={formatarData}
        formatarMoeda={formatarMoeda}
        getStatusBadge={getStatusBadge}
        onAtualizarStatus={handleAtualizarStatus}
      />

    </div>
  );
}