'use client';

import { useState, useEffect } from 'react';
import { api } from "@/lib/api";
import toast from 'react-hot-toast';

import ModalEditarPerfil from "@/app/components/cliente/ModalEditarPerfil";
import ModalEditarEndereco, { Endereco } from "@/app/components/endereco/ModalEditarEndereco";
import ModalExclusao from "@/app/components/layout/ModalExclusao";
import ModalCriarEndereco from "@/app/components/endereco/ModalCriarEndereco";

export default function AbaPerfil({ usuarioAuth }: { usuarioAuth: any }) {

  const [carregando, setCarregando] = useState(true);
  const [lookupId, setlookupId] = useState("");

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);

  const [enderecoEditando, setEnderecoEditando] = useState<Endereco | null>(null);
  const [enderecoExcluindo, setEnderecoExcluindo] = useState<Endereco | null>(null);
  const [enderecoCriando, setEnderecoCriando] = useState<any | null>(null);
  const [isModalPerfilAberto, setIsModalPerfilAberto] = useState(false);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const response = await api.get('/clientes/me');
        const dadosDoBanco = response.data;

        setEmail(dadosDoBanco.email || '');
        setNome(dadosDoBanco.nome || '');
        setCpf(dadosDoBanco.cpf || '');
        setTelefone(dadosDoBanco.telefone || '');
        setlookupId(dadosDoBanco.lookupId);

        const resEnderecos = await api.get('/enderecos/meus-enderecos');
        console.log(resEnderecos)
        setEnderecos(resEnderecos.data);

      } catch (error: any) {
        console.error("Erro na API:", error.response?.status, error.response?.data || error.message);
      } finally {
        setCarregando(false);
      }
    };

    buscarDados();
  }, []);

  const excluirEndereco = async () => {
    if (!enderecoExcluindo) return;

    const idParaDeletar = enderecoExcluindo.lookupId;

    try {
        await api.delete(`/enderecos/${idParaDeletar}`);
        setEnderecos((listaAnterior) => listaAnterior.filter(end =>
            end.lookupId !== idParaDeletar
        ));
        setEnderecoExcluindo(null);
        toast.success("Endereço excluído com sucesso!");
    } catch (error: any) {
        console.error("Erro ao excluir:", error.response?.status, error.response?.data || error.message);
        toast.error("Não foi possível excluir este endereço.");
    }
  };

  if (carregando) {
    return <div className="text-[#C2AE82] text-center mt-10 animate-pulse">Buscando seus dados...</div>;
  }

  return (
    <div className="animate-in fade-in duration-300 relative">
      <div className="bg-neutral-900/00 shadow-xl">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Dados Pessoais</h2>
            <button
              onClick={() => setIsModalPerfilAberto(true)}
              className="text-sm font-bold text-[#C2AE82] border rounded-md p-2 border-solid hover:text-white transition flex items-center gap-1"
            >
              Editar Dados
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-500 mb-1">E-mail</label>
              <p className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-gray-300">{email || '—'}</p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-500 mb-1">Nome Completo</label>
              <p className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white">{nome || '—'}</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-500 mb-1">CPF</label>
              <p className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white">{cpf || '—'}</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-500 mb-1">Telefone / WhatsApp</label>
              <p className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white">{telefone || '—'}</p>
            </div>
          </div>
        </div>

        <hr className="border-neutral-800 my-10" />

        <div>
          <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Meus Endereços</h2>
              <button onClick={() => setEnderecoCriando({ cep: '', rua: '', bairro: '', numero: '', cidade: '', estado: '', complemento: '' })} className="text-sm font-bold text-[#C2AE82] border rounded-md p-2 border-solid hover:text-white transition flex items-center gap-1">
                <span>+</span> Novo Endereço
              </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enderecos.map((end) => (
              <div key={end.lookupId} className="bg-neutral-900 border border-neutral-700 rounded-xl p-5 hover:border-[#C2AE82] transition-colors relative group">
                <p className="font-bold text-white mb-1">{end.rua}, {end.numero}</p>
                <p className="text-sm text-gray-400">{end.bairro} - {end.cidade}/{end.estado}</p>
                <p className="text-sm text-gray-500 mt-2">CEP: {end.cep}</p>

              <div className="mt-4 pt-3 border-t border-neutral-800 sm:border-transparent sm:pt-0 sm:mt-0 sm:absolute sm:top-4 sm:right-4 flex gap-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEnderecoEditando(end)} className="text-[#C2AE82] hover:text-white text-sm font-bold uppercase tracking-wider sm:normal-case sm:tracking-normal">Editar</button>
                  <button onClick={() => setEnderecoExcluindo(end)} className="text-red-500 hover:text-red-400 text-sm font-bold uppercase tracking-wider sm:normal-case sm:tracking-normal">Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ModalEditarPerfil
         isOpen={isModalPerfilAberto}
         onClose={() => setIsModalPerfilAberto(false)}
         lookupId={lookupId}
         dadosAtuais={{ nome, cpf, telefone }}
         aoSalvarComSucesso={(dadosAtualizados) => {
            setNome(dadosAtualizados.nome);
            setCpf(dadosAtualizados.cpf);
            setTelefone(dadosAtualizados.telefone);
         }}
      />
      <ModalEditarEndereco
         enderecosAtuais={enderecos}
         enderecoEditando={enderecoEditando}
         setEnderecoEditando={setEnderecoEditando}
         aoSalvarComSucesso={(enderecoAtualizado) => {
            setEnderecos(enderecos.map(end => end.lookupId === enderecoAtualizado.lookupId ? enderecoAtualizado : end));
         }}
      />
      <ModalExclusao
          isOpen={!!enderecoExcluindo}
          onClose={() => setEnderecoExcluindo(null)}
          onConfirm={excluirEndereco}
          titulo="Excluir Endereço"
          mensagem={
            <span>
              Tem certeza que deseja excluir o endereço <b>{enderecoExcluindo?.rua}, {enderecoExcluindo?.numero}</b>?<br/>Esta ação não poderá ser desfeita.
            </span>
          }
      />
      <ModalCriarEndereco
          enderecosAtuais={enderecos}
          enderecoCriando={enderecoCriando}
          setEnderecoCriando={setEnderecoCriando}
          aoSalvarComSucesso={(novoEndereco) => {
            setEnderecos([...enderecos, novoEndereco]);
          }}
      />
    </div>
  );
}