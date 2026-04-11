'use client';

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import ModalExclusao from "@/app/components/layout/ModalExclusao";
import ModalPromocaoCategoria from "@/app/components/admin/ModalPromocaoCategoria";
import toast from "react-hot-toast";
import { Eye, EyeOff, GripVertical, Tag, Percent } from "lucide-react";

interface Categoria {
  lookupId: string;
  nome: string;
  mostrarNaHome?: boolean;
  ordemExibicao?: number;
  percentualDesconto?: number;
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregar, setErroCarregar] = useState("");

  const [nomeNovaCategoria, setNomeNovaCategoria] = useState("");
  const [mostrarNaHome, setMostrarNaHome] = useState(false);
  const [ordemExibicao, setOrdemExibicao] = useState<number | string>(1);

  const [salvando, setSalvando] = useState(false);
  const [erroSalvar, setErroSalvar] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);

  const [isModalExclusaoAberto, setIsModalExclusaoAberto] = useState(false);
  const [categoriaParaExcluir, setCategoriaParaExcluir] = useState<Categoria | null>(null);

  // Estados apenas de controle do Modal de Promoções
  const [isModalPromocaoAberto, setIsModalPromocaoAberto] = useState(false);
  const [categoriaParaPromocao, setCategoriaParaPromocao] = useState<Categoria | null>(null);
  const [salvandoPromocao, setSalvandoPromocao] = useState(false);

  const carregarCategorias = async () => {
    try {
      const response = await api.get("/categorias");
      let dados = [];

      if (response.data && Array.isArray(response.data.content)) {
        dados = response.data.content;
      } else if (Array.isArray(response.data)) {
        dados = response.data;
      }

      const categoriasOrdenadas = dados.sort((a: Categoria, b: Categoria) => {
        if (a.mostrarNaHome && !b.mostrarNaHome) return -1;
        if (!a.mostrarNaHome && b.mostrarNaHome) return 1;
        if (a.mostrarNaHome && b.mostrarNaHome) return (a.ordemExibicao || 0) - (b.ordemExibicao || 0);
        return a.nome.localeCompare(b.nome);
      });

      setCategorias(categoriasOrdenadas);
    } catch (error) {
      setErroCarregar("Não foi possível carregar as categorias.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const formatarNomeCategoria = (texto: string) => {
    return texto.trim().split(/\s+/).map(palavra => palavra.length === 0 ? "" : palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()).join(" ");
  };

  const handleSalvarCategoria = async (e: FormEvent) => {
    e.preventDefault();
    setErroSalvar("");
    setSucesso(false);

    const nomeDigitado = nomeNovaCategoria.trim();
    if (!nomeDigitado) { setErroSalvar("O nome da categoria é obrigatório."); return; }

    const nomeFormatado = formatarNomeCategoria(nomeDigitado);
    const nomeLimpoDigitado = nomeDigitado.toLowerCase().replace(/\s+/g, '');

    const categoriaDuplicada = categorias.find(cat => {
      if (categoriaEditando && cat.lookupId === categoriaEditando.lookupId) return false;
      return nomeLimpoDigitado === cat.nome.toLowerCase().replace(/\s+/g, '');
    });

    if (categoriaDuplicada) {
      setErroSalvar(`A categoria "${categoriaDuplicada.nome}" já existe.`);
      return;
    }

    setSalvando(true);
    const payload = {
      nome: nomeFormatado,
      mostrarNaHome,
      ordemExibicao: ordemExibicao === "" ? 1 : Number(ordemExibicao)
    };

    try {
      if (categoriaEditando) {
        await api.put(`/categorias/${categoriaEditando.lookupId}`, payload);
      } else {
        await api.post("/categorias", payload);
      }
      setSucesso(true);
      cancelarEdicao();
      carregarCategorias();
      setTimeout(() => setSucesso(false), 3000);
    } catch (error: any) {
      setErroSalvar("Erro ao salvar a categoria.");
    } finally {
      setSalvando(false);
    }
  };

  const iniciarEdicao = (categoria: Categoria) => {
    setCategoriaEditando(categoria);
    setNomeNovaCategoria(categoria.nome);
    setMostrarNaHome(categoria.mostrarNaHome || false);
    setOrdemExibicao(categoria.ordemExibicao || 0);
    setErroSalvar("");
    setSucesso(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicao = () => {
    setCategoriaEditando(null);
    setNomeNovaCategoria("");
    setMostrarNaHome(false);
    setOrdemExibicao(1);
    setErroSalvar("");
  };

  const abrirModalExclusao = (categoria: Categoria) => { setCategoriaParaExcluir(categoria); setIsModalExclusaoAberto(true); };
  const fecharModalExclusao = () => { setIsModalExclusaoAberto(false); setCategoriaParaExcluir(null); };

  const confirmarExclusao = async () => {
    if (!categoriaParaExcluir) return;
    try {
      await api.delete(`/categorias/${categoriaParaExcluir.lookupId}`);
      setCategorias(categorias.filter(c => c.lookupId !== categoriaParaExcluir.lookupId));
      fecharModalExclusao();
    } catch (error) {
      toast.error("Erro ao excluir a categoria.");
      fecharModalExclusao();
    }
  };

  const abrirModalPromocao = (categoria: Categoria) => {
    setCategoriaParaPromocao(categoria);
    setIsModalPromocaoAberto(true);
  };

  const fecharModalPromocao = () => {
    setIsModalPromocaoAberto(false);
    setCategoriaParaPromocao(null);
  };

  const aplicarPromocao = async (valorDesconto: number) => {
    if (!categoriaParaPromocao) return;

    if (isNaN(valorDesconto) || valorDesconto <= 0 || valorDesconto >= 100) {
      toast.error("O desconto deve ser entre 1% e 99%.");
      return;
    }

    setSalvandoPromocao(true);
    try {
      await api.post(`/produtos/categoria/${categoriaParaPromocao.lookupId}/promocao?desconto=${valorDesconto}`);
      toast.success(`Desconto de ${valorDesconto}% aplicado em ${categoriaParaPromocao.nome}!`);
      carregarCategorias();
      fecharModalPromocao();
    } catch (error) {
      toast.error("Erro ao aplicar promoção.");
    } finally {
      setSalvandoPromocao(false);
    }
  };

  const removerPromocao = async () => {
    if (!categoriaParaPromocao) return;

    setSalvandoPromocao(true);
    try {
      await api.delete(`/produtos/categoria/${categoriaParaPromocao.lookupId}/promocao`);
      toast.success("Promoção removida com sucesso!");
      carregarCategorias();
      fecharModalPromocao();
    } catch (error) {
      toast.error("Erro ao remover promoção.");
    } finally {
      setSalvandoPromocao(false);
    }
  };

  const categoriasEmPromocao = categorias.filter(c => c.percentualDesconto && c.percentualDesconto > 0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Categorias</h2>
        <p className="text-sm text-gray-400 mt-1">Crie e gerencie as categorias e as vitrines da Home.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* formulario */}
        <div className="lg:col-span-1">
          <div className="bg-black p-6 rounded-xl shadow-2xl border-t-4 border-[#C2AE82] sticky top-8">
            <h3 className="text-lg font-bold text-white mb-4">
              {categoriaEditando ? "Editar Categoria" : "Nova Categoria"}
            </h3>

            <form onSubmit={handleSalvarCategoria} className="space-y-5">
              {erroSalvar && <div className="bg-red-950/50 border-l-4 border-red-500 p-3 rounded-md"><p className="text-xs text-red-200 font-semibold">{erroSalvar}</p></div>}
              {sucesso && <div className="bg-green-950/50 border-l-4 border-green-500 p-3 rounded-md"><p className="text-xs text-green-200 font-semibold">Salva com sucesso!</p></div>}

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nome *</label>
                <input
                  type="text" required placeholder="Ex: Moda Praia"
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-[#C2AE82] outline-none"
                  value={nomeNovaCategoria} onChange={(e) => setNomeNovaCategoria(e.target.value)}
                />
              </div>

              <div className="border-t border-neutral-800 pt-4 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox" className="sr-only"
                      checked={mostrarNaHome} onChange={(e) => setMostrarNaHome(e.target.checked)}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${mostrarNaHome ? 'bg-[#C2AE82]' : 'bg-neutral-700'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${mostrarNaHome ? 'translate-x-4' : ''}`}></div>
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-gray-200">Exibir Vitrine na Home</p>
                    <p className="text-[10px] text-gray-500 leading-tight mt-0.5">Cria uma faixa de produtos exclusivos desta categoria na tela inicial.</p>
                  </div>
                </label>

                <div className={`transition-all duration-300 ${mostrarNaHome ? 'opacity-100 max-h-20' : 'opacity-50 max-h-20 grayscale pointer-events-none'}`}>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Ordem na Home</label>
                  <div className="flex items-center gap-2">
                    <GripVertical size={16} className="text-gray-600" />
                    <input
                       type="number" min="1" disabled={!mostrarNaHome}
                       className="w-20 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-center text-white focus:ring-2 focus:ring-[#C2AE82] outline-none disabled:bg-black"
                       value={ordemExibicao}
                       onChange={(e) => setOrdemExibicao(e.target.value === "" ? "" : Number(e.target.value))}
                     />
                    <span className="text-xs text-gray-500">(1 = Topo)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button type="submit" disabled={salvando} className="w-full py-3 text-sm font-extrabold rounded-lg text-black bg-[#C2AE82] hover:bg-[#a8956b] transition-all shadow-lg">
                  {salvando ? "Salvando..." : (categoriaEditando ? "Atualizar" : "Criar Categoria")}
                </button>
                {categoriaEditando && (
                  <button type="button" onClick={cancelarEdicao} className="w-full py-3 text-sm font-bold rounded-lg text-gray-300 hover:bg-neutral-800 transition-all border border-neutral-700">
                    Cancelar Edição
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">

          {/* painel de promoções ativas */}
          {categoriasEmPromocao.length > 0 && (
            <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-5 mb-8 shadow-lg animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-2 mb-4">
                <Percent className="text-red-500" size={20} />
                <h3 className="text-lg font-bold text-white tracking-wide">Ofertas Ativas</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoriasEmPromocao.map(cat => (
                  <div key={cat.lookupId} className="bg-black border border-red-900/30 p-4 rounded-lg flex justify-between items-center group hover:border-red-500/50 transition-colors">
                    <div>
                      <p className="font-bold text-gray-200 truncate pr-2">{cat.nome}</p>
                      <p className="text-sm font-extrabold text-red-500 mt-0.5 flex items-center gap-1">
                        <Tag size={12} fill="currentColor" /> {cat.percentualDesconto}% OFF
                      </p>
                    </div>
                    <button
                      onClick={() => abrirModalPromocao(cat)}
                      className="p-2 bg-neutral-900 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-md transition-colors"
                      title="Editar Promoção"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {erroCarregar && <div className="bg-red-950/50 border-l-4 border-red-500 p-4 rounded-md mb-4"><p className="text-sm text-red-200 font-semibold">{erroCarregar}</p></div>}
          <div className="bg-black rounded-xl shadow-2xl border border-neutral-800 overflow-hidden">
            {carregando ? (
              <div className="p-10 text-center text-[#C2AE82] font-bold tracking-widest uppercase animate-pulse">Carregando categorias...</div>
            ) : categorias.length === 0 ? (
              <div className="p-10 text-center"><p className="text-gray-300 font-bold text-lg">Nenhuma categoria</p></div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-900 border-b border-neutral-800 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Nome</th>
                    <th className="px-6 py-4 text-center">Vitrine Home</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {categorias.map((categoria) => (
                    <tr key={categoria.lookupId} className="hover:bg-neutral-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/admin/produtos?categoria=${categoria.lookupId}`} className="text-lg font-bold text-gray-100 hover:text-[#C2AE82] transition-colors flex items-center gap-2">
                          {categoria.nome}
                          {categoria.percentualDesconto && categoria.percentualDesconto > 0 && (
                            <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-sm font-bold flex items-center gap-0.5">
                              <Tag size={8} fill="currentColor" /> %
                            </span>
                          )}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {categoria.mostrarNaHome ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#C2AE82]/10 border border-[#C2AE82]/30 rounded-md text-[#C2AE82] text-xs font-bold">
                            <Eye size={14} /> Ativa (Pos: {categoria.ordemExibicao || 0})
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-800 border border-neutral-700 rounded-md text-gray-500 text-xs font-bold">
                            <EyeOff size={14} /> Oculta
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <button onClick={() => abrirModalPromocao(categoria)} title="Aplicar promo" className="text-red-500 hover:text-red-400 p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-colors"><Tag size={16} /></button>
                        <button onClick={() => iniciarEdicao(categoria)} title="Editar" className="text-gray-400 hover:text-white p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button onClick={() => abrirModalExclusao(categoria)} title="Excluir" className="text-red-500 hover:text-red-400 p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <ModalExclusao
        isOpen={isModalExclusaoAberto}
        onClose={fecharModalExclusao}
        onConfirm={confirmarExclusao}
        titulo="Excluir Categoria?"
        mensagem={<>Tem certeza que deseja excluir a categoria <span className="text-white font-bold">"{categoriaParaExcluir?.nome}"</span>?</>}
      />
      <ModalPromocaoCategoria
        isOpen={isModalPromocaoAberto}
        categoria={categoriaParaPromocao}
        onClose={fecharModalPromocao}
        onAplicar={aplicarPromocao}
        onRemover={removerPromocao}
        salvandoPromocao={salvandoPromocao}
      />

    </div>
  );
}