'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

interface Categoria {
  lookupId: string;
  nome: string;
}

export default function NovoProdutoPage() {
  const router = useRouter();

  // Estados dos textos do formulário
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [descricao, setDescricao] = useState("");

  // ==========================================
  // NOVOS ESTADOS PARA A IMAGEM
  // ==========================================
  const [imagemUrl, setImagemUrl] = useState("");
  const [fazendoUpload, setFazendoUpload] = useState(false);

  // Categorias
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const buscarCategorias = async () => {
      try {
        const response = await api.get("/categorias");
        if (response.data && Array.isArray(response.data.content)) {
          setCategorias(response.data.content);
        } else if (Array.isArray(response.data)) {
          setCategorias(response.data);
        }
      } catch (error) {
        setErro("Erro ao carregar as categorias.");
      } finally {
        setCarregandoCategorias(false);
      }
    };
    buscarCategorias();
  }, []);

  const handleUploadImagem = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFazendoUpload(true);
    setErro("");

    //tem que botar o formData no bagulho se n n funfa
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/upload/imagem", formData);
      //seta o link da imagem que o Cloudinary gerou
      setImagemUrl(response.data);
    } catch (error) {
      setErro("Falha ao enviar a imagem. Tente novamente.");
    } finally {
      setFazendoUpload(false);
    }
  };

  //salva produto com imagem junto
  const handleCriarProduto = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!nome || !preco || !categoriaId) {
      setErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setSalvando(true);

    try {
      const precoNumerico = parseFloat(preco.replace(",", "."));

      const payload = {
        nome,
        preco: precoNumerico,
        descricao,
        imagemUrl, // <--- Enviamos a URL da nuvem como texto!
        categoria: { lookupId: categoriaId }
      };

      await api.post("/produtos", payload);

      setSucesso(true);

      setTimeout(() => {
        setSucesso(false);
        setNome("");
        setPreco("");
        setCategoriaId("");
        setDescricao("");
        setImagemUrl(""); // Limpa a imagem para o próximo
        router.push("/admin/produtos"); // Redireciona de volta para a lista
      }, 2000);

    } catch (error: any) {
      setErro("Erro ao cadastrar o produto.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Novo Produto</h2>
          <p className="text-sm text-gray-400 mt-1">Cadastre uma nova peça para a sua vitrine.</p>
        </div>
        <Link href="/admin/produtos" className="px-4 py-2 text-sm font-bold text-gray-300 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors border border-neutral-700">
          Voltar
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* COLUNA ESQUERDA: UPLOAD DA IMAGEM */}
            <div className="md:col-span-1 space-y-4">
              <label className="block text-sm font-bold text-gray-100">Foto do Produto</label>

              <div className="border-2 border-dashed border-neutral-700 rounded-xl p-4 flex flex-col items-center justify-center text-center relative h-64 bg-neutral-900 overflow-hidden transition-colors hover:border-[#C2AE82]">

                {imagemUrl ? (
                  // MOSTRA A PRÉVIA DA IMAGEM SE JÁ TIVER FEITO UPLOAD
                  <img src={imagemUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  // MOSTRA O ÍCONE DE UPLOAD SE AINDA NÃO TIVER IMAGEM
                  <div className="space-y-2">
                    <span className="text-4xl">📸</span>
                    <p className="text-xs text-gray-400 font-medium px-2">Clique para selecionar uma foto em JPG ou PNG.</p>
                  </div>
                )}

                {/* INPUT INVISÍVEL COBRINDO O QUADRADO TODO */}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleUploadImagem}
                  disabled={fazendoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
                />

                {/* SPINNER DE CARREGAMENTO */}
                {fazendoUpload && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-[#C2AE82] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {imagemUrl && (
                <button
                  type="button"
                  onClick={() => setImagemUrl("")}
                  className="w-full py-2 text-xs font-bold text-red-400 bg-red-950/30 rounded-lg hover:bg-red-900/50 transition-colors"
                >
                  Remover Imagem
                </button>
              )}
            </div>

            {/* COLUNA DIREITA: DADOS DE TEXTO */}
            <div className="md:col-span-2 space-y-6">

              <div>
                <label htmlFor="nome" className="block text-sm font-bold text-gray-100">Nome do Produto *</label>
                <input
                  id="nome" type="text" required
                  className="mt-1 appearance-none rounded-lg block w-full px-4 py-3 border border-neutral-700 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C2AE82] focus:border-transparent bg-neutral-900 sm:text-sm transition-all"
                  placeholder="Ex: Conjunto Legging e Top"
                  value={nome} onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="categoria" className="block text-sm font-bold text-gray-100">Categoria *</label>
                  <select
                    id="categoria" required disabled={carregandoCategorias}
                    className="mt-1 block w-full rounded-lg px-4 py-3 border border-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C2AE82] bg-neutral-900 sm:text-sm appearance-none"
                    value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}
                  >
                    <option value="" className="text-gray-500">Selecione...</option>
                    {categorias.map((cat) => (
                      <option key={cat.lookupId} value={cat.lookupId}>{cat.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="preco" className="block text-sm font-bold text-gray-100">Preço (R$) *</label>
                  <input
                    id="preco" type="number" step="0.01" min="0" required
                    className="mt-1 appearance-none rounded-lg block w-full px-4 py-3 border border-neutral-700 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C2AE82] bg-neutral-900 sm:text-sm transition-all"
                    placeholder="Ex: 149.90"
                    value={preco} onChange={(e) => setPreco(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="descricao" className="block text-sm font-bold text-gray-100">Descrição</label>
                <textarea
                  id="descricao" rows={3}
                  className="mt-1 appearance-none rounded-lg block w-full px-4 py-3 border border-neutral-700 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C2AE82] bg-neutral-900 sm:text-sm transition-all resize-none"
                  placeholder="Detalhes sobre o tecido, caimento..."
                  value={descricao} onChange={(e) => setDescricao(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit" disabled={salvando || fazendoUpload}
                  className="w-full flex justify-center py-3 px-8 border border-transparent text-sm font-extrabold rounded-lg text-black bg-[#C2AE82] hover:bg-[#a8956b] focus:outline-none disabled:opacity-50 transition-all shadow-lg"
                >
                  {salvando ? "Salvando..." : "Salvar Produto"}
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
}