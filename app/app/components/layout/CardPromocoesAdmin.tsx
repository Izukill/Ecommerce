'use client';

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { Tag, Trash2 } from "lucide-react";

interface Categoria {
  lookupId: string;
  nome: string;
}

export default function CardPromocoesAdmin() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [desconto, setDesconto] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    api.get("/categorias")
      .then(res => {
        const dados = res.data?.content || res.data || [];
        setCategorias(Array.isArray(dados) ? dados : []);
      })
      .catch(() => toast.error("Erro ao carregar categorias"));
  }, []);

  const aplicarPromocao = async () => {
    if (!categoriaSelecionada || !desconto) {
      toast.error("Selecione a categoria e o valor do desconto.");
      return;
    }

    const valorDesconto = parseFloat(desconto);
    if (isNaN(valorDesconto) || valorDesconto <= 0 || valorDesconto >= 100) {
      toast.error("O desconto deve ser entre 1% e 99%.");
      return;
    }

    setCarregando(true);
    try {
      // Faz o POST para o endpoint que criamos no Java!
      await api.post(`/produtos/categoria/${categoriaSelecionada}/promocao?desconto=${valorDesconto}`);
      toast.success("Promoção aplicada com sucesso!");
      setDesconto("");
    } catch (error) {
      toast.error("Erro ao aplicar promoção.");
    } finally {
      setCarregando(false);
    }
  };

  const removerPromocao = async () => {
    if (!categoriaSelecionada) {
      toast.error("Selecione uma categoria primeiro.");
      return;
    }

    if (!confirm("Tem certeza que deseja remover as ofertas desta categoria? Os produtos voltarão ao preço original.")) return;

    setCarregando(true);
    try {
      await api.delete(`/produtos/categoria/${categoriaSelecionada}/promocao`);
      toast.success("Promoção removida com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover promoção.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-red-500/20 text-red-500 rounded-lg">
          <Tag size={24} />
        </div>
        <h3 className="text-xl font-bold text-white">Promoções em Lote</h3>
      </div>

      <p className="text-sm text-gray-400 mb-6">
        Aplique ou remova um desconto em porcentagem (%) para todos os produtos ativos de uma categoria de uma só vez.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria Alvo</label>
          <select
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-sm focus:ring-1 focus:ring-red-500 outline-none appearance-none"
          >
            <option value="">-- Selecione uma Categoria --</option>
            {categorias.map(cat => (
              <option key={cat.lookupId} value={cat.lookupId}>{cat.nome}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">% de Desconto</label>
            <span className="absolute right-3 top-[30px] text-gray-500 font-bold">%</span>
            <input
              type="number"
              placeholder="Ex: 15"
              value={desconto}
              onChange={(e) => setDesconto(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-black border border-neutral-700 rounded-lg text-white font-bold focus:ring-1 focus:ring-red-500 outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <button
            onClick={aplicarPromocao}
            disabled={carregando}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-lg transition-colors disabled:opacity-50 h-[42px]"
          >
            Aplicar
          </button>
        </div>

        <button
          onClick={removerPromocao}
          disabled={carregando}
          className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-transparent hover:bg-red-950/30 text-red-400/80 hover:text-red-400 border border-red-900/30 hover:border-red-500/50 rounded-lg transition-all text-sm font-bold disabled:opacity-50"
        >
          <Trash2 size={16} /> Limpar ofertas desta categoria
        </button>
      </div>
    </div>
  );
}