'use client';

import { useState, useEffect } from 'react';
import { api } from "@/lib/api";
import toast from 'react-hot-toast';

interface ModalEditarPerfilProps {
  isOpen: boolean;
  onClose: () => void;
  lookupId: string;
  dadosAtuais: {
    nome: string;
    cpf: string;
    telefone: string;
  };
  aoSalvarComSucesso: (dadosAtualizados: { nome: string; cpf: string; telefone: string }) => void;
}

export default function ModalEditarPerfil({
  isOpen,
  onClose,
  lookupId,
  dadosAtuais,
  aoSalvarComSucesso
}: ModalEditarPerfilProps) {

  const [tempNome, setTempNome] = useState('');
  const [tempCpf, setTempCpf] = useState('');
  const [tempTelefone, setTempTelefone] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTempNome(dadosAtuais.nome);
      setTempCpf(dadosAtuais.cpf);
      setTempTelefone(dadosAtuais.telefone);
    }
  }, [isOpen, dadosAtuais]);

  if (!isOpen) return null;

  const aplicarMascaraCpf = (valor: string) => {
    let v = valor.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
  };

  const aplicarMascaraTelefone = (valor: string) => {
    let v = valor.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    if (v.length > 13) {
      v = v.replace(/(\d{5})(\d)/, "$1-$2");
    } else {
      v = v.replace(/(\d{4})(\d)/, "$1-$2");
    }
    return v;
  };

  const executarAtualizacaoPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
       const dadosAtualizados = { nome: tempNome, cpf: tempCpf, telefone: tempTelefone };
       const response = await api.put(`/clientes/${lookupId}`, dadosAtualizados);

       if(response.status == 200 || response.status == 204){
           aoSalvarComSucesso(dadosAtualizados);
           toast.success("Perfil atualizado com sucesso!");
           onClose();
       }
    } catch(error: any){
        console.error("Erro ao atualizar o perfil:", error.response?.data || error.message);
        toast.error("Erro ao atualizar perfil");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border-t-4 border-t-[#C2AE82] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">

        <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Editar Perfil</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>

        <div className="p-6">
          <form id="form-perfil" onSubmit={executarAtualizacaoPerfil} className="space-y-4">

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-1">Nome Completo</label>
              <input type="text" value={tempNome} onChange={(e) => setTempNome(e.target.value)} required className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none transition" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-1">CPF</label>
              <input type="text" value={tempCpf} onChange={(e) => setTempCpf(aplicarMascaraCpf(e.target.value))} maxLength={14} required placeholder="000.000.000-00" className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none transition" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-1">Telefone / WhatsApp</label>
              <input type="text" value={tempTelefone} onChange={(e) => setTempTelefone(aplicarMascaraTelefone(e.target.value))} maxLength={15} required placeholder="(00) 00000-0000" className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none transition" />
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-neutral-800 flex justify-end gap-3 bg-neutral-950">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg font-bold text-gray-400 hover:text-white hover:bg-neutral-800 transition">Cancelar</button>
          <button type="submit" form="form-perfil" className="px-5 py-2 rounded-lg font-bold bg-[#C2AE82] text-black hover:bg-[#a69265] transition shadow-lg">Salvar Alterações</button>
        </div>

      </div>
    </div>
  );
}