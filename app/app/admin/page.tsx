'use client';

import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";

// ==========================================
// NOSSO NOVO COMPONENTE: Card de Ação Admin
// ==========================================
interface ActionCardProps {
  icone: string;
  titulo: string;
  descricao: string;
  textoBotao: string;
  href: string;
}

function ActionCard({ icone, titulo, descricao, textoBotao, href }: ActionCardProps) {
  return (
    <div className="bg-black p-6 rounded-xl shadow-2xl border-t-4 border-[#C2AE82] flex flex-col items-center justify-center text-center hover:bg-neutral-900 transition-colors">
      <span className="text-5xl mb-4">{icone}</span>
      <h3 className="text-xl font-bold text-white mb-2">{titulo}</h3>
      <p className="text-gray-400 text-sm mb-6">{descricao}</p>

      {/* Botão Padronizado Dourado */}
      <Link
        href={href}
        className="px-6 py-2 bg-[#C2AE82] text-black font-extrabold rounded-lg hover:bg-[#a8956b] transition-all shadow-lg hover:scale-105"
      >
        {textoBotao}
      </Link>
    </div>
  );
}
// ==========================================


export default function AdminDashboardPage() {
  const { usuario } = useAuth();
  const primeiroNome = usuario && usuario.nome ? usuario.nome.split(' ')[0] : "Admin";

  // Mocks de Pedidos Recentes
  const pedidosRecentes = [
    { id: "PED-0012", cliente: "Ana Beatriz", data: "14 Mar 2026", status: "Pendente", total: 239.80 },
    { id: "PED-0011", cliente: "Carlos Eduardo", data: "13 Mar 2026", status: "Enviado", total: 149.90 },
    { id: "PED-0010", cliente: "Juliana Silva", data: "12 Mar 2026", status: "Entregue", total: 319.70 },
    { id: "PED-0009", cliente: "Mariana Costa", data: "10 Mar 2026", status: "Cancelado", total: 89.90 },
  ];

  return (
    <div className="space-y-10">

      {/* 1. CABEÇALHO */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Olá, <span className="text-[#C2AE82] capitalize">{primeiroNome}</span>
        </h2>
        <p className="text-sm text-gray-400 mt-1">Aqui está o resumo do seu negócio hoje.</p>
      </div>

      {/* 2. CARDS DE ESTATÍSTICAS (Visão Geral) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-black p-6 rounded-xl shadow-lg border border-neutral-800 border-l-4 border-l-[#C2AE82]">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Faturamento (Mês)</p>
          <h3 className="text-3xl font-extrabold text-white">R$ 12.450<span className="text-lg text-gray-500">,00</span></h3>
          <p className="text-xs text-green-400 mt-2 font-bold flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            +14% em relação ao mês passado
          </p>
        </div>

        <div className="bg-black p-6 rounded-xl shadow-lg border border-neutral-800 border-l-4 border-l-blue-500">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Produtos Ativos</p>
          <h3 className="text-3xl font-extrabold text-white">45</h3>
          <p className="text-xs text-gray-400 mt-2">No seu catálogo</p>
        </div>

        <div className="bg-black p-6 rounded-xl shadow-lg border border-neutral-800 border-l-4 border-l-green-500">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Pedidos (Hoje)</p>
          <h3 className="text-3xl font-extrabold text-white">12</h3>
          <p className="text-xs text-yellow-400 mt-2 font-bold">4 aguardando envio</p>
        </div>
      </div>

      {/* 3. LISTA DE PEDIDOS RECENTES */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Últimos Pedidos</h3>
          <Link href="#" className="text-sm font-bold text-[#C2AE82] hover:text-white transition-colors">
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
                {pedidosRecentes.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">{pedido.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-100">{pedido.cliente}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pedido.data}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border
                        ${pedido.status === 'Entregue' ? 'bg-green-950/30 text-green-400 border-green-900/50' :
                          pedido.status === 'Pendente' ? 'bg-yellow-950/30 text-yellow-400 border-yellow-900/50' :
                          pedido.status === 'Cancelado' ? 'bg-red-950/30 text-red-400 border-red-900/50' :
                          'bg-blue-950/30 text-blue-400 border-blue-900/50'}`}
                      >
                        {pedido.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-extrabold text-[#C2AE82]">
                      R$ {pedido.total.toFixed(2).replace('.', ',')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <hr className="border-neutral-800 my-8" />

      {/* 4. ATALHOS DE GERENCIAMENTO (Agora usando nosso componente!) */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <ActionCard
            icone="👕"
            titulo="Gerenciar Produtos"
            descricao="Cadastre, edite e organize o seu catálogo de roupas."
            textoBotao="Acessar Produtos"
            href="/admin/produtos"
          />

          <ActionCard
            icone="🏷️"
            titulo="Gerenciar Categorias"
            descricao="Crie novas categorias para organizar a sua vitrine."
            textoBotao="Acessar Categorias"
            href="/admin/categorias"
          />

        </div>
      </div>

    </div>
  );
}