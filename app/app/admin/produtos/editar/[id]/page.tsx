'use client';

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

import CapaProdutoUpload from "@/app/components/CapaProdutoUpload";
import GerenciadorVariacoes, { Variacao } from "@/app/components/GerenciadorVariacoes";

interface Categoria {
  lookupId: string;
  nome: string;
}

export default function EditarProdutoPage() {
  const router = useRouter();
  const params = useParams();
  const produtoId = params.id as string;

  // Estados do formulário
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [variacoes, setVariacoes] = useState<Variacao[]>([]);

  // NOVO: Controle de status Ativo/Inativo
  const [ativo, setAtivo] = useState(true);

  // Estados de controle gerais
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // NOVO: Estados para exclusão
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  // ==========================================
  // CARREGAR DADOS DO PRODUTO E CATEGORIAS
  // ==========================================
  useEffect(() => {
    if (!produtoId) return;

    const carregarTudo = async () => {
      try {
        const [resCategorias, resProduto] = await Promise.all([
          api.get("/categorias"),
          api.get(`/produtos/${produtoId}`)
        ]);

        const dadosCategorias = resCategorias.data?.content || resCategorias.data || [];
        setCategorias(Array.isArray(dadosCategorias) ? dadosCategorias : []);

        const prod = resProduto.data;
        setNome(prod.nome);
        setPreco(prod.preco.toString());
        setDescricao(prod.descricao || "");
        setImagemUrl(prod.imagemUrl || "");

        // Carrega o status do banco (se não existir, assume como ativo)
        setAtivo(prod.ativo !== false);

        if (prod.variacoes) {
          setVariacoes(prod.variacoes);
        }

        if (prod.categoria) {
          if (typeof prod.categoria === 'object' && prod.categoria.lookupId) {
            setCategoriaId(prod.categoria.lookupId);
          } else {
            const nomeCategoria = typeof prod.categoria === 'object' ? prod.categoria.nome : prod.categoria;
            const catEncontrada = dadosCategorias.find((c: Categoria) => c.nome === nomeCategoria);

            if (catEncontrada) {
              setCategoriaId(catEncontrada.lookupId);
            }
          }
        }

      } catch (error) {
        setErro("Não foi possível carregar os dados do produto.");
      } finally {
        setCarregandoDados(false);
      }
    };

    carregarTudo();
  }, [produtoId]);

  // ==========================================
  // SALVAR ALTERAÇÕES (PUT)
  // ==========================================
  const handleAtualizarProduto = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!nome || !preco || !categoriaId) {
      setErro("Por favor, preencha todos os campos obrigatórios (Nome, Preço e Categoria).");
      return;
    }

    setSalvando(true);

    try {
      const precoLimpo = preco.toString().replace(",", ".");
      const precoNumerico = parseFloat(precoLimpo);

      const payload = {
        nome,
        preco: precoNumerico,
        descricao,
        imagemUrl,
        categoria: { lookupId: categoriaId },
        variacaoProduto: variacoes,
        ativo: ativo
      };

      await api.put(`/produtos/${produtoId}`, payload);
      setSucesso(true);

      setTimeout(() => {
        router.push("/admin/produtos");
      }, 2000);

    } catch (error: any) {

      console.error("Erro na atualização:", error.response?.data || error.message);
      setErro("Erro ao atualizar o produto. Verifique a conexão com o servidor.");
    } finally {
      setSalvando(false);
    }
  };

  // ==========================================
  // EXCLUIR PRODUTO (DELETE)
  // ==========================================
  const confirmarExclusao = async () => {
    setExcluindo(true);
    try {
      await api.delete(`/produtos/${produtoId}`);
      setModalExcluirAberto(false);
      router.push("/admin/produtos"); // Volta para a lista após excluir
    } catch (error) {
      setErro("Erro ao excluir o produto. Ele pode estar atrelado a algum pedido.");
      setModalExcluirAberto(false);
    } finally {
      setExcluindo(false);
    }
  };

  if (carregandoDados) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#C2AE82] font-bold tracking-widest uppercase animate-pulse">
        <div className="w-10 h-10 border-4 border-[#C2AE82] border-t-transparent rounded-full animate-spin mb-4"></div>
        Carregando informações do produto...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* CABEÇALHO COM BOTÕES DE AÇÃO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Editar Produto</h2>
          <p className="text-sm text-gray-400 mt-1">Atualize informações, preço e estoque desta peça.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* BOTÃO EXCLUIR NO TOPO */}
          <button
            type="button"
            onClick={() => setModalExcluirAberto(true)}
            className="px-4 py-2 text-sm font-bold text-red-500 bg-red-950/30 rounded-lg hover:bg-red-900/50 transition-colors border border-red-900/50 shadow-md"
          >
            Excluir Produto
          </button>

          <Link href="/admin/produtos" className="px-4 py-2 text-sm font-bold text-gray-300 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors border border-neutral-700 shadow-md">
            Voltar
          </Link>
        </div>
      </div>

      <div className="bg-black p-8 rounded-xl shadow-2xl border-t-4 border-[#C2AE82]">
        <form onSubmit={handleAtualizarProduto} className="space-y-8">

          {erro && <div className="bg-red-950/50 border-l-4 border-red-500 p-4 rounded-md text-sm text-red-200 font-bold">{erro}</div>}
          {sucesso && <div className="bg-green-950/50 border-l-4 border-green-500 p-4 rounded-md text-sm text-green-200 font-bold">Produto atualizado com sucesso!</div>}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-1">
              <CapaProdutoUpload imagemUrl={imagemUrl} setImagemUrl={setImagemUrl} />
            </div>

            <div className="lg:col-span-2 space-y-6">

              <div className="space-y-6 bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
                <h3 className="text-lg font-bold text-white border-b border-neutral-800 pb-2">Dados Básicos</h3>

                <div>
                  <label className="block text-sm font-bold text-gray-100">Nome do Produto *</label>
                  <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900 text-gray-100 focus:ring-2 focus:ring-[#C2AE82] outline-none transition-colors" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-100">Categoria *</label>
                    <select required value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900 text-gray-100 focus:ring-2 focus:ring-[#C2AE82] appearance-none outline-none transition-colors">
                      <option value="">Selecione...</option>
                      {categorias.map(cat => <option key={cat.lookupId} value={cat.lookupId}>{cat.nome}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-100">Preço (R$) *</label>
                    <input type="number" step="0.01" required value={preco} onChange={(e) => setPreco(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900 text-gray-100 focus:ring-2 focus:ring-[#C2AE82] outline-none transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-100">Descrição</label>
                  <textarea rows={2} value={descricao} onChange={(e) => setDescricao(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900 text-gray-100 focus:ring-2 focus:ring-[#C2AE82] resize-none outline-none transition-colors" />
                </div>
              </div>

              <GerenciadorVariacoes variacoes={variacoes} setVariacoes={setVariacoes} />

              {/* ÁREA DE SALVAR E ATIVAR/DESATIVAR */}
              <div className="pt-6 space-y-4">

                {/* BOTÃO DE STATUS DA VITRINE */}
                <button
                  type="button"
                  onClick={() => setAtivo(!ativo)}
                  className={`w-full py-3 px-4 rounded-lg font-bold border transition-all text-sm flex items-center justify-center gap-2 shadow-md
                    ${ativo
                      ? 'bg-green-950/30 text-green-400 border-green-900/50 hover:bg-green-900/50'
                      : 'bg-neutral-800 text-gray-400 border-neutral-700 hover:bg-neutral-700'
                    }`}
                >
                  <span className={`w-3 h-3 rounded-full ${ativo ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                  {ativo ? 'Produto Ativo na Vitrine (Clique para Ocultar)' : 'Produto Oculto (Clique para Ativar na Vitrine)'}
                </button>

                {/* BOTÃO FINAL DE SALVAR */}
                <button type="submit" disabled={salvando} className="w-full py-4 px-8 rounded-lg text-black bg-[#C2AE82] hover:bg-[#a8956b] font-extrabold disabled:opacity-50 transition-colors shadow-lg">
                  {salvando ? "Atualizando..." : "Salvar Alterações"}
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>

      {/* ================= MODAL DE CONFIRMAÇÃO DE EXCLUSÃO ================= */}
      {modalExcluirAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-neutral-900 border-t-4 border-red-600 rounded-xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-extrabold text-white mb-2">Excluir Produto?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Tem certeza que deseja excluir <span className="text-white font-bold">"{nome}"</span>? Esta ação apagará todo o estoque e não poderá ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalExcluirAberto(false)}
                className="px-4 py-2 text-sm font-bold text-gray-300 bg-neutral-800 rounded-lg hover:bg-neutral-700 hover:text-white transition-colors border border-neutral-700"
                disabled={excluindo}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarExclusao}
                disabled={excluindo}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50"
              >
                {excluindo ? "Excluindo..." : "Sim, Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}