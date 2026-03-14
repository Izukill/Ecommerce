'use client';

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

// Precisamos avisar o TypeScript o formato da Categoria que vem do banco
interface Categoria {
  lookupId: string;
  nome: string;
}

export default function NovoProdutoPage() {
  const router = useRouter();

  // Estados do formulário
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoriaId, setCategoriaId] = useState(""); // Agora guardamos o ID, não o nome!
  const [descricao, setDescricao] = useState("");

  // Estados das Categorias vindas do banco
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);

  // Estados de controle da tela
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Busca as categorias reais assim que a tela abre
  useEffect(() => {
    const buscarCategorias = async () => {
      try {
        const response = await api.get("/categorias");

        // Trata paginação ou lista direta
        if (response.data && Array.isArray(response.data.content)) {
          setCategorias(response.data.content);
        } else if (Array.isArray(response.data)) {
          setCategorias(response.data);
        }
      } catch (error) {
        setErro("Erro ao carregar as categorias do banco de dados.");
      } finally {
        setCarregandoCategorias(false);
      }
    };

    buscarCategorias();
  }, []);

  const handleCriarProduto = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");

    // Validação
    if (!nome || !preco || !categoriaId) {
      setErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setSalvando(true);

    try {
      // Converte o preço
      const precoNumerico = parseFloat(preco.replace(",", "."));

      // Monta o JSON exatamente como o Spring Boot espera
      const payload = {
        nome,
        preco: precoNumerico,
        descricao,
        // Atenção aqui: Enviamos um objeto com o ID para o Java saber relacionar!
        // (Se o seu DTO de Produto espera apenas o ID solto, mude para: categoriaId: categoriaId)
        categoria: {
          lookupId: categoriaId
        }
      };

      await api.post("/produtos", payload);

      setSucesso(true);

      // Limpa os campos
      setTimeout(() => {
        setSucesso(false);
        setNome("");
        setPreco("");
        setCategoriaId("");
        setDescricao("");
      }, 3000);

    } catch (error: any) {
      setErro("Erro ao cadastrar o produto. Verifique os dados e tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Novo Produto</h2>
          <p className="text-sm text-gray-400 mt-1">Cadastre uma nova peça para a sua vitrine.</p>
        </div>
        <Link
          href="/admin/produtos"
          className="px-4 py-2 text-sm font-bold text-gray-300 bg-neutral-800 rounded-lg hover:bg-neutral-700 hover:text-white transition-colors border border-neutral-700"
        >
          Voltar para Lista
        </Link>
      </div>

      <div className="bg-black p-8 rounded-xl shadow-2xl border-t-4 border-[#C2AE82]">

        <form onSubmit={handleCriarProduto} className="space-y-6">

          {erro && (
            <div className="bg-red-950/50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-sm text-red-200 font-semibold">{erro}</p>
            </div>
          )}

          {sucesso && (
            <div className="bg-green-950/50 border-l-4 border-green-500 p-4 rounded-md">
              <p className="text-sm text-green-200 font-semibold">Produto cadastrado com sucesso!</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="md:col-span-2">
              <label htmlFor="nome" className="block text-sm font-bold text-gray-100">Nome do Produto *</label>
              <input
                id="nome" type="text" required
                className="mt-1 appearance-none rounded-lg block w-full px-4 py-3 border border-neutral-700 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C2AE82] focus:border-transparent bg-neutral-900 sm:text-sm transition-all"
                placeholder="Ex: Conjunto Legging e Top Energy"
                value={nome} onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="categoria" className="block text-sm font-bold text-gray-100">Categoria *</label>
              <select
                id="categoria" required disabled={carregandoCategorias}
                className="mt-1 block w-full rounded-lg px-4 py-3 border border-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C2AE82] focus:border-transparent bg-neutral-900 sm:text-sm transition-all appearance-none disabled:opacity-50"
                value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}
              >
                <option value="" className="text-gray-500">
                  {carregandoCategorias ? "Carregando..." : "Selecione uma categoria..."}
                </option>

                {/* Aqui renderizamos as categorias reais! */}
                {categorias.map((cat) => (
                  <option key={cat.lookupId} value={cat.lookupId} className="bg-neutral-900 text-gray-100">
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="preco" className="block text-sm font-bold text-gray-100">Preço (R$) *</label>
              <input
                id="preco" type="number" step="0.01" min="0" required
                className="mt-1 appearance-none rounded-lg block w-full px-4 py-3 border border-neutral-700 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C2AE82] focus:border-transparent bg-neutral-900 sm:text-sm transition-all"
                placeholder="Ex: 149.90"
                value={preco} onChange={(e) => setPreco(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="descricao" className="block text-sm font-bold text-gray-100">Descrição</label>
              <textarea
                id="descricao" rows={4}
                className="mt-1 appearance-none rounded-lg block w-full px-4 py-3 border border-neutral-700 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C2AE82] focus:border-transparent bg-neutral-900 sm:text-sm transition-all resize-none"
                placeholder="Detalhes sobre o tecido, caimento, tamanhos disponíveis..."
                value={descricao} onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

          </div>

          <div className="pt-4">
            <button
              type="submit" disabled={salvando || carregandoCategorias}
              className="w-full md:w-auto md:float-right flex justify-center py-3 px-8 border border-transparent text-sm font-extrabold rounded-lg text-black bg-[#C2AE82] hover:bg-[#a8956b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C2AE82] focus:ring-offset-black disabled:opacity-50 transition-all shadow-lg"
            >
              {salvando ? "Salvando..." : "Salvar Produto"}
            </button>
            <div className="clear-both"></div>
          </div>

        </form>
      </div>
    </div>
  );
}