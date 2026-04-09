import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { useCart } from "@/app/contexts/CartContext";
import { api } from "@/lib/api";
import {
  User,
  ChevronDown,
  Package,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

interface CategoriaNav {
  lookupId: string;
  nome: string;
}

export default function Header() {
  const { usuario, logout } = useAuth();
  const primeiroNome = usuario && usuario.nome ? usuario.nome.split(' ')[0] : "";
  const { quantidadeTotal } = useCart();

  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [categorias, setCategorias] = useState<CategoriaNav[]>([]);

  useEffect(() => {
    const carregarCategoriasMenu = async () => {
      try {
        const response = await api.get('/categorias');
        const dados = response.data?.content || response.data || [];
        setCategorias(dados);
      } catch (error) {
        console.error("Erro ao carregar categorias no Header", error);
      }
    };
    carregarCategoriasMenu();
  }, []);

  useEffect(() => {
    const handleClickFora = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAberto(false);
      }
    };
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const handleLogout = () => {
    setMenuAberto(false);
    logout();
    router.push('/');
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-[#C2AE82] shadow-lg border-b border-black/20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          <div className="flex items-center gap-40">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2 cursor-pointer">
                <img src="/logoMirle.png" alt="Logo MirlleFitness" className="h-20 w-auto object-contain" />
                <span className="text-2xl font-extrabold tracking-tighter text-black">
                  MIRLLE<span className="text-black/70">FITNESS</span>
                </span>
              </Link>
            </div>

                <nav className="hidden md:flex items-center space-x-8">
                  <Link href="/#lancamentos" className="text-black font-semibold hover:text-white transition-colors">Lançamentos</Link>

                  {/* 👇 O NOVO MENU DROPDOWN DE CATEGORIAS */}
                  <div className="relative group py-6">

                    <button className="text-black font-semibold hover:text-white transition-colors flex items-center gap-1 focus:outline-none">
                      Categorias <ChevronDown size={16} className="transition-transform duration-200 group-hover:rotate-180" />
                    </button>

                    {/* 👇 CAIXA DO MENU (Agora mais larga: w-[500px] ou [600px] e centralizada) */}
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[300px] lg:w-[400px] bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-6">

                      {categorias.length === 0 ? (
                        <div className="text-sm text-gray-500 text-center py-4">Carregando categorias...</div>
                      ) : (

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                          {categorias.map((cat) => (
                            <Link
                              key={cat.lookupId}
                              href={`/produtos?categoria=${cat.lookupId}`}
                              className="text-sm font-medium text-gray-300 hover:text-[#C2AE82] hover:bg-[#C2AE82]/10 px-3 py-2 rounded-lg transition-colors flex items-center"
                            >
                              {cat.nome}
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Botão de atalho estilizado e centralizado embaixo do Grid */}
                      <div className="border-t border-neutral-800 mt-6 pt-5 flex justify-center">
                        <Link
                          href="/produtos"
                          className="inline-flex items-center px-6 py-2 border border-[#C2AE82] text-xs font-bold text-[#C2AE82] hover:bg-[#C2AE82] hover:text-black rounded-full uppercase tracking-wider transition-all"
                        >
                          Ver Toda a Coleção
                        </Link>
                      </div>

                    </div>
                  </div>

                  <Link href="#" className="text-black font-semibold hover:text-white transition-colors">Ofertas</Link>
                </nav>
          </div>

          <div className="flex items-center space-x-5">
            {usuario ? (
              <div className="relative border-r border-black/20 pr-5" ref={menuRef}>
                <button
                  onClick={() => setMenuAberto(!menuAberto)}
                  className="flex items-center gap-2 text-black hover:text-white transition-colors focus:outline-none"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-[#C2AE82]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-bold capitalize hidden sm:block">Olá, {primeiroNome}</span>
                  <ChevronDown size={18} strokeWidth={2.5} className={`transition-transform duration-200 ${menuAberto ? 'rotate-180' : ''}`} />
                </button>

                {/* dropdown */}
                {menuAberto && (
                  <div className="absolute right-0 mt-4 w-56 bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">

                    <div className="px-4 py-3 border-b border-neutral-800 mb-2">
                      <p className="text-sm text-white font-bold capitalize">{usuario.nome}</p>
                      <p className="text-xs text-gray-400 truncate">{usuario.email}</p>
                    </div>

                    {/* checagem se usuario ou admin */}
                    {usuario.perfil !== "ADM" && (
                      <>
                        <Link
                          href="/cliente?aba=perfil"
                          onClick={() => setMenuAberto(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-[#C2AE82]/10 hover:text-[#C2AE82] transition-colors"
                        >
                          <User size={16} /> Meu Perfil
                        </Link>

                        <Link
                          href="/cliente?aba=pedidos"
                          onClick={() => setMenuAberto(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-[#C2AE82]/10 hover:text-[#C2AE82] transition-colors"
                        >
                          <Package size={16} /> Meus Pedidos
                        </Link>
                      </>
                    )}
                    {usuario.perfil === "ADM" && (
                      <div className="mb-2">
                        <Link
                          href="/admin"
                          onClick={() => setMenuAberto(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#C2AE82] font-bold hover:bg-[#C2AE82]/10 transition-colors"
                        >
                          <LayoutDashboard size={16} /> Painel Admin
                        </Link>
                      </div>
                    )}

                    <div className="mt-2 pt-2 border-t border-neutral-800">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 font-bold hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={16} /> Sair da conta
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-r border-black/20 pr-5">
                <Link href="/login" className="flex items-center gap-2 text-black hover:text-white transition-colors" title="Fazer Login">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span className="text-sm font-bold hidden sm:block">Entrar</span>
                </Link>
              </div>
            )}

            <Link href="/checkout" className="text-black hover:text-white transition-colors relative flex items-center">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {quantidadeTotal > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-[#C2AE82]">
                  {quantidadeTotal}
                </span>
              )}
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}