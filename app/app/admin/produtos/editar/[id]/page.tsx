'use client';

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { AlertTriangle, Tag } from "lucide-react";
import toast from "react-hot-toast";

import CapaProdutoUpload from "@/app/components/produto/CapaProdutoUpload";
import GerenciadorVariacoes, { Variacao } from "@/app/components/produto/GerenciadorVariacoes";
import FotosPorCor from "@/app/components/produto/FotosPorCor";
import ModalExclusao from "@/app/components/layout/ModalExclusao";

interface Categoria {
  lookupId: string;
  nome: string;
}

export default function EditarProdutoPage() {
  const router = useRouter();
  const params = useParams();
  const produtoId = params.id as string;

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [precoPromocional, setPrecoPromocional] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [variacoes, setVariacoes] = useState<Variacao[]>([]);

  const [ativo, setAtivo] = useState(true);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

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
        setPrecoPromocional(prod.precoPromocional ? prod.precoPromocional.toString() : "");
        setDescricao(prod.descricao || "");
        setImagemUrl(prod.imagemUrl || "");

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

  const handleAtualizarProduto = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!nome || !preco || !categoriaId) {
      setErro("Por favor, preencha todos os campos obrigatórios (Nome, Preço e Categoria).");
      return;
    }

    const precoNumerico = parseFloat(preco.toString().replace(",", "."));
    let precoPromoNumerico = null;

    if (precoPromocional) {
      precoPromoNumerico = parseFloat(precoPromocional.toString().replace(",", "."));
      if (precoPromoNumerico >= precoNumerico) {
        setErro("O preço promocional deve ser menor que o preço original.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setSalvando(true);

    try {
      const payload = {
        nome,
        preco: precoNumerico,
        precoPromocional: precoPromoNumerico,
        descricao,
        imagemUrl,
        categoria: { lookupId: categoriaId },
        variacaoProduto: variacoes,
        ativo: ativo
      };

      await api.put(`/produtos/${produtoId}`, payload);
      setSucesso(true);
      toast.success("Produto atualizado com sucesso");

      setTimeout(() => {
        router.push("/admin/produtos");
      }, 2000);

    } catch (error: any) {
      console.error("Erro na atualização:", error.response?.data || error.message);
      toast.error(error.response?.data?.detail || "Erro ao atualizar o produto");
    } finally {
      setSalvando(false);
    }
  };

  const confirmarExclusao = async () => {
    setExcluindo(true);
    try {
      await api.delete(`/produtos/${produtoId}`);
      setModalExcluirAberto(false);
      toast.success("Produto excluido com sucesso");
      router.push("/admin/produtos");
    } catch (error) {
      setModalExcluirAberto(false);
      toast.error("Erro ao excluir o produto");
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Editar Produto</h2>
          <p className="text-sm text-gray-400 mt-1">Atualize informações, preço e estoque desta peça.</p>
        </div>

        <div className="flex items-center gap-3">
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

            <div className="lg:col-span-1 space-y-17">
              <CapaProdutoUpload imagemUrl={imagemUrl} setImagemUrl={setImagemUrl} />
              <FotosPorCor variacoes={variacoes} setVariacoes={setVariacoes} />
            </div>

            <div className="lg:col-span-2 space-y-6">

              <div className="space-y-6 bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
                <h3 className="text-lg font-bold text-white border-b border-neutral-800 pb-2">Dados Básicos</h3>

                <div>
                  <label className="block text-sm font-bold text-gray-100">Nome do Produto *</label>
                  <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900 text-gray-100 focus:ring-2 focus:ring-[#C2AE82] outline-none transition-colors" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-100">Categoria *</label>
                    <select required value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900 text-gray-100 focus:ring-2 focus:ring-[#C2AE82] appearance-none outline-none transition-colors">
                      <option value="">Selecione...</option>
                      {categorias.map(cat => <option key={cat.lookupId} value={cat.lookupId}>{cat.nome}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-100">Preço (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={preco}
                      onChange={(e) => {
                        setPreco(e.target.value);
                        setPrecoPromocional("");
                      }}
                      onFocus={(e) => e.target.select()}
                      className="mt-1 w-full px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900 text-gray-100 focus:ring-2 focus:ring-[#C2AE82] outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-bold text-gray-100">
                      Preço Promo <Tag size={14} className="text-red-500" />
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Opcional"
                      value={precoPromocional}
                      onChange={(e) => setPrecoPromocional(e.target.value)}
                      onFocus={(e) => e.target.select()}
                      className="mt-1 w-full px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900 text-gray-100 focus:ring-2 focus:ring-red-500 outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 mt-2 italic flex items-start gap-1">
                  <span className="text-[#C2AE82] font-bold">*</span>
                  Obs: Se a categoria deste produto possuir uma promoção ativa (%), ela terá prioridade e substituirá o preço promocional digitado acima.
                </p>

                <div>
                  <label className="block text-sm font-bold text-gray-100">Descrição</label>
                  <textarea rows={2} value={descricao} onChange={(e) => setDescricao(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900 text-gray-100 focus:ring-2 focus:ring-[#C2AE82] resize-none outline-none transition-colors" />
                </div>
              </div>

              <GerenciadorVariacoes variacoes={variacoes} setVariacoes={setVariacoes} />

              <div className="pt-6 space-y-4">
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

                <button type="submit" disabled={salvando} className="w-full py-4 px-8 rounded-lg text-black bg-[#C2AE82] hover:bg-[#a8956b] font-extrabold disabled:opacity-50 transition-colors shadow-lg">
                  {salvando ? "Atualizando..." : "Salvar Alterações"}
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>

      <ModalExclusao
        isOpen={modalExcluirAberto}
        onClose={() => setModalExcluirAberto(false)}
        onConfirm={confirmarExclusao}
        titulo="Excluir Produto?"
        mensagem={
          <div className="space-y-3">
            <p>
              Tem certeza que deseja excluir <span className="text-white font-bold">"{nome}"</span>?
            </p>
            <div className="text-[#C2AE82] font-semibold text-xs bg-[#C2AE82]/10 p-2 rounded border border-[#C2AE82]/20 flex items-start gap-2">
              <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
              <p>Aviso: Caso o produto já tenha sido vendido, ele não será apagado, será apenas desativado para preservar o histórico de compras dos clientes.</p>
            </div>
          </div>
        }
      />
    </div>
  );
}