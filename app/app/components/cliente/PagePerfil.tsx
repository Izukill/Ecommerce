'use client';

import { useState,useEffect } from 'react';
import { api } from "@/lib/api";
import ModalEditarEndereco, { Endereco } from "@/app/components/endereco/ModalEditarEndereco";
import ModalExclusao from "@/app/components/layout/ModalExclusao";

export default function AbaPerfil({ usuarioAuth }: { usuarioAuth: any }) {

  const [carregando, setCarregando] = useState(true);
  const [lookupID, setlookupID] = useState("");

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [enderecoEditando, setEnderecoEditando] = useState<Endereco | null>(null);
  const [enderecoExcluindo, setEnderecoExcluindo] = useState<Endereco | null>(null);

  const aplicarMascaraCpf = (valor: string) => {
    let v = valor.replace(/\D/g, "");
    if (v.length > 11) {
      v = v.slice(0, 11);
    }
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
  };

  const aplicarMascaraTelefone = (valor: string) => {
    let v = valor.replace(/\D/g, "");
    if (v.length > 11) {
      v = v.slice(0, 11);
    }
    //dd
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");

    //hifens
    if (v.length > 13) {
      // Formato para celular (11 dígitos no total)
      v = v.replace(/(\d{5})(\d)/, "$1-$2");
    } else {
      // Formato para fixo (10 dígitos no total)
      v = v.replace(/(\d{4})(\d)/, "$1-$2");
    }
    return v;
  };

  //Busca os dados assim que a aba abre
  useEffect(() => {
    const buscarDados = async () => {
      try {
        const response = await api.get('/clientes/me');
        const dadosDoBanco = response.data;

        setEmail(dadosDoBanco.email || '');
        setNome(dadosDoBanco.nome || '');
        setCpf(dadosDoBanco.cpf || '');
        setTelefone(dadosDoBanco.telefone || '');
        setlookupID(dadosDoBanco.lookupID);

        const resEnderecos = await api.get('/enderecos/meus-enderecos');
        setEnderecos(resEnderecos.data);

      } catch (error) {
        console.error("Erro na API:", error.response?.status, error.response?.data || error.message);
      } finally {
        setCarregando(false);
      }
    };

    buscarDados();
  }, []);

  const excluirEndereco = async (e: React.FormEvent) => {
    if (!enderecoExcluindo) return;

    try {
        await api.delete(`/enderecos/${enderecoExcluindo.lookupID}`);
        setEnderecos(enderecos.filter(end => end.lookupID !== enderecoExcluindo.lookupID));


        setEnderecoExcluindo(null);
    } catch (error) {
        console.error("Erro ao excluir:", error.response?.status, error.response?.data || error.message);
        alert("Erro ao excluir endereço. :(");
    }
  };

  const handleSalvarDados = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
       const dadosAtualizados = {

           nome: nome,
           cpf: cpf,
           telefone: telefone,
       };

       const response = await api.put(`/clientes/${lookupID}`, dadosAtualizados);

       if(response.status== 200 || response.status== 204){
           alert("Perfil atualizado com sucesso ✅");
       }

    }catch(error: any){
        console.error("Erro ao atualizar o perfil:", error.response?.data || error.message);
        alert("Erro ao atualizar perfil ❌");
    }
  };

  if (carregando) {
    return <div className="text-[#C2AE82] text-center mt-10 animate-pulse">Buscando seus dados...</div>;
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-300">

      {/* SEÇÃO DE DADOS PESSOAIS */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-neutral-800 pb-4">Dados Pessoais</h2>
        <form onSubmit={handleSalvarDados} className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <div className="sm:col-span-2">
            <label className="block text-sm font-bold text-gray-400 mb-1">E-mail (Não alterável)</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-gray-500 cursor-not-allowed outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-bold text-gray-400 mb-1">Nome Completo</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">CPF</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(aplicarMascaraCpf(e.target.value))}
              maxLength={14}
              placeholder="000.000.000-00"
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">Telefone / WhatsApp</label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(aplicarMascaraTelefone(e.target.value))}
              maxLength={15}
              placeholder="(00) 00000-0000"
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none transition"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end mt-2">
            <button type="submit" className="bg-[#C2AE82] text-black font-bold px-6 py-3 rounded-lg hover:bg-[#a69265] transition shadow-lg">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>

      {/* SEÇÃO DE ENDEREÇOS */}
      <div>
        <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
          <h2 className="text-2xl font-bold text-white">Meus Endereços</h2>
          <button className="text-sm font-bold text-[#C2AE82] hover:text-white transition flex items-center gap-1">
            <span>+</span> Novo Endereço
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enderecos.map((end) => (
            <div key={end.lookupID} className="bg-neutral-900 border border-neutral-700 rounded-xl p-5 hover:border-[#C2AE82] transition-colors relative group">
              <p className="font-bold text-white mb-1">{end.rua}, {end.numero}</p>
              <p className="text-sm text-gray-400">{end.bairro} - {end.cidade}/{end.estado}</p>
              <p className="text-sm text-gray-500 mt-2">CEP: {end.cep}</p>

              <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                 onClick={() => setEnderecoEditando(end)}
                 className="text-[#C2AE82] hover:text-white text-sm font-bold"
                 >Editar
                </button>
                <button onClick={() => setEnderecoExcluindo(end)} className="text-red-500 hover:text-red-400 text-sm font-bold">Excluir</button>
              </div>
              <ModalEditarEndereco
                       enderecoEditando={enderecoEditando}
                       setEnderecoEditando={setEnderecoEditando}
                       aoSalvarComSucesso={(enderecoAtualizado) => {
                          setEnderecos(enderecos.map(end =>
                              end.lookupID === enderecoAtualizado.lookupID ? enderecoAtualizado : end
                          ));
                       }}
              />

              <ModalExclusao
                      isOpen={!!enderecoExcluindo}
                      onClose={() => setEnderecoExcluindo(null)}
                      onConfirm={() => excluirEndereco()}
                      titulo="Excluir Endereço"
                      mensagem={
                        <span>
                          Tem certeza que deseja excluir o endereço <b>{enderecoExcluindo?.rua}, {enderecoExcluindo?.numero}</b>?<br/>
                          Esta ação não poderá ser desfeita.
                        </span>
                      }
              />


            </div>
          ))}
        </div>
      </div>
    </div>
  );
}