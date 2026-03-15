'use client';

import { useState, useEffect, FormEvent } from "react";
import { api } from "@/lib/api";
import ModalExclusao from "@/app/components/ModalExclusao";

export interface Cliente {
  lookupId: string;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  dataCriacao?: string;
}

export default function ListaClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // ==========================================
  // ESTADOS DOS FILTROS
  // ==========================================
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroEmail, setFiltroEmail] = useState("");
  const [filtroTelefone, setFiltroTelefone] = useState("");

  // ==========================================
  // ESTADOS DE PAGINAÇÃO
  // ==========================================
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const tamanhoPagina = 10;

  // ==========================================
  // ESTADOS DE EDIÇÃO (MODAL)
  // ==========================================
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [nomeEdicao, setNomeEdicao] = useState("");
  const [emailEdicao, setEmailEdicao] = useState("");
  const [telefoneEdicao, setTelefoneEdicao] = useState("");
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  // ==========================================
  // ESTADOS DE EXCLUSÃO
  // ==========================================
  const [isModalExclusaoAberto, setIsModalExclusaoAberto] = useState(false);
  const [clienteParaExcluir, setClienteParaExcluir] = useState<Cliente | null>(null);

  // ==========================================
  // CARREGAR DADOS
  // ==========================================
  const carregarClientes = async (pagina: number = 0) => {
    setCarregando(true);
    setErro("");

    try {
      const params = new URLSearchParams({
        page: pagina.toString(),
        size: tamanhoPagina.toString(),
        sort: 'dataCriacao,desc' // Traz os mais recentes primeiro
      });

      if (filtroNome) params.append("nome", filtroNome);
      if (filtroEmail) params.append("email", filtroEmail);
      if (filtroTelefone) params.append("telefone", filtroTelefone);

      // Assumindo que o endpoint no seu Java é /clientes ou /usuarios
      const response = await api.get(`/clientes?${params.toString()}`);

      const pageData = response.data;
      const dadosClientes = pageData.content || pageData || [];

      setClientes(Array.isArray(dadosClientes) ? dadosClientes : []);

      if (pageData.totalPages !== undefined) {
        setTotalPaginas(pageData.totalPages);
      }
    } catch (error) {
      setErro("Não foi possível carregar os clientes. Verifique a conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarClientes(paginaAtual);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginaAtual, filtroNome, filtroEmail, filtroTelefone]);

  useEffect(() => {
    setPaginaAtual(0);
  }, [filtroNome, filtroEmail, filtroTelefone]);

  // ==========================================
  // FUNÇÕES DE EDIÇÃO
  // ==========================================
  const abrirModalEdicao = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setNomeEdicao(cliente.nome);
    setEmailEdicao(cliente.email);
    setTelefoneEdicao(cliente.telefone || "");
  };

  const fecharModalEdicao = () => {
    setClienteEditando(null);
    setNomeEdicao("");
    setEmailEdicao("");
    setTelefoneEdicao("");
  };

  const handleSalvarEdicao = async (e: FormEvent) => {
    e.preventDefault();
    if (!clienteEditando) return;

    setSalvandoEdicao(true);
    try {
      await api.put(`/clientes/${clienteEditando.lookupId}`, {
        nome: nomeEdicao,
        email: emailEdicao,
        telefone: telefoneEdicao,
      });

      fecharModalEdicao();
      carregarClientes(paginaAtual); // Atualiza a lista
    } catch (error) {
      alert("Erro ao atualizar o cliente.");
    } finally {
      setSalvandoEdicao(false);
    }
  };

  // ==========================================
  // FUNÇÕES DE EXCLUSÃO
  // ==========================================
  const abrirModalExclusao = (cliente: Cliente) => {
    setClienteParaExcluir(cliente);
    setIsModalExclusaoAberto(true);
  };

  const confirmarExclusao = async () => {
    if (!clienteParaExcluir) return;

    try {
      await api.delete(`/clientes/${clienteParaExcluir.lookupId}`);
      carregarClientes(paginaAtual);
      setIsModalExclusaoAberto(false);
      setClienteParaExcluir(null);
    } catch (error) {
      alert("Erro ao excluir o cliente. Ele pode ter pedidos atrelados ao seu cadastro.");
      setIsModalExclusaoAberto(false);
    }
  };

  return (
    <div className="space-y-6 relative pb-10 max-w-7xl mx-auto">

      {/* CABEÇALHO */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Clientes</h2>
        <p className="text-sm text-gray-400 mt-1">Gerencie os cadastros e informações de contato.</p>
      </div>

      {erro && (
        <div className="bg-red-950/50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-sm text-red-200 font-semibold">{erro}</p>
        </div>
      )}

      {/* BARRA DE FILTROS */}
      <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-lg grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Buscar por Nome</label>
          <input
            type="text" placeholder="Ex: Maria Silva"
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-sm text-gray-100 focus:ring-1 focus:ring-[#C2AE82] outline-none transition-all"
            value={filtroNome} onChange={(e) => setFiltroNome(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Buscar por E-mail</label>
          <input
            type="email" placeholder="Ex: maria@email.com"
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-sm text-gray-100 focus:ring-1 focus:ring-[#C2AE82] outline-none transition-all"
            value={filtroEmail} onChange={(e) => setFiltroEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Buscar por Telefone</label>
          <input
            type="text" placeholder="Ex: (83) 9..."
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-sm text-gray-100 focus:ring-1 focus:ring-[#C2AE82] outline-none transition-all"
            value={filtroTelefone} onChange={(e) => setFiltroTelefone(e.target.value)}
          />
        </div>
      </div>

      {/* TABELA DE CLIENTES */}
      <div className="bg-black rounded-xl shadow-2xl border border-neutral-800 overflow-hidden">
        {carregando ? (
          <div className="py-20 flex justify-center items-center gap-3 text-[#C2AE82] font-bold tracking-widest uppercase">
            <div className="w-8 h-8 border-4 border-[#C2AE82] border-t-transparent rounded-full animate-spin"></div>
            Carregando clientes...
          </div>
        ) : clientes.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <span className="text-4xl mb-4">👥</span>
            <p className="text-gray-300 font-bold text-lg">Nenhum cliente encontrado</p>
            <p className="text-gray-500 text-sm mt-1">Sua busca não retornou resultados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900 border-b border-neutral-800 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Contato</th>
                  <th className="px-6 py-4">CPF / Data</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {clientes.map((cliente) => (
                  <tr key={cliente.lookupId} className="hover:bg-neutral-900/50 transition-colors">

                    {/* NOME */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-800 text-[#C2AE82] flex items-center justify-center font-extrabold border border-neutral-700">
                          {cliente.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-100">{cliente.nome}</p>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {cliente.lookupId.split("-")[0]}...</p>
                        </div>
                      </div>
                    </td>

                    {/* CONTATO */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-300 flex items-center gap-2">
                        ✉️ {cliente.email}
                      </p>
                      <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                        📞 {cliente.telefone || <span className="text-gray-600 italic">Não informado</span>}
                      </p>
                    </td>

                    {/* CPF / DATA */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-300 font-mono">
                        {cliente.cpf || <span className="text-gray-600 italic">CPF pendente</span>}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Cadastrado em: {cliente.dataCriacao ? new Date(cliente.dataCriacao).toLocaleDateString('pt-BR') : '-'}
                      </p>
                    </td>

                    {/* AÇÕES */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => abrirModalEdicao(cliente)}
                        className="text-gray-400 hover:text-white transition-colors inline-block"
                        title="Editar Cliente"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => abrirModalExclusao(cliente)}
                        className="text-red-500 hover:text-red-400 transition-colors inline-block"
                        title="Excluir Cliente"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PAGINAÇÃO */}
      {totalPaginas > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4 bg-neutral-900 p-4 rounded-xl border border-neutral-800">
          <button
            onClick={() => setPaginaAtual(prev => Math.max(0, prev - 1))}
            disabled={paginaAtual === 0 || carregando}
            className="px-4 py-2 text-sm font-bold bg-black text-[#C2AE82] border border-[#C2AE82]/30 rounded-lg disabled:opacity-30 transition-colors"
          >
            &larr; Anterior
          </button>
          <span className="text-gray-400 font-bold text-sm">
            Página <span className="text-white">{paginaAtual + 1}</span> de <span className="text-white">{totalPaginas}</span>
          </span>
          <button
            onClick={() => setPaginaAtual(prev => Math.min(totalPaginas - 1, prev + 1))}
            disabled={paginaAtual >= totalPaginas - 1 || carregando}
            className="px-4 py-2 text-sm font-bold bg-black text-[#C2AE82] border border-[#C2AE82]/30 rounded-lg disabled:opacity-30 transition-colors"
          >
            Próxima &rarr;
          </button>
        </div>
      )}

      {/* ================= MODAL DE EDIÇÃO INLINE ================= */}
      {clienteEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-neutral-900 border-t-4 border-[#C2AE82] rounded-xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-extrabold text-white mb-6">Editar Cliente</h3>

            <form onSubmit={handleSalvarEdicao} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Nome Completo</label>
                <input
                  type="text" required
                  className="w-full px-4 py-2.5 bg-black border border-neutral-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-[#C2AE82] outline-none"
                  value={nomeEdicao} onChange={(e) => setNomeEdicao(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">E-mail</label>
                <input
                  type="email" required
                  className="w-full px-4 py-2.5 bg-black border border-neutral-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-[#C2AE82] outline-none"
                  value={emailEdicao} onChange={(e) => setEmailEdicao(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Telefone</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-black border border-neutral-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-[#C2AE82] outline-none"
                  value={telefoneEdicao} onChange={(e) => setTelefoneEdicao(e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button" onClick={fecharModalEdicao} disabled={salvandoEdicao}
                  className="px-4 py-2 text-sm font-bold text-gray-300 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors border border-neutral-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit" disabled={salvandoEdicao}
                  className="px-4 py-2 text-sm font-bold text-black bg-[#C2AE82] rounded-lg hover:bg-[#a8956b] transition-colors shadow-lg disabled:opacity-50"
                >
                  {salvandoEdicao ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE EXCLUSÃO REUTILIZÁVEL */}
      <ModalExclusao
        isOpen={isModalExclusaoAberto}
        onClose={() => setIsModalExclusaoAberto(false)}
        onConfirm={confirmarExclusao}
        titulo="Excluir Cliente?"
        mensagem={
          <>
            Tem certeza que deseja apagar o cadastro de <span className="text-white font-bold">"{clienteParaExcluir?.nome}"</span>? Todo o histórico dele será perdido.
          </>
        }
      />

    </div>
  );
}