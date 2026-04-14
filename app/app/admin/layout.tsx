'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import ModalEditarPerfil from "../components/admin/ModalEditarPerfil";
import ModalLogout from "@/app/components/layout/ModalLogout";
import {
  LayoutDashboard,
  ShoppingBag,
  Shirt,
  Tags,
  Users,
  User,
  UserPen,
  LogOut,
  Menu,
  X,
  Store,
  BarChart2,
  ShieldAlert
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { usuario, logout, atualizarNome } = useAuth();

  const [isDropdownAberto, setIsDropdownAberto] = useState(false);
  const [isModalPerfilAberto, setIsModalPerfilAberto] = useState(false);
  const [isModalLogoutAberto, setIsModalLogoutAberto] = useState(false);

  const [isMobileMenuAberto, setIsMobileMenuAberto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const nomeAdmin = usuario && usuario.nome ? usuario.nome.split(' ')[0] : "Admin";

  useEffect(() => {
    function handleCliqueFora(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownAberto(false);
      }
    }
    document.addEventListener("mousedown", handleCliqueFora);
    return () => document.removeEventListener("mousedown", handleCliqueFora);
  }, []);

  useEffect(() => {
    if (isMobileMenuAberto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuAberto]);

  const menuItens = [
    {
      nome: "Visão Geral",
      rota: "/admin",
      icone: LayoutDashboard,
      mostrar: true
    },
    {
      nome: "Pedidos",
      rota: "/admin/pedidos",
      icone: ShoppingBag,
      mostrar: usuario?.permissaoTotal || usuario?.pedidosPage
    },
    {
      nome: "Produtos",
      rota: "/admin/produtos",
      icone: Shirt,
      mostrar: usuario?.permissaoTotal || usuario?.produtosPage
    },
    {
      nome: "Categorias",
      rota: "/admin/categorias",
      icone: Tags,
      mostrar: usuario?.permissaoTotal || usuario?.categoriasPage
    },
    {
      nome: "Clientes",
      rota: "/admin/clientes",
      icone: Users,
      mostrar: usuario?.permissaoTotal || usuario?.clientePage
    },
    {
      nome: "Relatórios",
      rota: "/admin/relatorios",
      icone: BarChart2,
      mostrar: usuario?.permissaoTotal || usuario?.relatoriosPage
    },
    {
      nome: "Permissões",
      rota: "/admin/administradores",
      icone: ShieldAlert,
      mostrar: usuario?.permissaoTotal
    }
  ].filter(item => item.mostrar);

  return (
    <div className="min-h-screen flex bg-black">

      {/* sidebar pra pc */}
      <aside className="w-72 bg-neutral-900 flex-col hidden md:flex z-20 border-r border-neutral-800">
        <div className="h-20 flex items-center justify-center border-b border-neutral-800 shrink-0">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <img src="/adminlogo.png" alt="Logo MirlleFitness" className="h-16 w-auto object-contain" />
            <span className="text-2xl font-extrabold text-white tracking-tighter">
              MIRLLE<span className="text-[#C2AE82]">FITNESS</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto custom-scrollbar">
          {menuItens.map((item) => {
            const ativo = pathname === item.rota;
            const Icone = item.icone;

            return (
              <Link
                key={item.rota}
                href={item.rota}
                className={`flex items-center px-4 py-3.5 text-base font-bold rounded-xl transition-all group ${
                  ativo
                    ? "bg-neutral-800 text-[#C2AE82] shadow-sm border border-neutral-700"
                    : "text-gray-400 hover:bg-neutral-800/50 hover:text-white"
                }`}
              >
                <Icone size={22} className="mr-4 transition-colors" />
                {item.nome}
              </Link>
            );
          })}
        </nav>


        <div className="p-4 border-t border-neutral-800 shrink-0">
          <Link
            href="/"
            className="flex items-center w-full px-4 py-3.5 text-base font-bold text-gray-400 rounded-xl hover:bg-neutral-800/50 hover:text-white transition-colors mb-2"
          >
            <Store size={22} className="mr-4" />
            Voltar para a Loja
          </Link>
          <button
            onClick={() => setIsModalLogoutAberto(true)}
            className="flex items-center w-full px-4 py-3.5 text-base font-bold text-red-400 rounded-xl hover:bg-red-950/30 hover:text-red-300 transition-colors"
          >
            <LogOut size={22} className="mr-4" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-4 sm:px-8 z-10 shrink-0">

          <div className="flex items-center gap-3 sm:gap-0">
            <button
              onClick={() => setIsMobileMenuAberto(true)}
              className="md:hidden text-gray-400 hover:text-white transition-colors p-1"
            >
              <Menu size={28} strokeWidth={2.5} />
            </button>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate max-w-[180px] sm:max-w-none">
              Painel <span className="hidden sm:inline">Administrativo</span>
            </h1>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownAberto(!isDropdownAberto)}
              className="flex items-center gap-4 group cursor-pointer p-1 sm:p-2 rounded-full hover:bg-neutral-800/50 transition-colors"
            >
              <div className="flex-col items-end hidden sm:flex">
                <span className="text-md font-bold text-gray-200 capitalize group-hover:text-white transition-colors">
                  {nomeAdmin}
                </span>
                <span className="text-sm font-semibold text-[#C2AE82]">MirlleFitness</span>
              </div>
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full flex items-center justify-center border-2 border-[#C2AE82] text-[#C2AE82] bg-black shadow-md group-hover:border-white group-hover:text-white transition-all">
                <User size={20} strokeWidth={2} />
              </div>
            </button>

            {isDropdownAberto && (
              <div className="absolute right-0 mt-3 w-56 bg-neutral-900/95 backdrop-blur-sm rounded-xl shadow-2xl border border-neutral-800 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="px-3 py-2 border-b border-neutral-800 mb-2">
                    <p className="text-xs text-gray-500 font-medium">Logado como</p>
                    <p className="text-sm font-bold text-white truncate">{usuario?.email}</p>
                </div>

                <button
                  onClick={() => {
                    setIsDropdownAberto(false);
                    setIsModalPerfilAberto(true);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold text-gray-300 rounded-lg hover:bg-[#C2AE82]/10 hover:text-[#C2AE82] transition-colors"
                >
                  <UserPen size={18} />
                  Meus Dados
                </button>

                <button
                  onClick={() => {
                    setIsDropdownAberto(false);
                    setIsModalLogoutAberto(true);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold text-red-400 rounded-lg hover:bg-red-950/30 hover:text-red-300 transition-colors mt-1"
                >
                  <LogOut size={18} />
                  Sair
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 custom-scrollbar">
          {children}
        </div>
      </main>

      {/* menu do mobile */}
      {isMobileMenuAberto && (
        <div className="fixed inset-0 z-[100] md:hidden">

          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuAberto(false)}
          />

          <div className="absolute top-0 left-0 bottom-0 w-[85%] max-w-[300px] bg-neutral-900 border-r border-neutral-800 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">

            <div className="h-20 flex items-center justify-between px-6 border-b border-neutral-800 bg-neutral-950/50">
              <Link href="/" onClick={() => setIsMobileMenuAberto(false)}>
                <span className="text-xl font-extrabold text-white tracking-tighter">
                  MIRLLE<span className="text-[#C2AE82]">FITNESS</span>
                </span>
              </Link>
              <button
                onClick={() => setIsMobileMenuAberto(false)}
                className="text-gray-400 hover:text-white p-1 transition-colors"
              >
                <X size={26} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-3">
              {menuItens.map((item) => {
                const ativo = pathname === item.rota;
                const Icone = item.icone;

                return (
                  <Link
                    key={item.rota}
                    href={item.rota}
                    onClick={() => setIsMobileMenuAberto(false)}
                    className={`flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-all ${
                      ativo
                        ? "bg-neutral-800 text-[#C2AE82] border border-neutral-700"
                        : "text-gray-400 hover:bg-neutral-800/50 hover:text-white"
                    }`}
                  >
                    <Icone size={20} className="mr-4" />
                    {item.nome}
                  </Link>
                );
              })}
            </div>

            <div className="p-4 border-t border-neutral-800 bg-neutral-950/30">
              <Link
                href="/"
                onClick={() => setIsMobileMenuAberto(false)}
                className="flex items-center w-full px-4 py-3 text-sm font-bold text-gray-400 rounded-xl hover:bg-neutral-800/50 hover:text-white transition-colors mb-2"
              >
                <Store size={20} className="mr-4" />
                Voltar para a Loja
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuAberto(false);
                  setIsModalLogoutAberto(true);
                }}
                className="flex items-center w-full px-4 py-3 text-sm font-bold text-red-400 rounded-xl hover:bg-red-950/30 transition-colors"
              >
                <LogOut size={20} className="mr-4" />
                Sair do Sistema
              </button>
            </div>
          </div>
        </div>
      )}
      {usuario && (
        <ModalEditarPerfil
          isOpen={isModalPerfilAberto}
          onClose={() => setIsModalPerfilAberto(false)}
          lookupId={usuario.lookupId}
          nomeAtual={usuario.nome || "Admin"}
          aoSalvarComSucesso={(novoNome) => {
            atualizarNome(novoNome);
          }}
        />
      )}
      <ModalLogout
        isOpen={isModalLogoutAberto}
        onClose={() => setIsModalLogoutAberto(false)}
        onConfirm={() => {
          setIsModalLogoutAberto(false);
          logout();
        }}
      />

    </div>
  );
}