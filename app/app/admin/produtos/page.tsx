'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import ProdutoCard from "@/app/components/ProdutoCard";
import ModalExclusao from "@/app/components/ModalExclusao";

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
  dataCriacao?: string;
}

export default function ListaProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categoriasDb, setCategoriasDb] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  //inicializacao do hook para ler os param da url
  const searchParams = useSearchParams();

  //falor inicial dos filtros
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState(searchParams.get("categoria") || "");
  const [filtroAtivo, setFiltroAtivo] = useState("todos");
  const [filtroPreco, setFiltroPreco] = useState("");

  const [produtoParaExcluir, setProdutoParaExcluir] = useState<Produto | null>(null);
  const [isModalExclusaoAberto, setIsModalExclusaoAberto] = useState(false);

  // ESTADOS DE PAGINAÇÃO
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const tamanhoPagina = 12;

  const carregarDados = async (pagina: number = 0) => {
    setCarregando(true);
    setErro("");

    try {
      const params = new URLSearchParams({
        page: pagina.toString(),
        size: tamanhoPagina.toString(),
        sort: 'dataCriacao,desc'
      });

      if (filtroNome) params.append("nome", filtroNome);
      if (filtroCategoria) params.append("categoria", filtroCategoria);

      const [resProdutos, resCategorias] = await Promise.all([
        api.get(`/produtos?${params.toString()}`),
        api.get("/categorias")
      ]);

      const pageData = resProdutos.data;
      const dadosProdutos = pageData.content || pageData || [];

      setProdutos(Array.isArray(dadosProdutos) ? dadosProdutos : []);

      if (pageData.totalPages !== undefined) {
        setTotalPaginas(pageData.totalPages);
      }

      const dadosCategorias = resCategorias.data?.content || resCategorias.data || [];
      setCategoriasDb(Array.isArray(dadosCategorias) ? dadosCategorias : []);

    } catch (error) {
      setErro("Não foi possível carregar os dados. Verifique a conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados(paginaAtual);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginaAtual, filtroNome, filtroCategoria]);

  useEffect(() => {
    setPaginaAtual(0);
  }, [filtroNome, filtroCategoria, filtroAtivo, filtroPreco]);

  const abrirModalExclusao = (produto: Produto) => {
    setProdutoParaExcluir(produto);
    setIsModalExclusaoAberto(true);
  };

  const fecharModalExclusao = () => {
    setIsModalExclusaoAberto(false);
    setProdutoParaExcluir(null);
  };

  const confirmarExclusao = async () => {
    if (!produtoParaExcluir) return;

    try {
      await api.delete(`/produtos/${produtoParaExcluir.lookupId}`);
      carregarDados(paginaAtual);
      fecharModalExclusao();
    } catch (error) {
      alert("Erro ao excluir o produto. Ele pode estar atrelado a algum pedido.");
      fecharModalExclusao();
    }
  };

  // ==========================================
  // FILTRAGEM E ORDENAÇÃO COMPLEMENTAR (Front-end)
  // ==========================================
  const produtosFiltradosEOrdenados = produtos
    .filter(produto => {
      if (filtroAtivo === "ativos" && !produto.ativo) return false;
      if (filtroAtivo === "inativos" && produto.ativo) return false;
      if (filtroPreco && produto.preco > parseFloat(filtroPreco)) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.ativo !== b.ativo) return a.ativo ? -1 : 1;
      if (!a.dataCriacao) return -1;
      return 0;
    });

  return (
    <div className="space-y-6 relative pb-10">

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
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-sm text-gray-100 focus:ring-1 focus:ring-[#C2AE82] outline-none"
            value={filtroNome} onChange={(e) => setFiltroNome(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Categoria</label>
          <select
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-sm text-gray-100 focus:ring-1 focus:ring-[#C2AE82] outline-none appearance-none"
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
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-sm text-gray-100 focus:ring-1 focus:ring-[#C2AE82] outline-none appearance-none"
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
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-sm text-gray-100 focus:ring-1 focus:ring-[#C2AE82] outline-none"
            value={filtroPreco} onChange={(e) => setFiltroPreco(e.target.value)}
          />
        </div>
      </div>

      {/* GRID DE CARDS */}
      {carregando ? (
        <div className="py-20 flex justify-center items-center gap-3 text-[#C2AE82] font-bold tracking-widest uppercase">
          <div className="w-8 h-8 border-4 border-[#C2AE82] border-t-transparent rounded-full animate-spin"></div>
          Carregando catálogo...
        </div>
      ) : produtosFiltradosEOrdenados.length === 0 ? (
        <div className="py-20 text-center bg-black rounded-xl border border-neutral-800">
          <span className="text-4xl mb-4">👕</span>
          <p className="text-gray-300 font-bold text-lg mt-4">Nenhum produto encontrado</p>
          <p className="text-gray-500 text-sm mt-1">Nesta página não há produtos que correspondam à sua busca.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {produtosFiltradosEOrdenados.map((produto) => (
              <div key={produto.lookupId} className="flex flex-col gap-3">

                <ProdutoCard produto={produto} isAdmin={true} />

                <div className="flex gap-2">
                  <Link
                    href={`/admin/produtos/editar/${produto.lookupId}`}
                    className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-neutral-800 text-gray-300 font-bold text-sm rounded-lg border border-neutral-700 hover:text-white hover:bg-neutral-700 transition-all shadow-md"
                  >
                    Editar
                  </Link>

                  <button
                    onClick={() => abrirModalExclusao(produto)}
                    className="flex justify-center items-center px-4 py-2 bg-red-950/30 text-red-500 font-bold text-sm rounded-lg border border-red-900/50 hover:bg-red-900/50 transition-all shadow-md"
                  >
                    Excluir
                  </button>
                </div>

              </div>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4 bg-neutral-900 p-4 rounded-xl border border-neutral-800">
              <button
                onClick={() => setPaginaAtual(prev => Math.max(0, prev - 1))}
                disabled={paginaAtual === 0 || carregando}
                className="px-4 py-2 text-sm font-bold bg-black text-[#C2AE82] border border-[#C2AE82]/30 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#C2AE82]/10 transition-colors"
              >
                &larr; Anterior
              </button>

              <span className="text-gray-400 font-bold text-sm">
                Página <span className="text-white">{paginaAtual + 1}</span> de <span className="text-white">{totalPaginas}</span>
              </span>

              <button
                onClick={() => setPaginaAtual(prev => Math.min(totalPaginas - 1, prev + 1))}
                disabled={paginaAtual >= totalPaginas - 1 || carregando}
                className="px-4 py-2 text-sm font-bold bg-black text-[#C2AE82] border border-[#C2AE82]/30 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#C2AE82]/10 transition-colors"
              >
                Próxima &rarr;
              </button>
            </div>
          )}
        </>
      )}

      {/* USO DO COMPONENTE EXTERNALIZADO AQUI TAMBÉM */}
      <ModalExclusao
        isOpen={isModalExclusaoAberto}
        onClose={fecharModalExclusao}
        onConfirm={confirmarExclusao}
        titulo="Excluir Produto?"
        mensagem={
          <>
            Tem certeza que deseja excluir <span className="text-white font-bold">"{produtoParaExcluir?.nome}"</span>? Esta ação não poderá ser desfeita.
          </>
        }
      />

    </div>
  );
}