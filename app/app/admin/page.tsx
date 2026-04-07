'use client';

import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import ActionCard from "@/app/components/layout/ActionCard";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAdminDashboard } from "../hooks/useAdminDashboard";

export default function AdminDashboardPage() {
  const { usuario } = useAuth();
  const primeiroNome = usuario && usuario.nome ? usuario.nome.split(' ')[0] : "Admin";
  const { dashboard, carregando } = useAdminDashboard();

  if (carregando || !dashboard) {
      return <div className="text-white">Carregando...</div>;
  }

  return (
    <div className="space-y-10">

      {/*CABEÇALHO */}
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
          <h3 className="text-3xl font-extrabold text-white">
            R$ {(dashboard?.faturamentoMes ?? 0).toFixed(2).replace(".", ",")}
          </h3>
          <p className="text-xs text-green-400 mt-2 font-bold flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            +{(dashboard?.porcentagemPassada ?? 0)}% em relação ao mês passado
          </p>
        </div>

        <div className="bg-black p-6 rounded-xl shadow-lg border border-neutral-800 border-l-4 border-l-blue-500">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Produtos Ativos</p>
          <h3 className="text-3xl font-extrabold text-white">
            {dashboard.produtosAtivos}
          </h3>
          <p className="text-xs text-gray-400 mt-2">No seu catálogo</p>
        </div>

        <div className="bg-black p-6 rounded-xl shadow-lg border border-neutral-800 border-l-4 border-l-green-500">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Pedidos (Mês)</p>
          <h3 className="text-3xl font-extrabold text-white">
            {dashboard.pedidosMes}
          </h3>
          <p className="text-xs text-yellow-400 mt-2 font-bold">
            {dashboard.aguardandoEnvio} aguardando envio
          </p>
        </div>
      </div>

      {/* LISTA DE PEDIDOS RECENTES */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Últimos Pedidos</h3>
          <Link href="/admin/pedidos" className="text-sm font-bold text-[#C2AE82] hover:text-white transition-colors">
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

      {/*ATALHOS DE GERENCIAMENTO */}
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