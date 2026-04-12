'use client';

import { useAdminDashboard } from "@/app/hooks/useAdminDashboard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";
import { TrendingUp, Package, ShoppingCart, PieChart as PieIcon } from "lucide-react";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const CORES_STATUS: Record<string, string> = {
  PAGO: "#22c55e",
  ENVIADO: "#3b82f6",
  CANCELADO: "#ef4444",
  AGUARDANDO_PAGAMENTO: "#eab308",
  ENTREGUE: "#8b5cf6",
};

const GOLD = "#C2AE82";
const DARK = "#171717";

// Tooltip customizado para manter o tema escuro
const TooltipEscuro = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-gray-400 font-bold uppercase mb-2">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm font-bold" style={{ color: entry.color }}>
          {entry.name === "valor" || entry.name === "receitaGerada"
            ? `R$ ${Number(entry.value).toFixed(2).replace(".", ",")}`
            : entry.value}
        </p>
      ))}
    </div>
  );
};

export default function RelatoriosPage() {
  const { dashboard, carregando } = useAdminDashboard();

  if (carregando || !dashboard) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#C2AE82] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-bold text-sm">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  // Formata faturamento mensal para o LineChart
  const dadosFaturamento = (dashboard.faturamentoUltimosMeses ?? []).map((f: any) => ({
    mes: MESES[f.mes - 1],
    valor: Number(f.valor),
  }));

  // Formata produtos mais vendidos para o BarChart
  const dadosProdutos = (dashboard.produtosMaisVendidos ?? []).map((p: any) => ({
    nome: p.nome.length > 18 ? p.nome.substring(0, 18) + "…" : p.nome,
    nomeCompleto: p.nome,
    quantidadeVendida: Number(p.quantidadeVendida),
    receitaGerada: Number(p.receitaGerada),
  }));

  // Formata pedidos por status para o PieChart
  const dadosStatus = (dashboard.pedidosPorStatus ?? []).map((s: any) => ({
    name: s.status.replace("_", " "),
    value: Number(s.quantidade),
    cor: CORES_STATUS[s.status] ?? "#6b7280",
  }));

  const totalPedidos = dadosStatus.reduce((acc: number, s: any) => acc + s.value, 0);

  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Relatórios & <span className="text-[#C2AE82]">Análises</span>
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Visão consolidada do desempenho da loja.
        </p>
      </div>

      {/* Cards resumo */}
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

      {/* LineChart — Faturamento mensal */}
      <div className="bg-black border border-neutral-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp size={20} className="text-[#C2AE82]" />
          <div>
            <h3 className="text-lg font-bold text-white">Faturamento dos Últimos 6 Meses</h3>
            <p className="text-xs text-gray-500">Apenas pedidos pagos e enviados</p>
          </div>
        </div>

        {dadosFaturamento.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-600 font-bold">
            Sem dados suficientes para exibir o gráfico.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dadosFaturamento} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="mes" tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
              <Tooltip content={<TooltipEscuro />} />
              <Line
                type="monotone"
                dataKey="valor"
                stroke={GOLD}
                strokeWidth={3}
                dot={{ fill: GOLD, strokeWidth: 0, r: 5 }}
                activeDot={{ r: 7, fill: GOLD }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* BarChart + PieChart lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* BarChart — Produtos mais vendidos */}
        <div className="bg-black border border-neutral-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Package size={20} className="text-[#C2AE82]" />
            <div>
              <h3 className="text-lg font-bold text-white">Produtos Mais Vendidos</h3>
              <p className="text-xs text-gray-500">Por quantidade de unidades</p>
            </div>
          </div>

          {dadosProdutos.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-600 font-bold">
              Nenhuma venda registrada ainda.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dadosProdutos} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="nome" type="category" tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} width={110} />
                <Tooltip content={<TooltipEscuro />} cursor={{ fill: "#1a1a1a" }} />
                <Bar dataKey="quantidadeVendida" fill={GOLD} radius={[0, 6, 6, 0]} name="Unidades" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* PieChart — Pedidos por status */}
        <div className="bg-black border border-neutral-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <PieIcon size={20} className="text-[#C2AE82]" />
            <div>
              <h3 className="text-lg font-bold text-white">Pedidos por Status</h3>
              <p className="text-xs text-gray-500">Distribuição geral de todos os pedidos</p>
            </div>
          </div>

          {dadosStatus.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-600 font-bold">
              Nenhum pedido encontrado.
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={dadosStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {dadosStatus.map((entry: any, index: number) => (
                      <Cell key={index} fill={entry.cor} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 shadow-2xl">
                          <p className="text-xs text-gray-400 font-bold uppercase mb-1">{d.name}</p>
                          <p className="text-sm font-extrabold text-white">{d.value} pedidos</p>
                          <p className="text-xs text-gray-500">{((d.value / totalPedidos) * 100).toFixed(1)}% do total</p>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Legenda manual */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full mt-2">
                {dadosStatus.map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.cor }} />
                    <span className="text-xs text-gray-400 font-bold truncate">{s.name}</span>
                    <span className="text-xs text-white font-extrabold ml-auto">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BarChart — Receita por produto */}
      <div className="bg-black border border-neutral-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp size={20} className="text-[#C2AE82]" />
          <div>
            <h3 className="text-lg font-bold text-white">Receita Gerada por Produto</h3>
            <p className="text-xs text-gray-500">Valor total arrecadado por item vendido</p>
          </div>
        </div>

        {dadosProdutos.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-600 font-bold">
            Nenhuma venda registrada ainda.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dadosProdutos} margin={{ top: 5, right: 20, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis
                dataKey="nome"
                tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `R$${v}`}
              />
              <Tooltip content={<TooltipEscuro />} cursor={{ fill: "#1a1a1a" }} />
              <Bar dataKey="receitaGerada" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Receita" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}