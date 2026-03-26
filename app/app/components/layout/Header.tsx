'use client';

import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { useCart } from "@/app/contexts/CartContext";

export default function Header() {
  const { usuario, logout } = useAuth();
  const primeiroNome = usuario && usuario.nome ? usuario.nome.split(' ')[0] : "";
  const { quantidadeTotal } = useCart();

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
              <Link href="/#vitrine" className="text-black font-semibold hover:text-white transition-colors">Lançamentos</Link>
              <Link href="#" className="text-black font-semibold hover:text-white transition-colors">Moda Praia</Link>
              <Link href="#" className="text-black font-semibold hover:text-white transition-colors">Acessórios</Link>
              <Link href="#" className="text-black font-semibold hover:text-white transition-colors">Ofertas</Link>
            </nav>

          </div>

          {/* BLOCO DA DIREITA (Login e Carrinho) Fica intacto */}
          <div className="flex items-center space-x-5">
            {usuario ? (
              <div className="flex items-center gap-4 border-r border-black/20 pr-4">
                <span className="text-black font-bold capitalize">Olá, {primeiroNome}</span>
                {usuario.perfil === "ADM" && (
                  <Link href="/admin" className="text-xs font-bold bg-black text-[#C2AE82] px-3 py-1.5 rounded-md hover:bg-gray-800 transition">
                    Painel Admin
                  </Link>
                )}
                <button onClick={logout} className="text-black hover:text-white transition-colors text-sm font-bold">Sair</button>
              </div>
            ) : (
              <Link href="/login" className="text-black hover:text-white transition-colors" title="Fazer Login">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </Link>
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