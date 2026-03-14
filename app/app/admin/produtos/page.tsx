'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import ProdutoCard from "@/app/components/ProdutoCard";

interface Categoria {
  lookupId: string;
  nome: string;
}

interface Produto {
  lookupId: string;
  nome: string;
  categoria: Categoria | string;
  preco: number;
  ativo: boolean;
  imagemUrl?: string;
}

export default function ListaProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categoriasDb, setCategoriasDb] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState("todos");
  const [filtroPreco, setFiltroPreco] = useState("");

  // ==========================================
  // NOVO ESTADO: Controle do Modal de Exclusão
  // ==========================================
  const [produtoParaExcluir, setProdutoParaExcluir] = useState<Produto | null>(null);

  const carregarDados = async () => {
    try {
      const [resProdutos, resCategorias] = await Promise.all([
        api.get("/produtos"),
        api.get("/categorias")
      ]);

      const dadosProdutos = resProdutos.data?.content || resProdutos.data || [];
      setProdutos(Array.isArray(dadosProdutos) ? dadosProdutos : []);

      const dadosCategorias = resCategorias.data?.content || resCategorias.data || [];
      setCategoriasDb(Array.isArray(dadosCategorias) ? dadosCategorias : []);

    } catch (error) {
      setErro("Não foi possível carregar os dados. Verifique a conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // ==========================================
  // NOVA FUNÇÃO: Confirmar a exclusão pelo Modal
  // ==========================================
  const confirmarExclusao = async () => {
    if (!produtoParaExcluir) return;

    try {
      await api.delete(`/produtos/${produtoParaExcluir.lookupId}`);
      setProdutos(produtos.filter(p => p.lookupId !== produtoParaExcluir.lookupId));
      setProdutoParaExcluir(null); // Fecha o modal após o sucesso
    } catch (error) {
      alert("Erro ao excluir o produto. Ele pode estar atrelado a algum pedido.");
      setProdutoParaExcluir(null); // Fecha o modal mesmo se der erro
    }
  };

  const getNomeCategoria = (cat: any) => {
    if (!cat) return "Sem Categoria";
    if (typeof cat === 'object' && cat.nome) return cat.nome;
    return String(cat).replace("_", " ");
  };

  const produtosFiltradosEOrdenados = produtos
    .filter(produto => {
      if (filtroNome && !produto.nome.toLowerCase().includes(filtroNome.toLowerCase())) return false;
      const nomeCat = getNomeCategoria(produto.categoria);
      if (filtroCategoria && nomeCat !== filtroCategoria) return false;
      if (filtroAtivo === "ativos" && !produto.ativo) return false;
      if (filtroAtivo === "inativos" && produto.ativo) return false;
      if (filtroPreco && produto.preco > parseFloat(filtroPreco)) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.ativo === b.ativo) return 0;
      return a.ativo ? -1 : 1;
    });

  return (
    <div className="space-y-6 relative">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Produtos</h2>
          <p className="text-sm text-gray-400 mt-1">Gerencie o catálogo da sua loja.</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-extrabold rounded-lg text-black bg-[#C2AE82] hover:bg-[#a8956b] shadow-lg transition-all"
        >
          <span className="mr-2 text-lg">+</span> Adicionar Produto
        </Link>
      </div>

      {erro && (
        <div className="bg-red-950/50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-sm text-red-200 font-semibold">{erro}</p>
        </div>
      )}

      {/* BARRA DE FILTROS */}
      <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Buscar por Nome</label>
          <input
            type="text" placeholder="Ex: Legging..."
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-sm text-gray-100 focus:ring-1 focus:ring-[#C2AE82] focus:border-[#C2AE82] outline-none transition-all"
            value={filtroNome} onChange={(e) => setFiltroNome(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Categoria</label>
          <select
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-sm text-gray-100 focus:ring-1 focus:ring-[#C2AE82] focus:border-[#C2AE82] outline-none transition-all appearance-none"
            value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="">Todas as Categorias</option>
            {categoriasDb.map(cat => (
              <option key={cat.lookupId} value={cat.nome}>{cat.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Status</label>
          <select
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-sm text-gray-100 focus:ring-1 focus:ring-[#C2AE82] focus:border-[#C2AE82] outline-none transition-all appearance-none"
            value={filtroAtivo} onChange={(e) => setFiltroAtivo(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="ativos">Apenas Ativos</option>
            <option value="inativos">Apenas Inativos</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Preço Máximo (R$)</label>
          <input
            type="number" min="0" step="10" placeholder="Ex: 150"
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-sm text-gray-100 focus:ring-1 focus:ring-[#C2AE82] focus:border-[#C2AE82] outline-none transition-all"
            value={filtroPreco} onChange={(e) => setFiltroPreco(e.target.value)}
          />
        </div>
      </div>

      {/* GRID DE CARDS */}
      {carregando ? (
        <div className="py-20 text-center text-[#C2AE82] font-bold tracking-widest uppercase animate-pulse">
          Carregando catálogo...
        </div>
      ) : produtosFiltradosEOrdenados.length === 0 ? (
        <div className="py-20 text-center bg-black rounded-xl border border-neutral-800">
          <span className="text-4xl mb-4">👕</span>
          <p className="text-gray-300 font-bold text-lg mt-4">Nenhum produto encontrado</p>
          <p className="text-gray-500 text-sm mt-1">Tente ajustar os filtros ou cadastre um novo produto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {produtosFiltradosEOrdenados.map((produto) => (
            <div key={produto.lookupId} className="flex flex-col gap-3">

              <ProdutoCard produto={produto} isAdmin={true} />

              {/* Botões do Administrador (Editar / Excluir) */}
              <div className="flex gap-2">
                <Link
                  href={`/admin/produtos/editar/${produto.lookupId}`}
                  className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 bg-neutral-800 text-gray-300 font-bold text-sm rounded-lg border border-neutral-700 hover:text-white hover:bg-neutral-700 hover:border-neutral-600 transition-all shadow-md"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </Link>

                <button
                  onClick={() => setProdutoParaExcluir(produto)} // <--- AQUI CHAMA O MODAL AGORA
                  className="flex justify-center items-center px-4 py-2.5 bg-red-950/30 text-red-500 font-bold text-sm rounded-lg border border-red-900/50 hover:bg-red-900/50 hover:text-red-400 transition-all shadow-md"
                  title="Excluir Produto"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* modal para confirmação de exclusão de produto */}
      {produtoParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-neutral-900 border-t-4 border-red-600 rounded-xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-extrabold text-white mb-2">Excluir Produto?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Tem certeza que deseja excluir <span className="text-white font-bold">"{produtoParaExcluir.nome}"</span>? Esta ação não poderá ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setProdutoParaExcluir(null)}
                className="px-4 py-2 text-sm font-bold text-gray-300 bg-neutral-800 rounded-lg hover:bg-neutral-700 hover:text-white transition-colors border border-neutral-700"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusao}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-lg"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}