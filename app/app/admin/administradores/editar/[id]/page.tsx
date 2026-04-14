'use client';

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";
import { ArrowLeft, Save, ShieldAlert } from "lucide-react";
import { toast } from "react-hot-toast";

export default function EditarAdministradorPage() {
  const router = useRouter();
  const params = useParams();
  const { usuario } = useAuth();

  const idEdicao = params?.id as string;

  const [salvando, setSalvando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);

  const [isUltimoSuperAdmin, setIsUltimoSuperAdmin] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cargo: "FUNCIONARIO",
    permissaoTotal: true,
    pedidosPage: true,
    produtosPage: true,
    categoriasPage: true,
    clientePage: true,
    relatoriosPage: true,
  });

  useEffect(() => {
    if (usuario && !usuario.permissaoTotal) {
      router.push("/admin");
    }
  }, [usuario, router]);

  useEffect(() => {
    if (idEdicao && usuario?.permissaoTotal) {
      const buscarDados = async () => {
        try {
          const [resAdmin, resTodos] = await Promise.all([
            api.get(`/admin/${idEdicao}`),
            api.get('/admin')
          ]);

          const adminAtual = resAdmin.data;
          const todosAdmins = resTodos.data.content || resTodos.data;

          const superAdmins = todosAdmins.filter((a: any) => a.permissaoTotal);

          if (superAdmins.length === 1 && superAdmins[0].lookupId === idEdicao) {
            setIsUltimoSuperAdmin(true);
          }

          setFormData({
            ...adminAtual,
            senha: "" // Deixa a senha em branco na tela
          });

        } catch (error) {
          toast.error("Erro ao carregar dados do administrador.");
          router.push("/admin/administradores");
        } finally {
          setCarregandoDados(false);
        }
      };
      buscarDados();
    }
  }, [idEdicao, usuario, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;

      if (name === "permissaoTotal" && isUltimoSuperAdmin && !checked) {
        toast.error("Ação Bloqueada: O sistema precisa ter pelo menos um administrador com permissão total.");
        return;
      }

      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    try {
      const payload = { ...formData };

      if (!payload.senha || payload.senha.trim() === "") {
        payload.senha = "ignore";
      }

      await api.put(`/admin/${idEdicao}`, payload);
      toast.success("Permissões atualizadas com sucesso!");
      router.push("/admin/administradores");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao salvar administrador.");
    } finally {
      setSalvando(false);
    }
  };

  if (!usuario?.permissaoTotal) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Link href="/admin/administradores" className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Editar Permissões</h2>
          <p className="text-sm text-gray-400 mt-1">Atualize as informações e permissões do administrador</p>
        </div>
      </div>

      {carregandoDados ? (
        <div className="py-10 text-center text-[#C2AE82]">Carregando dados...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 p-6 sm:p-8 rounded-xl shadow-lg space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Nome Completo</label>
                <input type="text" name="nome" required value={formData.nome} onChange={handleChange} className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white focus:ring-1 focus:ring-[#C2AE82] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">E-mail</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white focus:ring-1 focus:ring-[#C2AE82] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Nova Senha (deixe em branco para não alterar)</label>
                <input type="password" name="senha" value={formData.senha} onChange={handleChange} className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white focus:ring-1 focus:ring-[#C2AE82] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Cargo</label>
                <select name="cargo" value={formData.cargo} onChange={handleChange} className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white focus:ring-1 focus:ring-[#C2AE82] outline-none appearance-none transition-all cursor-pointer">
                  <option value="FUNCIONARIO">Funcionário</option>
                  <option value="DONO">Dono</option>
                </select>
              </div>
            </div>

            <hr className="border-neutral-800" />

            <div>
              <h3 className="text-lg font-bold text-white mb-4">Nível de Acesso</h3>
              <label className={`flex items-center justify-between gap-3 p-5 bg-black border border-[#C2AE82]/30 rounded-lg mb-6 transition-colors ${isUltimoSuperAdmin ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-neutral-950'}`}>
                <div>
                  <p className="text-white font-bold text-base">Permissão Total (Super Admin)</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {isUltimoSuperAdmin
                      ? "Este é o único administrador principal. A permissão não pode ser removida."
                      : "Garante acesso irrestrito a todas as áreas do sistema, incluindo a exclusão de outros administradores."}
                  </p>
                </div>
                <div className="relative inline-flex items-center flex-shrink-0">
                  <input type="checkbox" name="permissaoTotal" checked={formData.permissaoTotal} onChange={handleChange} className="sr-only peer" />
                  <div className={`w-11 h-6 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${formData.permissaoTotal ? 'bg-[#C2AE82] after:translate-x-full' : 'bg-neutral-700'}`}></div>
                </div>
              </label>

              {!formData.permissaoTotal && (
                <div className="bg-neutral-950 border border-neutral-800 p-5 rounded-lg animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 mb-4 text-[#C2AE82]">
                    <ShieldAlert size={18} />
                    <h4 className="font-bold text-sm uppercase tracking-wider">Acessos Específicos</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['pedidosPage', 'produtosPage', 'categoriasPage', 'clientePage', 'relatoriosPage'].map((page) => (
                      <label key={page} className="flex items-center justify-between p-3 bg-black border border-neutral-800 rounded-lg cursor-pointer hover:border-neutral-700 transition-colors">
                        <span className="font-medium text-gray-300 capitalize">Módulo de {page.replace('Page', '')}</span>
                        <div className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                          <input type="checkbox" name={page} checked={formData[page as keyof typeof formData] as boolean} onChange={handleChange} className="sr-only peer" />
                          <div className={`w-9 h-5 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all ${formData[page as keyof typeof formData] ? 'bg-[#C2AE82] after:translate-x-full' : 'bg-neutral-700'}`}></div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={salvando} className="flex items-center gap-2 px-8 py-3.5 bg-[#C2AE82] hover:bg-[#a8956b] text-black font-extrabold rounded-lg transition-colors shadow-lg disabled:opacity-50">
              {salvando ? "Salvando..." : <><Save size={20} /> Salvar Alterações</>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}