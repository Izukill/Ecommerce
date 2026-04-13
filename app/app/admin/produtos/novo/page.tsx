'use client';

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Tag } from "lucide-react";
import CapaProdutoUpload from "@/app/components/produto/CapaProdutoUpload";
import GerenciadorVariacoes, { Variacao } from "@/app/components/produto/GerenciadorVariacoes";
import FotosPorCor from "@/app/components/produto/FotosPorCor";

interface Categoria {
  lookupId: string;
  nome: string;
}

export default function NovoProdutoPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [precoPromocional, setPrecoPromocional] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [descricao, setDescricao] = useState("");

  const [imagemUrl, setImagemUrl] = useState("");
  const [variacoes, setVariacoes] = useState<Variacao[]>([]);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const buscarCategorias = async () => {
      try {
        const response = await api.get("/categorias");
        const dados = response.data?.content || response.data || [];
        setCategorias(Array.isArray(dados) ? dados : []);
      } catch (error) {
        setErro("Erro ao carregar as categorias.");
      } finally {
        setCarregandoCategorias(false);
      }
    };
    buscarCategorias();
  }, []);

  const handleCriarProduto = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!nome || !preco || !categoriaId) {
      setErro("Por favor, preencha todos os campos obrigatórios.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const precoNumerico = parseFloat(preco.toString().replace(",", "."));
    let precoPromoNumerico = null;

    if (precoPromocional) {
      precoPromoNumerico = parseFloat(precoPromocional.toString().replace(",", "."));
      if (precoPromoNumerico >= precoNumerico) {
        setErro("O preço promocional deve ser estritamente menor que o preço original.");
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
        variacaoProduto: variacoes
      };

      await api.post("/produtos", payload);
      setSucesso(true);

      setTimeout(() => {
        router.push("/admin/produtos");
      }, 2000);

    } catch (error: any) {
      setErro(error.response?.data?.detail || "Erro ao cadastrar o produto.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Novo Produto</h2>
          <p className="text-sm text-gray-400 mt-1">Cadastre uma nova peça e gerencie o estoque.</p>
        </div>
        <Link href="/admin/produtos" className="px-4 py-2 text-sm font-bold text-gray-300 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors border border-neutral-700">
          Voltar
        </Link>
      </div>

      <div className="bg-black p-8 rounded-xl shadow-2xl border-t-4 border-[#C2AE82]">
        <form onSubmit={handleCriarProduto} className="space-y-8">

          {erro && <div className="bg-red-950/50 border-l-4 border-red-500 p-4 rounded-md text-sm text-red-200">{erro}</div>}
          {sucesso && <div className="bg-green-950/50 border-l-4 border-green-500 p-4 rounded-md text-sm text-green-200">Produto cadastrado com sucesso!</div>}

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
                  <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900 text-gray-100 focus:ring-2 focus:ring-[#C2AE82] outline-none" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-100">Categoria *</label>
                    <select required value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} disabled={carregandoCategorias} className="mt-1 w-full px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900 text-gray-100 focus:ring-2 focus:ring-[#C2AE82] appearance-none outline-none">
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
                      onChange={(e) => setPreco(e.target.value)}
                      onFocus={(e) => e.target.select()}
                      className="mt-1 w-full px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900 text-gray-100 focus:ring-2 focus:ring-[#C2AE82] outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" // 👈 Classes adicionadas
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
                      className="mt-1 w-full px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900 text-gray-100 focus:ring-2 focus:ring-red-500 outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" // 👈 Classes adicionadas
                    />
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 mt-2 italic flex items-start gap-1">
                  <span className="text-[#C2AE82] font-bold">*</span>
                  Obs: Se a categoria deste produto possuir uma promoção ativa (%), ela terá prioridade e substituirá o preço promocional digitado acima.
                </p>

                <div>
                  <label className="block text-sm font-bold text-gray-100">Descrição</label>
                  <textarea rows={2} value={descricao} onChange={(e) => setDescricao(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900 text-gray-100 focus:ring-2 focus:ring-[#C2AE82] resize-none outline-none" />
                </div>
              </div>

              <GerenciadorVariacoes variacoes={variacoes} setVariacoes={setVariacoes} />

              <div className="pt-4">
                <button type="submit" disabled={salvando} className="w-full py-4 px-8 rounded-lg text-black bg-[#C2AE82] hover:bg-[#a8956b] font-extrabold disabled:opacity-50 transition-colors shadow-lg">
                  {salvando ? "Salvando Produto..." : "Salvar Produto Completo"}
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
}