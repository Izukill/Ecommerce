'use client';
import { useState, useEffect } from "react";
import { useAdminDashboard } from "@/app/hooks/useAdminDashboard";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import { useAuth } from "@/app/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

import { TrendingUp,
    Package,
    ShoppingCart,
    PieChart as PieIcon,
    Download,
    BarChart2
} from "lucide-react";

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

//precisei costumizar o tolltip pra continuar com o tema escuro
const TooltipEscuro = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 shadow-2xl z-50 pointer-events-none">
      <p className="text-xs text-gray-400 font-bold uppercase mb-2 whitespace-normal break-words max-w-[200px]">
        {label}
      </p>
      {payload.map((entry: any, i: number) => {
        const isMoeda = entry.name === "valor" || entry.name === "Receita";

        return (
          <p key={i} className="text-sm font-bold" style={{ color: entry.color }}>
            {entry.name}: {isMoeda
              ? `R$ ${Number(entry.value).toFixed(2).replace(".", ",")}`
              : entry.value}
          </p>
        );
      })}
    </div>
  );
};

export default function RelatoriosPage() {
  const { dashboard, carregando } = useAdminDashboard();
  const { usuario } = useAuth();
  const router = useRouter();
  const [baixandoPdf, setBaixandoPdf] = useState(false);

  useEffect(() => {
        if (usuario && !usuario.permissaoTotal && !usuario.relatoriosPage) {
          toast.error("Você não tem permissão para acessar esta página.");
          router.push("/admin");
        }
  }, [usuario, router]);

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

  const dadosFaturamento = (dashboard.faturamentoUltimosMeses ?? []).map((f: any) => ({
    mes: MESES[f.mes - 1],
    valor: Number(f.valor),
  }));

  const dadosProdutos = (dashboard.produtosMaisVendidos ?? []).map((p: any) => ({
    nome: p.nome,
    quantidadeVendida: Number(p.quantidadeVendida),
    receitaGerada: Number(p.receitaGerada),
  }));

  const dadosStatus = (dashboard.pedidosPorStatus ?? []).map((s: any) => ({
    name: s.status.replace("_", " "),
    value: Number(s.quantidade),
    cor: CORES_STATUS[s.status] ?? "#6b7280",
  }));

  const totalPedidos = dadosStatus.reduce((acc: number, s: any) => acc + s.value, 0);

  const exportarPDF = async () => {
    const elemento = document.getElementById("relatorio-conteudo");
    if (!elemento) return;

    setBaixandoPdf(true);
    try {
      const larguraOriginal = elemento.style.width;
      const minWidthOriginal = elemento.style.minWidth;

      elemento.style.width = "1024px";
      elemento.style.minWidth = "1024px";

      await new Promise((resolve) => setTimeout(resolve, 300));

      const imgData = await toPng(elemento, {
        backgroundColor: "#000000",
        pixelRatio: 2,
        width: 1024,
        filter: (node) => {
          if (node instanceof HTMLElement && node.tagName === "IFRAME") return false;
          return true;
        },
      });

      elemento.style.width = larguraOriginal;
      elemento.style.minWidth = minWidthOriginal;

      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => { img.onload = resolve; });

      const margem = 12;
      const pdfWidth = 210;
      const conteudoWidth = pdfWidth - margem * 2;
      const conteudoHeight = (img.height * conteudoWidth) / img.width;
      const pdfHeight = conteudoHeight + margem * 2;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      pdf.setFillColor(0, 0, 0);
      pdf.rect(0, 0, pdfWidth, pdfHeight, "F");
      pdf.addImage(imgData, "PNG", margem, margem, conteudoWidth, conteudoHeight);

      const dataHoje = new Date().toLocaleDateString("pt-BR").replace(/\//g, "-");
      pdf.save(`relatorio-mirllefitness-${dataHoje}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      const elemento = document.getElementById("relatorio-conteudo");
      if (elemento) {
        elemento.style.width = "";
        elemento.style.minWidth = "";
      }
    } finally {
      setBaixandoPdf(false);
    }
  };

  return (
    <div className="space-y-10 select-none">
     <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
       <div>
         <h2 className="flex items-center gap-3 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
           <BarChart2 className="text-[#C2AE82]" size={32}/> Relatórios & <span className="text-[#C2AE82]">Análises</span>
         </h2>
         <p className="text-sm text-gray-400 mt-1">
           Visão dos gráficos e desempenho da loja.
         </p>
       </div>
       <button
         onClick={exportarPDF}
         disabled={baixandoPdf}
         className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C2AE82] text-black font-extrabold rounded-xl hover:bg-[#a8956b] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg w-full sm:w-auto"
       >
         {baixandoPdf ? (
           <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
         ) : (
           <Download size={16} />
         )}
         {baixandoPdf ? "Gerando PDF..." : "Exportar Relatório PDF"}
       </button>
     </div>

     <div id="relatorio-conteudo" className="space-y-10">
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

          {/* LineChart */}
          <div className="bg-black border border-neutral-800 rounded-2xl p-6 shadow-xl w-full min-w-0">
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

                  <YAxis
                    width={80}
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `R$ ${v.toLocaleString('pt-BR')}`}
                  />
                  <Tooltip content={<TooltipEscuro />} />

                  <Line
                    type="monotone"
                    dataKey="valor"
                    stroke={GOLD}
                    strokeWidth={3}
                    dot={{ fill: GOLD, strokeWidth: 0, r: 5 }}
                    activeDot={{ r: 7, fill: GOLD }}
                    connectNulls={true}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0">

            {/* BarChart */}
            <div className="bg-black border border-neutral-800 rounded-2xl p-6 shadow-xl w-full min-w-0">
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
                  <BarChart data={dadosProdutos} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />

                    <YAxis
                      dataKey="nome"
                      type="category"
                      tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                      width={120}
                      tickFormatter={(value) => value.length > 14 ? `${value.substring(0, 14)}...` : value}
                    />

                    <Tooltip content={<TooltipEscuro />} cursor={{ fill: "#1a1a1a" }} />
                    <Bar
                      dataKey="quantidadeVendida"
                      fill={GOLD}
                      radius={[0, 6, 6, 0]}
                      name="Unidades"
                      isAnimationActive={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* PieChart */}
            <div className="bg-black border border-neutral-800 rounded-2xl p-6 shadow-xl w-full min-w-0">
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
                        isAnimationActive={false}
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
                            <div className="bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 shadow-2xl pointer-events-none">
                              <p className="text-xs text-gray-400 font-bold uppercase mb-1">{d.name}</p>
                              <p className="text-sm font-extrabold text-white">{d.value} pedidos</p>
                              <p className="text-xs text-gray-500">{((d.value / totalPedidos) * 100).toFixed(1)}% do total</p>
                            </div>
                          );
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
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

          {/* BarChart */}
          <div className="bg-black border border-neutral-800 rounded-2xl p-6 shadow-xl w-full min-w-0">
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
                <BarChart data={dadosProdutos} margin={{ top: 5, right: 20, left: 10, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />

                  <XAxis
                    dataKey="nome"
                    tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    dy={10}
                    tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 12)}...` : value}
                  />

                  <YAxis
                    width={80}
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `R$ ${v.toLocaleString('pt-BR')}`}
                  />
                  <Tooltip content={<TooltipEscuro />} cursor={{ fill: "#1a1a1a" }} />
                  <Bar
                    dataKey="receitaGerada"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                    name="Receita"
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
     </div>
    </div>
  );
}