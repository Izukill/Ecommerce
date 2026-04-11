'use client';

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import toast from "react-hot-toast"
import { Filter, X, Search, ChevronDown, SlidersHorizontal, Loader2 } from "lucide-react";
import ProdutoCard, { Produto } from "@/app/components/produto/ProdutoCard";
import Header from "@/app/components/layout/Header";
import ModalProduto from "@/app/components/produto/ModalProduto";

function ConteudoProdutos() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [produtoVisualizado, setProdutoVisualizado] = useState<string | null>(null);

  const [filtroNome, setFiltroNome] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>(searchParams.get("categoria") || "");
  const [ordenacao, setOrdenacao] = useState("dataCriacao,desc");
  const [menuMobileFiltros, setMenuMobileFiltros] = useState(false);

  const [somenteOfertas, setSomenteOfertas] = useState(searchParams.get("emOferta") === "true");

  const [paginaAtiva, setPaginaAtiva] = useState(0);
  const [temMaisPaginas, setTemMaisPaginas] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const TAMANHO_PAGINA = 12;

  const buscarProdutos = useCallback(async (novaBusca: boolean) => {
    if (novaBusca) {
      setCarregando(true);
      setPaginaAtiva(0);
    } else {
      setCarregandoMais(true);
    }

    try {
      const params = new URLSearchParams({
        page: novaBusca ? "0" : paginaAtiva.toString(),
        size: TAMANHO_PAGINA.toString(),
        sort: ordenacao,
      });

      if (filtroNome) params.append("nome", filtroNome);
      if (categoriaSelecionada) params.append("categoriaId", categoriaSelecionada);

      const res = await api.get(`/produtos?${params.toString()}`);
      const pageData = res.data;
      const itensRecebidos = pageData?.content || res.data || [];
      let filtrados = itensRecebidos.filter((p: Produto) => p.ativo !== false);

      //faz o filtro pra somente em promoção
      if (somenteOfertas) {
        filtrados = filtrados.filter((p: Produto) => p.precoPromocional !== null && p.precoPromocional < p.preco);
      }

      if (novaBusca) {
        setProdutos(filtrados);
      } else {
        setProdutos(prev => [...prev, ...filtrados]);
      }

      //verifica se tem mais item
      if (pageData.last !== undefined) {
         setTemMaisPaginas(!pageData.last);
      } else {
         //fallback se não vier metadados
         setTemMaisPaginas(itensRecebidos.length === TAMANHO_PAGINA);
      }

    } catch (err) {
      console.error("Erro ao buscar produtos", err);
      toast.error("Erro ao buscar produtos");
    } finally {
      setCarregando(false);
      setCarregandoMais(false);
    }
  }, [categoriaSelecionada, filtroNome, ordenacao, paginaAtiva, somenteOfertas]);

  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const res = await api.get("/categorias");
        setCategorias(res.data?.content || res.data || []);
      } catch (err) {
        console.error("Erro ao carregar categorias", err);
      }
    };
    carregarCategorias();
  }, []);

  useEffect(() => {
    const catUrl = searchParams.get("categoria");
    const promoUrl = searchParams.get("emOferta");

    setCategoriaSelecionada(catUrl || "");
    setSomenteOfertas(promoUrl === "true");
    setPaginaAtiva(0);
  }, [searchParams]);

  // Muda filtro
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      buscarProdutos(true);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [categoriaSelecionada, filtroNome, ordenacao, somenteOfertas, buscarProdutos]); // A ordem não importa muito aqui, mas o eslint adora reclamar se não tiver tudo kkkk

  // Pagina muda
  useEffect(() => {
    if (paginaAtiva > 0) {
       buscarProdutos(false);
    }
  }, [paginaAtiva, buscarProdutos]);

  const limparFiltros = () => {
    setFiltroNome("");
    setCategoriaSelecionada("");
    setSomenteOfertas(false);
    setPaginaAtiva(0);
    router.push("/produtos");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {categoriaSelecionada
                ? categorias.find(c => c.lookupId === categoriaSelecionada)?.nome || "Coleção"
                : "Todos os Produtos"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuMobileFiltros(true)}
              className="md:hidden flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-lg font-bold text-sm"
            >
              <SlidersHorizontal size={18} /> Filtros
            </button>

            <div className="relative flex-1 md:w-64">
              <select
                value={ordenacao}
                onChange={(e) => { setOrdenacao(e.target.value); setPaginaAtiva(0); }}
                className="w-full bg-neutral-900 border border-neutral-800 text-sm rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-[#C2AE82] appearance-none cursor-pointer"
              >
                <option value="dataCriacao,desc">Mais Recentes</option>
                <option value="preco,asc">Menor Preço</option>
                <option value="preco,desc">Maior Preço</option>
                <option value="nome,asc">Nome A-Z</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-10">

          <aside className="hidden md:block w-64 shrink-0 space-y-8 sticky top-28 self-start">
            <div>
              <h3 className="text-xs font-bold text-[#C2AE82] uppercase tracking-widest mb-4">Pesquisar</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: Camisa..."
                  value={filtroNome}
                  onChange={(e) => setFiltroNome(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-[#C2AE82] outline-none"
                />
                <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-[#C2AE82] uppercase tracking-widest mb-4">Destaques</h3>
              <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox" className="sr-only"
                      checked={somenteOfertas}
                      onChange={(e) => { setSomenteOfertas(e.target.checked); setPaginaAtiva(0); }}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${somenteOfertas ? 'bg-red-600' : 'bg-neutral-700'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${somenteOfertas ? 'translate-x-4' : ''}`}></div>
                  </div>
                  <span className={`text-sm font-bold transition-colors ${somenteOfertas ? 'text-red-500' : 'text-gray-400 group-hover:text-white'}`}>
                    Apenas Promoções
                  </span>
              </label>
            </div>

            <div>
              <h3 className="text-xs font-bold text-[#C2AE82] uppercase tracking-widest mb-4">Categorias</h3>
              <div className="space-y-3 border-l border-neutral-800 pl-4 ml-1">
                <button
                  onClick={() => setCategoriaSelecionada("")}
                  className={`block w-full text-left text-sm transition-colors ${categoriaSelecionada === "" ? "text-[#C2AE82] font-bold" : "text-gray-400 hover:text-white"}`}
                >
                  Todas
                </button>
                {categorias.map(cat => (
                  <button
                    key={cat.lookupId}
                    onClick={() => setCategoriaSelecionada(cat.lookupId)}
                    className={`block w-full text-left text-sm transition-colors ${categoriaSelecionada === cat.lookupId ? "text-[#C2AE82] font-bold" : "text-gray-400 hover:text-white"}`}
                  >
                    {cat.nome}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={limparFiltros}
              className="text-xs text-red-500 font-bold border border-red-500/30 hover:bg-red-500/10 px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full transition-colors"
            >
              <X size={14} /> Limpar Filtros
            </button>
          </aside>

          <div className="flex-1">
            {carregando ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="aspect-[4/5] bg-neutral-900 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : produtos.length === 0 ? (
              <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-dashed border-neutral-800">
                <p className="text-gray-500 font-medium">Nenhum produto encontrado com estes filtros.</p>
                <button onClick={limparFiltros} className="text-[#C2AE82] text-sm mt-4 font-bold px-6 py-2 border border-[#C2AE82] rounded-full hover:bg-[#C2AE82] hover:text-black transition-colors">Mostrar tudo</button>
              </div>
            ) : (
              <div className="flex flex-col space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {produtos.map(p => (
                    <div key={p.lookupId} onClick={() => setProdutoVisualizado(p.lookupId)}>
                      <ProdutoCard produto={p} />
                    </div>
                  ))}
                </div>

                {temMaisPaginas && (
                  <div className="flex justify-center pt-8 border-t border-neutral-800/50">
                    <button
                      onClick={() => setPaginaAtiva(prev => prev + 1)}
                      disabled={carregandoMais}
                      className="px-8 py-3 bg-neutral-900 border border-neutral-700 hover:border-[#C2AE82] text-white font-bold rounded-full transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {carregandoMais ? (
                         <><Loader2 size={18} className="animate-spin" /> Carregando...</>
                      ) : (
                         "Carregar mais produtos"
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {menuMobileFiltros && (
        <div className="fixed inset-0 z-[100] md:hidden bg-black flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900">
            <h2 className="font-bold text-xl">Filtros</h2>
            <button onClick={() => setMenuMobileFiltros(false)} className="p-2 bg-black rounded-full"><X /></button>
          </div>
          <div className="p-8 flex-1 overflow-y-auto space-y-10">
             <div className="space-y-4">
               <p className="text-[#C2AE82] font-bold text-xs uppercase tracking-widest">Pesquisar</p>
               <input
                  type="text" placeholder="Nome do produto..." value={filtroNome}
                  onChange={(e) => setFiltroNome(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-sm focus:ring-1 focus:ring-[#C2AE82] outline-none"
               />
             </div>

             <div className="space-y-4">
                <p className="text-[#C2AE82] font-bold text-xs uppercase tracking-widest">Destaques</p>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox" className="sr-only"
                      checked={somenteOfertas}
                      onChange={(e) => { setSomenteOfertas(e.target.checked); setPaginaAtiva(0); }}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${somenteOfertas ? 'bg-red-600' : 'bg-neutral-700'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${somenteOfertas ? 'translate-x-4' : ''}`}></div>
                  </div>
                  <span className={`text-sm font-bold transition-colors ${somenteOfertas ? 'text-red-500' : 'text-gray-400 group-hover:text-white'}`}>
                    Apenas Promoções
                  </span>
                </label>
             </div>

             <div className="space-y-4">
               <p className="text-[#C2AE82] font-bold text-xs uppercase tracking-widest">Categorias</p>
               <div className="flex flex-wrap gap-2">
                 {categorias.map(cat => (
                   <button
                    key={cat.lookupId}
                    onClick={() => {setCategoriaSelecionada(cat.lookupId); setMenuMobileFiltros(false);}}
                    className={`px-4 py-2 rounded-full border text-sm ${categoriaSelecionada === cat.lookupId ? "bg-[#C2AE82] text-black border-[#C2AE82]" : "border-neutral-700 text-gray-400 hover:border-gray-500"}`}
                   >
                     {cat.nome}
                   </button>
                 ))}
               </div>
             </div>
          </div>
          <div className="p-6 border-t border-neutral-800 space-y-3">
            <button
              onClick={() => setMenuMobileFiltros(false)}
              className="w-full bg-[#C2AE82] text-black font-extrabold py-4 rounded-xl"
            >
              Ver Resultados
            </button>
            <button
              onClick={() => { limparFiltros(); setMenuMobileFiltros(false); }}
              className="w-full text-red-500 font-bold py-2 hover:underline"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      )}

      {produtoVisualizado && (
        <ModalProduto
          produtoId={produtoVisualizado}
          onClose={() => setProdutoVisualizado(null)}
        />
      )}
    </div>
  );
}

export default function ProdutosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black"></div>}>
      <ConteudoProdutos />
    </Suspense>
  );
}