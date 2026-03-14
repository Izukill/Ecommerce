'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { usuario, logout } = useAuth();

  const nomeAdmin = usuario && usuario.nome ? usuario.nome.split(' ')[0] : "Admin";
  const inicial = nomeAdmin.charAt(0).toUpperCase();

  const menuItens = [
    { nome: "Visão Geral", rota: "/admin", icone: "📊" },
    { nome: "Pedidos", rota: "/admin/pedidos", icone: "🛍️" },
    { nome: "Produtos", rota: "/admin/produtos", icone: "👕" },
    { nome: "Categorias", rota: "/admin/categorias", icone: "🏷️" },
    { nome: "Clientes", rota: "/admin/clientes", icone: "👥" },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-72 bg-neutral-900 flex flex-col hidden md:flex z-20">
        <div className="h-20 flex items-center justify-center border-b border-neutral-800">
          <Link href="/" className="text-2xl font-extrabold text-white tracking-tighter">
            MIRLLE<span className="text-[#C2AE82]">FITNESS</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
          {menuItens.map((item) => {
            const ativo = pathname === item.rota;
            return (
              <Link
                key={item.rota}
                href={item.rota}
                className={`flex items-center px-4 py-3.5 text-base font-bold rounded-xl transition-all ${
                  ativo
                    ? "bg-neutral-800 text-[#C2AE82] shadow-sm border border-neutral-700"
                    : "text-gray-400 hover:bg-neutral-800/50 hover:text-white"
                }`}
              >
                <span className="mr-4 text-xl">{item.icone}</span>
                {item.nome}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3.5 text-base font-bold text-red-400 rounded-xl hover:bg-red-950/30 hover:text-red-300 transition-colors"
          >
            <span className="mr-4 text-xl">🚪</span>
            Sair do Sistema
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-8 z-10">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Painel Administrativo</h1>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-bold text-gray-200 capitalize">{nomeAdmin}</span>
              <span className="text-xs font-semibold text-[#C2AE82]">MirlleFitness</span>
            </div>
            <div className="h-11 w-11 bg-black rounded-full flex items-center justify-center border-2 border-[#C2AE82] shadow-md">
              <span className="text-[#C2AE82] font-black text-lg">{inicial}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-10 border-l border-neutral-800">
          {children}
        </div>
      </main>
    </div>
  );
}