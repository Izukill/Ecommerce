'use client';

import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import ActionCard from "@/app/components/layout/ActionCard";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import toast from "react-hot-toast";
import {
  Shirt,
  Tags,
  Truck,
  BarChart2,
  TrendingUp,
  ShoppingCart,
  Package
} from "lucide-react";

export default function AdminDashboardPage() {
  const { usuario } = useAuth();
  const primeiroNome = usuario && usuario.nome ? usuario.nome.split(' ')[0] : "Admin";
  const { dashboard, carregando } = useAdminDashboard();

  const [frete, setFrete] = useState<string>("0.00");
  const [salvandoFrete, setSalvandoFrete] = useState(false);

  useEffect(() => {
    api.get("/config")
      .then(res => {
        if (res.data && res.data.frete !== undefined) {
          setFrete(res.data.frete.toFixed(2));
        }
      })
      .catch(err => console.error("Erro ao buscar frete:", err));
  }, []);

  const handleSalvarFrete = async () => {
    setSalvandoFrete(true);
    try {
      const valorNumerico = parseFloat(frete.replace(',', '.'));
      if (isNaN(valorNumerico)) {
        toast.error("Digite um valor válido.");
        setSalvandoFrete(false);
        return;
      }

      await api.put("/config/frete", { frete: valorNumerico });

      setFrete(valorNumerico.toFixed(2));

      toast.success("Valor do frete atualizado para todos os novos pedidos!");
    } catch (error) {
      toast.error("Erro ao atualizar o frete.");
    } finally {
      setSalvandoFrete(false);
    }
  };

  const formatarFreteVisualmente = () => {
    const valorNumerico = parseFloat(frete.replace(',', '.'));
    if (!isNaN(valorNumerico)) {
      setFrete(valorNumerico.toFixed(2));
    } else {
      setFrete("0.00");
    }
  };

  if (carregando || !dashboard) {
      return <div className="text-white">Carregando...</div>;
  }

  return (
    <div className="space-y-10">

      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Olá, <span className="text-[#C2AE82] capitalize">{primeiroNome}</span>
        </h2>
        <p className="text-sm text-gray-400 mt-1">Aqui está o resumo da loja atualmente.</p>
      </div>

      {/* estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-black p-6 rounded-xl border border-neutral-800 border-l-4 border-l-[#C2AE82]">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp size={18} className="text-[#C2AE82]" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Faturamento do Mês</p>
          </div>
          <h3 className="text-3xl font-extrabold text-white">
            R$ {Number(dashboard.faturamentoMes ?? 0).toFixed(2).replace(".", ",")}
          </h3>
          <p className="text-xs text-green-400 mt-2 font-bold">
            +{Number(dashboard.porcentagemPassada ?? 0).toFixed(1)}% vs mês anterior
          </p>
        </div>

        <div className="bg-black p-6 rounded-xl border border-neutral-800 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3 mb-3">
            <ShoppingCart size={18} className="text-blue-400" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pedidos no Mês</p>
          </div>
          <h3 className="text-3xl font-extrabold text-white">{dashboard.pedidosMes ?? 0}</h3>
          <p className="text-xs text-yellow-400 mt-2 font-bold">
            {dashboard.aguardandoEnvio ?? 0} aguardando envio
          </p>
        </div>

        <div className="bg-black p-6 rounded-xl border border-neutral-800 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3 mb-3">
            <Package size={18} className="text-green-400" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Produtos Ativos</p>
          </div>
          <h3 className="text-3xl font-extrabold text-white">{dashboard.produtosAtivos ?? 0}</h3>
          <p className="text-xs text-gray-400 mt-2">No catálogo</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          href="/admin/relatorios"
          className="flex items-center gap-2 px-4 py-2 text-[#C2AE82] font-bold rounded-xl hover:bg-neutral-800 transition-colors text-sm"
        >
          <BarChart2 size={16} />
          Ver Relatórios Completos →
        </Link>
      </div>

      {/* lista dos 4 pedidos recentes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Últimos Pedidos</h3>
          <Link href="/admin/pedidos" className="text-sm px-4 py-2 text-[#C2AE82] font-bold rounded-xl  hover:bg-neutral-800 transition-colors text-sm">
            Ver todos &rarr;
          </Link>
        </div>

        <div className="bg-black rounded-xl shadow-2xl border border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900 border-b border-neutral-800 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">ID Pedido</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {dashboard.ultimosPedidos.map((pedido: any) => (
                  <tr key={pedido.lookupId} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">{pedido.lookupId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-100">{pedido.clienteNome}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(pedido.dataHora).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border
                        ${pedido.status === 'PAGO' ? 'bg-green-950/30 text-green-400 border-green-900/50' :
                          pedido.status === 'ENVIADO' ? 'bg-blue-950/30 text-blue-400 border-blue-900/50' :
                          pedido.status === 'CANCELADO' ? 'bg-red-950/30 text-red-400 border-red-900/50' :
                          pedido.status === 'AGUARDANDO_PAGAMENTO' ? 'bg-yellow-950/30 text-yellow-400 border-yellow-900/50' :
                          'bg-blue-950/30 text-blue-400 border-blue-900/50'}`}
                      >
                        {pedido.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-extrabold text-[#C2AE82]">
                      R$ {(pedido.valorTotal ?? 0).toFixed(2).replace('.', ',')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <hr className="border-neutral-800 my-8" />

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <ActionCard
            icone={Shirt}
            titulo="Gerenciar Produtos"
            descricao="Cadastre, edite e organize o seu catálogo de roupas."
            textoBotao="Acessar Produtos"
            href="/admin/produtos"
          />

          <ActionCard
            icone={Tags}
            titulo="Gerenciar Categorias"
            descricao="Crie novas categorias para organizar a sua vitrine."
            textoBotao="Acessar Categorias"
            href="/admin/categorias"
          />

        </div>
      </div>

      {/* 👇 Seção de Configurações Atualizada */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Configurações da Loja</h3>

        {/* A propriedade items-start alinha os itens no topo, impedindo o stretch */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          {/* A classe h-fit garante que o card só ocupe a altura necessária */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-lg h-fit">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#C2AE82]/20 text-[#C2AE82] rounded-lg">
                <Truck size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Frete Fixo</h3>
            </div>

            <p className="text-sm text-gray-400 mb-4">
              Este valor será cobrado em todas as novas compras. Pedidos antigos não serão afetados.
            </p>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={frete}
                  onChange={(e) => setFrete(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  onBlur={formatarFreteVisualmente}
                  className="w-full pl-10 pr-3 py-2 bg-black border border-neutral-700 rounded-lg text-white font-bold focus:ring-1 focus:ring-[#C2AE82] outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <button
                onClick={handleSalvarFrete}
                disabled={salvandoFrete}
                className="px-4 py-2 bg-[#C2AE82] hover:bg-[#a8956b] text-black font-extrabold rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
              >
                {salvandoFrete ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>

        </div>
      </div>


    </div>
  );
}