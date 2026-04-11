'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/app/components/layout/Header';
import { useAuth } from '@/app/contexts/AuthContext';
import PagePedidos from '@/app/components/cliente/PagePedidos';
import PagePerfil from '@/app/components/cliente/PagePerfil';
import {
  User,
  Package,
  LogOut
} from 'lucide-react';

export default function MinhaContaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const abaUrl = searchParams.get('aba') || 'perfil';

  const { usuario, logout, atualizarNome } = useAuth();
  const [abaAtiva, setAbaAtiva] = useState(abaUrl);

  useEffect(() => {
    setAbaAtiva(abaUrl);
  }, [abaUrl]);

  useEffect(() => {
      //verifica se tem algum token gerado pro react não ir pro /login direto
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      if (!usuario && !token) {
        router.push('/login');
      }
    }, [usuario, router]);

    //enquanto o usuarioAuth não carrega do Contexto, exibe uma tela preta para não piscar
    if (!usuario) {
      return <div className="min-h-screen bg-neutral-950"></div>;
    }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <Header />

      <main className="flex-grow pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Minha Conta</h1>
            <p className="text-gray-400 mt-2">
              Gerencie seus pedidos, dados pessoais e endereços.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">

            <aside className="w-full md:w-64 flex-shrink-0">
              <nav className="flex flex-col space-y-2 bg-black border border-neutral-800 p-4 rounded-2xl shadow-xl sticky top-28">
                <button
                  onClick={() => setAbaAtiva('perfil')}
                  className={`text-left px-4 py-3 rounded-lg font-bold transition-colors flex items-center gap-3 ${
                    abaAtiva === 'perfil' || abaAtiva === 'enderecos'
                      ? 'bg-[#C2AE82]/10 text-[#C2AE82] border border-[#C2AE82]/20'
                      : 'text-gray-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <User size={20} strokeWidth={2.5} /> Meu Perfil
                </button>

                <button
                  onClick={() => setAbaAtiva('pedidos')}
                  className={`text-left px-4 py-3 rounded-lg font-bold transition-colors flex items-center gap-3 ${
                    abaAtiva === 'pedidos'
                      ? 'bg-[#C2AE82]/10 text-[#C2AE82] border border-[#C2AE82]/20'
                      : 'text-gray-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <Package size={20} strokeWidth={2.5} /> Meus Pedidos
                </button>

                <div className="pt-4 mt-4 border-t border-neutral-800">
                  <button
                    onClick={() => {
                      logout();
                      router.push('/');
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg font-bold text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-3"
                  >
                    <LogOut size={17} strokeWidth={2.5}/> Sair da Conta
                  </button>
                </div>
              </nav>
            </aside>

            <section className="flex-1 bg-black border border-neutral-800 p-6 sm:p-8 rounded-2xl shadow-xl min-h-[500px]">
              {(abaAtiva === 'perfil' || abaAtiva === 'enderecos') && <PagePerfil usuarioAuth={usuario} />}
              {abaAtiva === 'pedidos' && <PagePedidos />}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
