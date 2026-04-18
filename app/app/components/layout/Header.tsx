'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { useCart } from "@/app/contexts/CartContext";
import ModalLogout from "@/app/components/layout/ModalLogout";
import { api } from "@/lib/api";
import {
  User,
  ChevronDown,
  Tags,
  Sparkles,
  Package,
  LayoutDashboard,
  Percent,
  LogOut,
  Menu,
  X
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
  const pathname = usePathname();

  const [categorias, setCategorias] = useState<CategoriaNav[]>([]);

  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [categoriasMobileAberto, setCategoriasMobileAberto] = useState(false);
  const menuMobileRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [modalLogoutAberto, setModalLogoutAberto] = useState(false);

  const handleLancamentosClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuMobileAberto(false);

    if (pathname === '/') {
      document.getElementById('lancamentos')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/?scrollTo=lancamentos');
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
      e.preventDefault();
      setMenuMobileAberto(false);

      if (pathname === '/') {
        document.getElementById('comeco')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push('/?scrollTo=comeco');
      }
    };

  const handleCategoriasClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuAberto(false);
    setMenuMobileAberto(false);
    router.push('/produtos');
  };

  useEffect(() => {
    const carregarCategoriasMenu = async () => {
      try {
        const response = await api.get('/categorias?sort=asc');
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

  useEffect(() => {
    const menu = menuMobileRef.current;
    const backdrop = backdropRef.current;
    if (!menu || !backdrop) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentTranslate = 0;
    let isArrastando = false;
    let seMexeu = false;

    const handleTouchStart = (e: TouchEvent) => {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;

      if (!menuMobileAberto && mouseX > 40) return; //pixel pra começar a mexer a header

      isArrastando = true;
      seMexeu = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isArrastando) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - mouseX;
      const diffY = currentY - mouseY;

      if (!seMexeu && Math.abs(diffY) > Math.abs(diffX)) {
        isArrastando = false;
        return;
      }

      seMexeu = true;
      const menuWidth = window.innerWidth * 0.85 > 384 ? 384 : window.innerWidth * 0.85;
      menu.style.transition = 'none';
      backdrop.style.transition = 'none';

      if (menuMobileAberto) {
        currentTranslate = Math.max(-menuWidth, Math.min(0, diffX));
      } else {
        currentTranslate = Math.max(-menuWidth, Math.min(0, -menuWidth + diffX));
      }

      menu.style.transform = `translateX(${currentTranslate}px)`;
      const percentOpen = 1 - Math.abs(currentTranslate) / menuWidth;
      backdrop.style.opacity = (percentOpen * 0.8).toString();
    };

    const handleTouchEnd = () => {
      if (!isArrastando) return;
      isArrastando = false;

      if (seMexeu) {
        const menuWidth = window.innerWidth * 0.85 > 384 ? 384 : window.innerWidth * 0.85;

        menu.style.transition = 'transform 0.3s ease-out';
        backdrop.style.transition = 'opacity 0.3s ease-out';
        menu.style.transform = '';
        backdrop.style.opacity = '';

        if (menuMobileAberto && currentTranslate < -60) {
          setMenuMobileAberto(false);
        } else if (!menuMobileAberto && currentTranslate > -menuWidth + 60) {
          setMenuMobileAberto(true);
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);

      // Limpeza de segurança caso o componente desmonte no meio do arrasto
      if (menu && backdrop) {
        menu.style.transform = '';
        backdrop.style.opacity = '';
        menu.style.transition = '';
        backdrop.style.transition = '';
      }
    };
  }, [menuMobileAberto]);


  const abrirModalLogout = () => {
    setMenuAberto(false);
    setMenuMobileAberto(false);
    setModalLogoutAberto(true);
  };

  const confirmarLogout = () => {
    setModalLogoutAberto(false);
    logout();
    router.push('/');
  };

  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-[#C2AE82] shadow-lg border-b border-black/20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            <div className="flex items-center gap-4 lg:gap-12">

              {/* só apareçe no celular */}
              <button
                onClick={() => setMenuMobileAberto(true)}
                className="lg:hidden text-black hover:text-white transition-colors focus:outline-none -ml-2 p-2"
                aria-label="Abrir menu"
              >
                <Menu size={28} strokeWidth={2.5} />
              </button>

              {/* logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/#comeco" onClick={handleMenuClick} className="flex items-center gap-2 cursor-pointer">
                  <img src="/logoMirle.png" alt="Logo MirlleFitness" className="h-16 lg:h-20 w-auto object-contain" />
                  <span className="hidden sm:block text-2xl font-extrabold tracking-tighter text-black">
                    MIRLLE<span className="text-black/70">FITNESS</span>
                  </span>
                </Link>
              </div>

              {/* navegação no pc */}
              <nav className="hidden lg:flex items-center space-x-8 ml-20">
                <Link href="/#lancamentos" onClick={handleLancamentosClick} className="text-black font-semibold hover:text-white transition-colors flex items-center gap-1">
                  <Sparkles size={16}/> Lançamentos
                </Link>

                <div className="relative group py-6">
                  <Link href="/produtos" onClick={handleCategoriasClick} className="text-black font-semibold hover:text-white transition-colors flex items-center gap-1 focus:outline-none">
                    <Tags size={16} /> Categorias <ChevronDown size={16} className="transition-transform duration-200 group-hover:rotate-180" />
                  </Link>

                  <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[500px] lg:w-[600px] bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-6">
                    {categorias.length === 0 ? (
                      <div className="text-sm text-gray-500 text-center py-4">Carregando categorias...</div>
                    ) : (
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1">
                        {categorias.map((cat) => (
                          <Link
                            key={cat.lookupId}
                            href={`/produtos?categoria=${cat.lookupId}`}
                            onClick={handleCategoriasClick}
                            className="text-sm font-medium text-gray-300 hover:text-[#C2AE82] hover:bg-[#C2AE82]/10 px-3 py-1 rounded-lg transition-colors flex items-center"
                          >
                            {cat.nome}
                          </Link>
                        ))}
                      </div>
                    )}

                    <div className="border-t border-neutral-800 mt-6 pt-5 flex justify-center">
                      <Link href="/produtos" onClick={handleCategoriasClick} className="inline-flex items-center px-6 py-2 border border-[#C2AE82] text-xs font-bold text-[#C2AE82] hover:bg-[#C2AE82] hover:text-black rounded-full uppercase tracking-wider transition-all">
                        Ver Toda a Coleção
                      </Link>
                    </div>
                  </div>
                </div>

                <Link href="/produtos?emOferta=true" className="flex items-center gap-1 text-black font-extrabold hover:text-white transition-colors">
                  <Percent size={14} className="animate-pulse" /> Ofertas
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4 sm:space-x-5">
              {usuario ? (
                <div className="relative border-r border-black/20 pr-4 sm:pr-5" ref={menuRef}>
                  <button
                    onClick={() => setMenuAberto(!menuAberto)}
                    className="flex items-center gap-2 text-black hover:text-white transition-colors focus:outline-none"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-[#C2AE82]">
                      <User size={16} strokeWidth={2.5} />
                    </div>
                    <span className="font-bold capitalize hidden sm:block">Olá, {primeiroNome}</span>
                    <ChevronDown size={18} strokeWidth={2.5} className={`hidden sm:block transition-transform duration-200 ${menuAberto ? 'rotate-180' : ''}`} />
                  </button>

                  {menuAberto && (
                    <div className="absolute right-0 mt-4 w-56 bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-neutral-800 mb-2">
                        <p className="text-sm text-white font-bold capitalize">{usuario.nome}</p>
                        <p className="text-xs text-gray-400 truncate">{usuario.email}</p>
                      </div>

                      {usuario.perfil !== "ADM" && (
                        <>
                          <Link href="/cliente?aba=perfil" onClick={() => setMenuAberto(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-[#C2AE82]/10 hover:text-[#C2AE82] transition-colors"><User size={16} /> Meu Perfil</Link>
                          <Link href="/cliente?aba=pedidos" onClick={() => setMenuAberto(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-[#C2AE82]/10 hover:text-[#C2AE82] transition-colors"><Package size={16} /> Meus Pedidos</Link>
                        </>
                      )}
                      {usuario.perfil === "ADM" && (
                        <div className="mb-2">
                          <Link href="/admin" onClick={() => setMenuAberto(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#C2AE82] font-bold hover:bg-[#C2AE82]/10 transition-colors"><LayoutDashboard size={16} /> Painel Admin</Link>
                        </div>
                      )}
                      <div className="mt-2 pt-2 border-t border-neutral-800">
                        <button onClick={abrirModalLogout} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 font-bold hover:bg-red-500/10 transition-colors"><LogOut size={16} /> Sair da conta</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-r border-black/20 pr-4 sm:pr-5">
                  <Link href="/login" className="flex items-center gap-2 text-black hover:text-white transition-colors" title="Fazer Login">
                    <User size={24} strokeWidth={2.5} className="sm:hidden" />
                    <span className="text-sm font-bold hidden sm:block">Entrar / Cadastrar</span>
                  </Link>
                </div>
              )}

              <Link href="/checkout" className="text-black hover:text-white transition-colors relative flex items-center pr-2">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {quantidadeTotal > 0 && (
                  <span className="absolute -top-2 -right-0 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-[#C2AE82]">
                    {quantidadeTotal}
                  </span>
                )}
              </Link>
            </div>

          </div>
        </div>

        {/* menu mobile */}
        <div className={`fixed inset-0 z-[100] lg:hidden ${menuMobileAberto ? 'pointer-events-auto' : 'pointer-events-none'}`}>

          {/* Fundo escuro (Backdrop) */}
          <div
            ref={backdropRef}
            className={`absolute inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out ${menuMobileAberto ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setMenuMobileAberto(false)}
          ></div>

          {/* menu desliza da esquerda */}
          <div
            ref={menuMobileRef}
            className={`absolute top-0 left-0 bottom-0 z-50 w-[85%] max-w-sm bg-neutral-950 border-r border-neutral-800 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${menuMobileAberto ? 'translate-x-0' : '-translate-x-full'}`}
          >

            <div className="flex items-center justify-between p-6 border-b border-neutral-800 bg-[#C2AE82]">
              <Link href="/#comeco" onClick={handleMenuClick}>
                <span className="text-xl font-extrabold tracking-tighter text-black">
                  MIRLLE<span className="text-black/70">FITNESS</span>
                </span>
              </Link>
              <button
                onClick={() => setMenuMobileAberto(false)}
                className="p-2 -mr-2 text-black hover:text-white transition-colors rounded-full"
              >
                <X size={28} strokeWidth={2.5} />
              </button>
            </div>

              {/* link pra lançamento */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <Link
                  href="/#lancamentos"

                  onClick={handleLancamentosClick}
                  className="block text-xl font-bold text-white hover:text-[#C2AE82] transition-colors"
                >
                  Lançamentos
                </Link>

                {/* filtro pra categorias */}
                <div className="border-y border-neutral-800 py-4">
                  <div className="flex items-center justify-between w-full">
                    <Link
                      href="/produtos"
                      onClick={handleCategoriasClick}
                      className="text-xl font-bold text-white hover:text-[#C2AE82] transition-colors focus:outline-none"
                    >
                      Categorias
                    </Link>
                    <button
                      onClick={() => setCategoriasMobileAberto(!categoriasMobileAberto)}
                      className="p-2 text-gray-500 focus:outline-none"
                    >
                      <ChevronDown size={24} className={`transition-transform duration-300 ${categoriasMobileAberto ? 'rotate-180 text-[#C2AE82]' : ''}`} />
                    </button>
                  </div>

                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${categoriasMobileAberto ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col space-y-4 pl-4 border-l-2 border-[#C2AE82]/30">
                      {categorias.map((cat) => (
                        <Link
                          key={cat.lookupId}
                          href={`/produtos?categoria=${cat.lookupId}`}
                          onClick={() => setMenuMobileAberto(false)}
                          className="text-base text-gray-400 hover:text-white transition-colors"
                        >
                          {cat.nome}
                        </Link>
                      ))}
                      <Link
                        href="/produtos"
                        onClick={handleCategoriasClick}
                        className="text-base font-bold text-[#C2AE82] pt-2"
                      >
                        Ver Tudo &rarr;
                      </Link>
                    </div>
                  </div>
                </div>

                <Link
                  href="/produtos?emOferta=true"
                  onClick={() => setMenuMobileAberto(false)}
                  className="flex items-center gap-2 text-xl font-extrabold text-red-500 hover:text-red-400 transition-colors bg-red-950/20 p-3 rounded-xl border border-red-900/30"
                >
                  <Percent size={20} className="animate-pulse" />
                  Ofertas
                </Link>
              </div>

              <div className="p-6 border-t border-neutral-800 bg-black">
                {usuario ? (
                   <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#C2AE82] flex items-center justify-center text-black flex-shrink-0">
                           <User size={20} strokeWidth={2.5} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-white font-bold text-sm capitalize truncate">{usuario.nome}</p>
                          <p className="text-gray-500 text-xs truncate">{usuario.email}</p>
                        </div>
                      </div>

                      {usuario.perfil === "ADM" ? (
                        <Link href="/admin" onClick={() => setMenuMobileAberto(false)} className="flex items-center gap-3 text-[#C2AE82] font-bold py-3 px-2 -mx-2 hover:bg-neutral-900 rounded-lg transition-colors w-full">
                          <LayoutDashboard size={20} /> Painel Administrador
                        </Link>
                      ) : (
                        <>
                          <Link href="/cliente?aba=perfil" onClick={() => setMenuMobileAberto(false)} className="flex items-center gap-3 text-white py-3 px-2 -mx-2 hover:bg-neutral-900 rounded-lg transition-colors w-full">
                            <User size={20} /> Meu Perfil
                          </Link>
                          <Link href="/cliente?aba=pedidos" onClick={() => setMenuMobileAberto(false)} className="flex items-center gap-3 text-white py-3 px-2 -mx-2 hover:bg-neutral-900 rounded-lg transition-colors w-full">
                            <Package size={20} /> Meus Pedidos
                          </Link>
                        </>
                      )}

                      <div className="pt-2 mt-2 border-t border-neutral-800">
                        <button onClick={abrirModalLogout} className="flex items-center gap-3 text-red-500 font-bold py-3 px-2 -mx-2 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left">
                          <LogOut size={20} /> Sair da conta
                        </button>
                      </div>
                   </div>
                ) : (
                   <Link href="/login" onClick={() => setMenuMobileAberto(false)} className="flex items-center justify-center gap-2 w-full bg-[#C2AE82] text-black font-bold py-4 rounded-xl shadow-lg">
                      Fazer Login
                   </Link>
                )}
              </div>

            </div>
          </div>

      </header>
      <ModalLogout
        isOpen={modalLogoutAberto}
        onClose={() => setModalLogoutAberto(false)}
        onConfirm={confirmarLogout}
      />
      </>
      );
    }
