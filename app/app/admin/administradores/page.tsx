'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";
import ModalExclusao from "@/app/components/layout/ModalExclusao";
import {
    ShieldCheck,
    Plus,
    Edit,
    Trash2,
    ShieldAlert,
    Mail
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Administrador {
  lookupId: string;
  nome: string;
  email: string;
  cargo: string;
  permissaoTotal: boolean;
}

export default function ListaAdministradoresPage() {
  const router = useRouter();
  const { usuario } = useAuth();

  const [admins, setAdmins] = useState<Administrador[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [adminParaExcluir, setAdminParaExcluir] = useState<Administrador | null>(null);
  const [isModalExclusaoAberto, setIsModalExclusaoAberto] = useState(false);

  //redireciona se não tiver permissão total
  useEffect(() => {
    if (usuario && !usuario.permissaoTotal) {
      toast.error("Você não tem permissão para acessar esta página.");
      router.push("/admin");
    }
  }, [usuario, router]);

  const carregarAdmins = async () => {
    setCarregando(true);
    try {
      const response = await api.get('/admin');
      const dados = response.data.content || response.data;
      setAdmins(dados);
    } catch (error) {
      toast.error("Erro ao carregar administradores.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (usuario?.permissaoTotal) {
      carregarAdmins();
    }
  }, [usuario]);

  const confirmarExclusao = async () => {
    if (!adminParaExcluir) return;
    try {
      await api.delete(`/admin/${adminParaExcluir.lookupId}`);
      toast.success("Administrador removido com sucesso!");
      carregarAdmins();
    } catch (error) {
      toast.error("Erro ao remover administrador.");
    } finally {
      setIsModalExclusaoAberto(false);
      setAdminParaExcluir(null);
    }
  };

  const irParaEdicao = (id: string) => {
    router.push(`/admin/administradores/editar/${id}`);
  };

  const formatarCargo = (cargo: string) => {
    if (cargo === 'DONO') return 'Dono';
    if (cargo === 'FUNCIONARIO') return 'Funcionário';
    return cargo;
  };

  if (!usuario?.permissaoTotal) return null;

  return (
    <div className="space-y-6 relative pb-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-[#C2AE82]" size={32} />
            Administradores
          </h2>
          <p className="text-sm text-gray-400 mt-1">Gerencie os acessos e permissões da equipe.</p>
        </div>
        <Link
          href="/admin/administradores/novo"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-extrabold rounded-lg text-black bg-[#C2AE82] hover:bg-[#a8956b] shadow-lg transition-all flex-shrink-0"
        >
          <Plus size={20} className="mr-2" strokeWidth={2.5} /> Novo Admin
        </Link>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden">
        {carregando ? (
          <div className="py-20 flex justify-center items-center gap-3 text-[#C2AE82] font-bold tracking-widest uppercase">
            <div className="w-8 h-8 border-4 border-[#C2AE82] border-t-transparent rounded-full animate-spin"></div>
            Carregando administradores...
          </div>
        ) : admins.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="mb-4 text-neutral-600">
              <ShieldCheck size={56} strokeWidth={1.5} />
            </div>
            <p className="text-gray-300 font-bold text-lg">Nenhum administrador encontrado</p>
          </div>
        ) : (
          <>
            {/* mobile */}
            <div className="md:hidden flex flex-col divide-y divide-neutral-800">
              {admins.map((admin) => (
                <div
                  key={admin.lookupId}
                  onClick={() => irParaEdicao(admin.lookupId)}
                  className="p-5 flex flex-col gap-4 active:bg-neutral-800/80 transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-800 text-[#C2AE82] flex items-center justify-center font-extrabold border border-neutral-700 flex-shrink-0 shadow-sm">
                        {admin.nome.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-extrabold text-base truncate">{admin.nome}</p>
                        <span className="bg-neutral-800 text-gray-300 border border-neutral-700 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide mt-1 inline-block">
                          {formatarCargo(admin.cargo)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAdminParaExcluir(admin);
                        setIsModalExclusaoAberto(true);
                      }}
                      disabled={usuario.lookupId === admin.lookupId}
                      className="p-2 bg-neutral-800 text-gray-400 rounded-lg hover:bg-red-950/30 hover:text-red-500 transition-colors border border-neutral-700 hover:border-red-900/50 shadow-sm flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-neutral-800 disabled:hover:text-gray-400 disabled:hover:border-neutral-700"
                    >
                      <Trash2 size={18} strokeWidth={2} />
                    </button>
                  </div>

                  <div className="space-y-1.5 pl-1">
                    <p className="text-sm text-gray-300 flex items-center gap-2">
                      <Mail size={14} className="text-gray-500" /> {admin.email}
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      {admin.permissaoTotal ? (
                        <span className="text-green-500 font-bold flex items-center gap-1">
                          <ShieldCheck size={14} /> Permissão Total
                        </span>
                      ) : (
                        <span className="text-gray-400 font-bold flex items-center gap-1">
                          <ShieldAlert size={14} /> Permissão Restrita
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center justify-end text-xs text-gray-400 pt-3 border-t border-neutral-800/50">
                    <span className="flex items-center gap-1 text-gray-500 group-hover:text-[#C2AE82] transition-colors">
                      <Edit size={14} /> Clique para editar
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400 border-collapse">
                <thead className="bg-black/50 text-xs uppercase text-gray-500 border-b border-neutral-800">
                  <tr>
                    <th className="px-6 py-4 font-bold">Administrador</th>
                    <th className="px-6 py-4 font-bold">Cargo</th>
                    <th className="px-6 py-4 font-bold">Acesso</th>
                    <th className="px-6 py-4 font-bold text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {admins.map((admin) => (
                    <tr
                      key={admin.lookupId}
                      onClick={() => irParaEdicao(admin.lookupId)}
                      className="hover:bg-neutral-800/50 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-neutral-800 text-[#C2AE82] flex items-center justify-center font-extrabold border border-neutral-700 shadow-sm">
                            {admin.nome.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-100">{admin.nome}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                              <Mail size={10} /> {admin.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-neutral-800 text-gray-300 border border-neutral-700 px-3 py-1 rounded-full text-ls font-bold tracking-wide">
                          {formatarCargo(admin.cargo)}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {admin.permissaoTotal ? (
                          <span className="text-green-500 font-bold text-sm flex items-center gap-1.5">
                            <ShieldCheck size={16} /> Total
                          </span>
                        ) : (
                          <span className="text-gray-400 font-bold text-sm flex items-center gap-1.5">
                            <ShieldAlert size={16} /> Restrita
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            irParaEdicao(admin.lookupId);
                          }}
                          className="p-2 bg-neutral-800 text-gray-400 rounded-lg hover:text-white hover:bg-neutral-700 transition-colors border border-neutral-700 shadow-sm group-hover:border-[#C2AE82]/50 group-hover:text-[#C2AE82]"
                          title="Editar Permissões"
                        >
                          <Edit size={18} strokeWidth={2} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setAdminParaExcluir(admin);
                            setIsModalExclusaoAberto(true);
                          }}
                          disabled={usuario.lookupId === admin.lookupId}
                          className="p-2 bg-neutral-800 text-gray-400 rounded-lg hover:bg-red-950/30 hover:text-red-500 transition-colors border border-neutral-700 hover:border-red-900/50 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-neutral-800 disabled:hover:text-gray-400 disabled:hover:border-neutral-700"
                          title="Excluir Administrador"
                        >
                          <Trash2 size={18} strokeWidth={2} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <ModalExclusao
        isOpen={isModalExclusaoAberto}
        onClose={() => setIsModalExclusaoAberto(false)}
        onConfirm={confirmarExclusao}
        titulo="Remover Administrador?"
        mensagem={
          <p>
            Tem certeza que deseja revogar o acesso de <span className="text-white font-bold">"{adminParaExcluir?.nome}"</span>? Esta ação não pode ser desfeita.
          </p>
        }
      />
    </div>
  );
}