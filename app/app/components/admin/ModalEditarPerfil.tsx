'use client';

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api"; // Ajuste o caminho conforme o seu projeto
import { X, User, Save } from "lucide-react";

interface ModalEditarPerfilProps {
  isOpen: boolean;
  onClose: () => void;
  lookupId: string;
  nomeAtual: string; // Como admin só muda o nome, simplificamos aqui
  aoSalvarComSucesso: (novoNome: string) => void;
}

export default function ModalEditarPerfil({
  isOpen,
  onClose,
  lookupId,
  nomeAtual,
  aoSalvarComSucesso
}: ModalEditarPerfilProps) {

  // Usamos tempNome igual você fez no cliente
  const [tempNome, setTempNome] = useState('');
  const [carregando, setCarregando] = useState(false);

  // O useEffect garante que o input sempre tenha o nome correto quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      setTempNome(nomeAtual);
    }
  }, [isOpen, nomeAtual]);

  if (!isOpen) return null;

  const executarAtualizacaoPerfil = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tempNome.trim() || tempNome.trim().length < 3) {
      toast.error("O nome deve ter no mínimo 3 caracteres.");
      return;
    }

    setCarregando(true);
    const toastId = toast.loading("Salvando alterações...");

    try {
      // Bate na API usando o tempNome
      const response = await api.put(`/admin/${lookupId}`, { nome: tempNome });

      if (response.status === 200 || response.status === 204) {
        // Devolve o novo nome para a Header do AdminLayout atualizar
        aoSalvarComSucesso(tempNome);
        toast.success("Perfil atualizado com sucesso!", { id: toastId });
        onClose();
      }
    } catch (error: any) {
      console.error("Erro ao atualizar o perfil:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Erro ao atualizar perfil.", { id: toastId });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border-t-4 border-t-[#C2AE82] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in scale-in duration-200">

        {/* Header do Modal */}
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
          <div className="flex items-center gap-3 text-white">
            <User className="text-[#C2AE82]" />
            <h3 className="text-xl font-bold">Meus Dados</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors bg-neutral-800 p-1.5 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6">
          <form id="form-perfil-admin" onSubmit={executarAtualizacaoPerfil} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={tempNome}
                onChange={(e) => setTempNome(e.target.value)}
                placeholder="Digite seu nome completo"
                className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white font-medium placeholder:text-neutral-700 focus:border-[#C2AE82] focus:ring-1 focus:ring-[#C2AE82] transition-colors outline-none"
                disabled={carregando}
                required
              />
            </div>

            <p className="text-xs text-gray-600 bg-neutral-800/50 p-3 rounded-lg border border-neutral-800 leading-relaxed font-mono">
              Você está editando os dados do perfil Administrativo da MirlleFitness. Certifique-se de usar um nome identificável.
            </p>
          </form>
        </div>

        {/* Footer do Modal */}
        <div className="p-6 border-t border-neutral-800 flex justify-end gap-3 bg-neutral-950">
          <button
            type="button"
            onClick={onClose}
            disabled={carregando}
            className="px-5 py-2.5 bg-neutral-800 text-gray-300 font-bold rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="form-perfil-admin" // Conecta este botão ao formulário acima
            disabled={carregando}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#C2AE82] text-black font-extrabold rounded-lg hover:bg-[#a8956b] transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105 shadow-lg"
          >
            {carregando ? (
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Save size={18} />
            )}
            {carregando ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>

      </div>
    </div>
  );
}