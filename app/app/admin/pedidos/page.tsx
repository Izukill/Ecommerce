'use client';

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import ModalDetalhesPedido, { Pedido } from "@/app/components/pedido/ModalDetalhesPedido";
import {
    Package,
    Eye,
    ShoppingBag
} from "lucide-react";
import toast from 'react-hot-toast';

export default function PedidosAdminPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const router = useRouter();
  const { usuario } = useAuth();

  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const tamanhoPagina = 10;

  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [isModalAberto, setIsModalAberto] = useState(false);

  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroData, setFiltroData] = useState("");
  const [filtroPrecoMin, setFiltroPrecoMin] = useState("");

  const carregarPedidos = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const params = new URLSearchParams();
      params.append("page", paginaAtual.toString());
      params.append("size", tamanhoPagina.toString());
      params.append("sort", "dataHora,desc");

      if (filtroCliente) params.append("clienteNome", filtroCliente);
      if (filtroStatus !== "todos") params.append("status", filtroStatus);
      if (filtroPrecoMin) params.append("precoMin", filtroPrecoMin);

      if (filtroData) {
        params.append("dataInicial", `${filtroData}T00:00:00`);
        params.append("dataFinal", `${filtroData}T23:59:59`);
      }

      const response = await api.get(`/pedidos?${params.toString()}`);

      const pageData = response.data;
      const listaExtraida = pageData.content || pageData;
      setPedidos(Array.isArray(listaExtraida) ? listaExtraida : []);

      if (pageData.totalPages !== undefined) {
        setTotalPaginas(pageData.totalPages);
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      setErro("Não foi possível carregar os pedidos. Verifique a conexão.");
    } finally {
      setCarregando(false);
    }
  }, [paginaAtual, filtroCliente, filtroStatus, filtroData, filtroPrecoMin]);

  useEffect(() => {
        if (usuario && !usuario.permissaoTotal && !usuario.pedidosPage) {
          toast.error("Você não tem permissão para acessar esta página.");
          router.push("/admin");
        }
  }, [usuario, router]);

  //useeffect de filtros
  useEffect(() => {
    setPaginaAtual(0);
  }, [filtroCliente, filtroStatus, filtroData, filtroPrecoMin]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      carregarPedidos();
    }, 500); //timeout de 500 pra não buscar no nome mt rápido e n lagar

    return () => clearTimeout(delayDebounceFn);
  }, [carregarPedidos]);


  const abrirDetalhes = (pedido: Pedido) => {
    setPedidoSelecionado(pedido);
    setIsModalAberto(true);
  };

  const fecharModal = () => {
    setIsModalAberto(false);
    setPedidoSelecionado(null);
  };

  const handleAtualizarStatus = async (pedidoId: string, novoStatus: string) => {
      try {
        await api.put(`/pedidos/${pedidoId}/status`, { status: novoStatus });

        fecharModal();
        carregarPedidos();
      } catch (error) {
        console.error("Erro ao atualizar status:", error);
        toast.error("Não foi possível atualizar o status do pedido.");
      } finally{
        toast.success("Pedido Atualizado com sucesso");
      }
    };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor || 0);
  };

  const formatarData = (dataIso: string) => {
    if (!dataIso) return "Data não informada";
    return new Date(dataIso).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  const getStatusBadge = (status: string) => {
    const s = (status || "").toUpperCase();
    switch (s) {
      case "PAGO": return "bg-green-950/30 text-green-400 border-green-900/50";
      case "ENVIADO": return "bg-blue-950/30 text-blue-400 border-blue-900/50";
      case "CANCELADO": return "bg-red-950/30 text-red-400 border-red-900/50";
      case "AGUARDANDO_PAGAMENTO": return "bg-yellow-950/30 text-yellow-400 border-yellow-900/50";
      default: return "bg-neutral-800 text-gray-400 border-neutral-700";
    }
  };

  return (
    <div className="space-y-6 relative pb-10 max-w-7xl mx-auto">

      <div>
        <h2 className="flex items-center gap-3 text-3xl font-extrabold text-white tracking-tight">
          <ShoppingBag className="text-[#C2AE82]" size={32}/>Pedidos
        </h2>
        <p className="text-sm text-gray-400 mt-1">Acompanhe as vendas e gerencie os status de entrega.</p>
      </div>

      {erro && (
        <div className="bg-red-950/50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-sm text-red-200 font-semibold">{erro}</p>
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nome do Cliente</label>
          <input
            type="text" placeholder="Ex: Maria..."
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-sm text-gray-100 focus:ring-1 focus:ring-[#C2AE82] outline-none"
            value={filtroCliente} onChange={(e) => setFiltroCliente(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Status</label>
          <select
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-sm text-gray-100 focus:ring-1 focus:ring-[#C2AE82] outline-none appearance-none"
            value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="PAGO">Pago</option>
            <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
            <option value="ENVIADO">Enviado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Data do Pedido</label>
          <input
            type="date"
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-sm text-gray-100 focus:ring-1 focus:ring-[#C2AE82] outline-none [color-scheme:dark]"
            value={filtroData} onChange={(e) => setFiltroData(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Preço Mínimo (R$)</label>
          <input
            type="text" placeholder="Ex: 100"
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-sm text-gray-100 focus:ring-1 focus:ring-[#C2AE82] outline-none"
            value={filtroPrecoMin} onChange={(e) => setFiltroPrecoMin(e.target.value)}
          />
        </div>
      </div>

      {/* tabela de pedidos e card no mobile */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden">

        {carregando ? (
          <div className="py-20 flex justify-center items-center gap-3 text-[#C2AE82] font-bold tracking-widest uppercase">
            <div className="w-8 h-8 border-4 border-[#C2AE82] border-t-transparent rounded-full animate-spin"></div>
            Buscando pedidos...
          </div>
        ) : pedidos.length === 0 ? (
          <div className="py-20 text-center">
            <div className="flex justify-center mb-4 text-neutral-600">
              <Package size={56} strokeWidth={1.5} />
            </div>
            <p className="text-gray-300 font-bold text-lg mt-4">Nenhum pedido encontrado</p>
            <p className="text-gray-500 text-sm mt-1">Nenhum pedido corresponde aos filtros aplicados.</p>
          </div>
        ) : (
          <>
            {/* mobile */}
            <div className="md:hidden flex flex-col divide-y divide-neutral-800">
              {pedidos.map((pedido) => (
                <div
                  key={pedido.lookupId}
                  onClick={() => abrirDetalhes(pedido)}
                  className="p-5 flex flex-col gap-4 active:bg-neutral-800/80 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${getStatusBadge(pedido.status)}`}>
                        {pedido.status || "Desconhecido"}
                      </span>
                      <p className="text-white font-extrabold text-base mt-2 truncate">
                        {pedido.cliente?.nome || "Cliente Removido"}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[#C2AE82] font-black text-lg">{formatarMoeda(pedido.valorTotal)}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 font-mono">#{pedido.lookupId.split("-")[0]}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="font-medium">{formatarData(pedido.dataHora)}</span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <Eye size={14} /> Ver Detalhes
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-black/50 text-xs uppercase text-gray-500 border-b border-neutral-800">
                  <tr>
                    <th className="px-6 py-4 font-bold">Data / Pedido</th>
                    <th className="px-6 py-4 font-bold">Cliente</th>
                    <th className="px-6 py-4 font-bold">Contato</th>
                    <th className="px-6 py-4 font-bold text-center">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Valor Total</th>
                    <th className="px-6 py-4 font-bold text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {pedidos.map((pedido) => (
                    <tr
                      key={pedido.lookupId}
                      onClick={() => abrirDetalhes(pedido)}
                      className="hover:bg-neutral-800/50 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-200">{formatarData(pedido.dataHora)}</div>
                        <div className="text-[10px] text-gray-500 mt-1 font-mono">#{pedido.lookupId.split("-")[0]}</div>
                      </td>

                      <td className="px-6 py-4 font-bold text-white">
                        {pedido.cliente?.nome || "Cliente Removido"}
                      </td>

                      <td className="px-6 py-4 text-gray-300">
                        {pedido.cliente?.telefone || "Nenhum telefone"}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${getStatusBadge(pedido.status)}`}>
                          {pedido.status || "Desconhecido"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right font-extrabold text-[#C2AE82]">
                        {formatarMoeda(pedido.valorTotal)}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          className="p-2 bg-neutral-800 text-gray-400 rounded-lg hover:text-white hover:bg-neutral-700 transition-colors border border-neutral-700 shadow-sm group-hover:border-[#C2AE82]/50 group-hover:text-[#C2AE82]"
                          title="Ver Detalhes do Pedido"
                        >
                          <Eye size={20} strokeWidth={2} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* controle das paginações */}
      {totalPaginas > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4 bg-neutral-900 p-4 rounded-xl border border-neutral-800 shadow-lg">
          <button
            onClick={() => setPaginaAtual(prev => Math.max(0, prev - 1))}
            disabled={paginaAtual === 0 || carregando}
            className="px-4 py-2 text-sm font-bold bg-black text-[#C2AE82] border border-[#C2AE82]/30 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#C2AE82]/10 transition-colors"
          >
            &larr; Anterior
          </button>
          <span className="text-gray-400 font-bold text-sm">
            Página <span className="text-white">{paginaAtual + 1}</span> de <span className="text-white">{totalPaginas}</span>
          </span>
          <button
            onClick={() => setPaginaAtual(prev => Math.min(totalPaginas - 1, prev + 1))}
            disabled={paginaAtual >= totalPaginas - 1 || carregando}
            className="px-4 py-2 text-sm font-bold bg-black text-[#C2AE82] border border-[#C2AE82]/30 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#C2AE82]/10 transition-colors"
          >
            Próxima &rarr;
          </button>
        </div>
      )}
      <ModalDetalhesPedido
        isOpen={isModalAberto}
        pedidoSelecionado={pedidoSelecionado}
        onClose={fecharModal}
        formatarData={formatarData}
        formatarMoeda={formatarMoeda}
        getStatusBadge={getStatusBadge}
        onAtualizarStatus={handleAtualizarStatus}
        isAdmin={true}
      />

    </div>
  );
}