'use client';

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import ModalExclusao from "@/app/components/ModalExclusao";

interface Categoria {
  lookupId: string;
  nome: string;
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregar, setErroCarregar] = useState("");

  const [nomeNovaCategoria, setNomeNovaCategoria] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erroSalvar, setErroSalvar] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);

  // ==========================================
  // Controle do Modal Externalizado
  // ==========================================
  const [isModalExclusaoAberto, setIsModalExclusaoAberto] = useState(false);
  const [categoriaParaExcluir, setCategoriaParaExcluir] = useState<Categoria | null>(null);

  const carregarCategorias = async () => {
    try {
      const response = await api.get("/categorias");
      if (response.data && Array.isArray(response.data.content)) {
        setCategorias(response.data.content);
      } else if (Array.isArray(response.data)) {
        setCategorias(response.data);
      } else {
        setCategorias([]);
      }
    } catch (error) {
      setErroCarregar("Não foi possível carregar as categorias.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

// ==========================================
  // FUNÇÃO AUXILIAR: Formatar nome (Capitalize)
  // Ex: "moda praia" -> "Moda Praia"
  // ==========================================
  const formatarNomeCategoria = (texto: string) => {
    return texto
      .trim()
      .split(/\s+/) // Divide as palavras considerando um ou mais espaços
      .map(palavra => {
        // Ignora palavras vazias se houver múltiplos espaços
        if (palavra.length === 0) return "";
        return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
      })
      .join(" ");
  };

  const handleSalvarCategoria = async (e: FormEvent) => {
    e.preventDefault();
    setErroSalvar("");
    setSucesso(false);

    const nomeDigitado = nomeNovaCategoria.trim();

    if (!nomeDigitado) {
      setErroSalvar("O nome da categoria é obrigatório.");
      return;
    }

    const nomeFormatado = formatarNomeCategoria(nomeDigitado);

    //validação Inteligente (Ignora maiúsculas e espaços)
    const nomeLimpoDigitado = nomeDigitado.toLowerCase().replace(/\s+/g, '');
    const categoriaDuplicada = categorias.find(cat => {
      if (categoriaEditando && cat.lookupId === categoriaEditando.lookupId) return false;
      const nomeLimpoExistente = cat.nome.toLowerCase().replace(/\s+/g, '');
      return nomeLimpoDigitado === nomeLimpoExistente;
    });

    if (categoriaDuplicada) {
      setErroSalvar(`A categoria "${categoriaDuplicada.nome}" já existe. Evite nomes repetidos ou muito parecidos.`);
      return;
    }

    setSalvando(true);

    try {
      if (categoriaEditando) {
        // Envia o nomeFormatado para a API
        await api.put(`/categorias/${categoriaEditando.lookupId}`, { nome: nomeFormatado });
      } else {
        // Envia o nomeFormatado para a API
        await api.post("/categorias", { nome: nomeFormatado });
      }

      setSucesso(true);
      cancelarEdicao();
      carregarCategorias();

      setTimeout(() => setSucesso(false), 3000);
    } catch (error: any) {
      setErroSalvar("Erro ao salvar a categoria. Verifique e tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  const iniciarEdicao = (categoria: Categoria) => {
    setCategoriaEditando(categoria);
    setNomeNovaCategoria(categoria.nome);
    setErroSalvar("");
    setSucesso(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicao = () => {
    setCategoriaEditando(null);
    setNomeNovaCategoria("");
    setErroSalvar("");
  };

  const abrirModalExclusao = (categoria: Categoria) => {
    setCategoriaParaExcluir(categoria);
    setIsModalExclusaoAberto(true);
  };

  const fecharModalExclusao = () => {
    setIsModalExclusaoAberto(false);
    setCategoriaParaExcluir(null);
  };

  const confirmarExclusao = async () => {
    if (!categoriaParaExcluir) return;

    try {
      await api.delete(`/categorias/${categoriaParaExcluir.lookupId}`);
      setCategorias(categorias.filter(c => c.lookupId !== categoriaParaExcluir.lookupId));
      fecharModalExclusao();
    } catch (error) {
      alert("Erro ao excluir. Essa categoria já deve estar vinculada a algum produto.");
      fecharModalExclusao();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative">

      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Categorias</h2>
        <p className="text-sm text-gray-400 mt-1">Crie e gerencie as categorias dos seus produtos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* COLUNA ESQUERDA: Formulário */}
        <div className="lg:col-span-1">
          <div className="bg-black p-6 rounded-xl shadow-2xl border-t-4 border-[#C2AE82] sticky top-8">
            <h3 className="text-lg font-bold text-white mb-4">
              {categoriaEditando ? "Editar Categoria" : "Nova Categoria"}
            </h3>

            <form onSubmit={handleSalvarCategoria} className="space-y-4">
              {erroSalvar && (
                <div className="bg-red-950/50 border-l-4 border-red-500 p-3 rounded-md">
                  <p className="text-xs text-red-200 font-semibold">{erroSalvar}</p>
                </div>
              )}

              {sucesso && (
                <div className="bg-green-950/50 border-l-4 border-green-500 p-3 rounded-md">
                  <p className="text-xs text-green-200 font-semibold">Salva com sucesso!</p>
                </div>
              )}

              <div>
                <label htmlFor="nomeCategoria" className="block text-sm font-bold text-gray-100">Nome *</label>
                <input
                  id="nomeCategoria" type="text" required
                  className="mt-1 appearance-none rounded-lg block w-full px-4 py-3 border border-neutral-700 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C2AE82] focus:border-transparent bg-neutral-900 sm:text-sm transition-all"
                  placeholder="Ex: Moda Praia"
                  value={nomeNovaCategoria} onChange={(e) => setNomeNovaCategoria(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <button
                  type="submit" disabled={salvando}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-extrabold rounded-lg text-black bg-[#C2AE82] hover:bg-[#a8956b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C2AE82] focus:ring-offset-black disabled:opacity-50 transition-all shadow-lg"
                >
                  {salvando ? "Salvando..." : (categoriaEditando ? "Atualizar" : "Criar Categoria")}
                </button>

                {categoriaEditando && (
                  <button
                    type="button" onClick={cancelarEdicao}
                    className="w-full flex justify-center py-3 px-4 border border-neutral-700 text-sm font-bold rounded-lg text-gray-300 bg-transparent hover:bg-neutral-800 transition-all"
                  >
                    Cancelar Edição
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* COLUNA DIREITA: Tabela de Listagem */}
        <div className="lg:col-span-2">
          {erroCarregar && (
            <div className="bg-red-950/50 border-l-4 border-red-500 p-4 rounded-md mb-4">
              <p className="text-sm text-red-200 font-semibold">{erroCarregar}</p>
            </div>
          )}

          <div className="bg-black rounded-xl shadow-2xl border border-neutral-800 overflow-hidden">
            {carregando ? (
              <div className="p-10 text-center text-[#C2AE82] font-bold tracking-widest uppercase animate-pulse">
                Carregando categorias...
              </div>
            ) : categorias.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center">
                <span className="text-4xl mb-4">:(</span>
                <p className="text-gray-300 font-bold text-lg">Nenhuma categoria cadastrada</p>
                <p className="text-gray-500 text-sm mt-1">Use o formulário ao lado para criar a primeira.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-900 border-b border-neutral-800 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Nome</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {categorias.map((categoria) => (
                      <tr key={categoria.lookupId} className="hover:bg-neutral-900/50 transition-colors">

                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            href={`/admin/produtos?categoria=${categoria.nome}`}
                            title="Ver produtos desta categoria"
                            className="text-lg font-bold text-gray-100 hover:text-[#C2AE82] transition-colors cursor-pointer inline-block"
                          >
                            {categoria.nome}
                          </Link>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {categoria.lookupId}</p>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                          <button
                            onClick={() => iniciarEdicao(categoria)}
                            className="text-gray-400 hover:text-white transition-colors inline-block"
                            title="Editar Categoria"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => abrirModalExclusao(categoria)}
                            className="text-red-500 hover:text-red-400 transition-colors inline-block"
                            title="Excluir Categoria"
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
        </div>
      </div>

      {/* USO DO COMPONENTE EXTERNALIZADO */}
      <ModalExclusao
        isOpen={isModalExclusaoAberto}
        onClose={fecharModalExclusao}
        onConfirm={confirmarExclusao}
        titulo="Excluir Categoria?"
        mensagem={
          <>
            Tem certeza que deseja excluir a categoria <span className="text-white font-bold">"{categoriaParaExcluir?.nome}"</span>? Esta ação não poderá ser desfeita.
          </>
        }
      />

    </div>
  );
}