'use client';

import { useState,useEffect } from 'react';
import { api } from "@/lib/api";

export default function AbaPerfil({ usuarioAuth }: { usuarioAuth: any }) {

  const [carregando, setCarregando] = useState(true);
  const [lookupId, setLookupId] = useState(""); // Precisamos guardar o ID para o botão "Salvar" depois

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');

  // Por enquanto endereços fixos, depois faremos a rota deles
  const [enderecos, setEnderecos] = useState([
    { id: 1, rua: 'Av. Paulista', numero: '1000', bairro: 'Bela Vista', cidade: 'São Paulo', estado: 'SP', cep: '01310-100' }
  ]);

  //Busca os dados assim que a aba abre
  useEffect(() => {
    const buscarMeusDados = async () => {
      try {
        const token = localStorage.getItem('token'); // Pegando o JWT
        if (!token) return;

        // Bate na nossa nova rota do Java
        const response = await api.get('http://localhost:8080/clientes/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const dadosDoBanco = await response.json();
          // Preenche os inputs com o que veio do banco!
          setNome(dadosDoBanco.nome || '');
          setCpf(dadosDoBanco.cpf || '');
          setTelefone(dadosDoBanco.telefone || '');
          setLookupId(dadosDoBanco.lookupId);
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarMeusDados();
  }, []);

  //TODO implementar a rota put para atualizar os dados
  const handleSalvarDados = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Pronto para enviar o PUT para /clientes/${lookupId}`);
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
              value={usuarioAuth?.email || ''}
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
              onChange={(e) => setCpf(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">Telefone / WhatsApp</label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
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

      {/* SEÇÃO DE ENDEREÇOS (Permanece igual por enquanto) */}
      <div>
        <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
          <h2 className="text-2xl font-bold text-white">Meus Endereços</h2>
          <button className="text-sm font-bold text-[#C2AE82] hover:text-white transition flex items-center gap-1">
            <span>+</span> Novo Endereço
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enderecos.map((end) => (
            <div key={end.id} className="bg-neutral-900 border border-neutral-700 rounded-xl p-5 hover:border-[#C2AE82] transition-colors relative group">
              <p className="font-bold text-white mb-1">{end.rua}, {end.numero}</p>
              <p className="text-sm text-gray-400">{end.bairro} - {end.cidade}/{end.estado}</p>
              <p className="text-sm text-gray-500 mt-2">CEP: {end.cep}</p>

              <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-[#C2AE82] hover:text-white text-sm font-bold">Editar</button>
                <button className="text-red-500 hover:text-red-400 text-sm font-bold">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}