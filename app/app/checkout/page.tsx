'use client';

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/contexts/CartContext";
import { api } from "@/lib/api";

import Header from "@/app/components/Header";
import DadosCliente from "../components/DadosCliente";
import EnderecoEntrega from "../components/EnderecoEntrega";
import ResumoPedido from "../components/ResumoPedido";
import ModalSucesso from "../components/ModalSucesso";

export default function CheckoutPage() {
  const router = useRouter();
  const { carrinho, valorTotal, limparCarrinho } = useCart();

  const [formData, setFormData] = useState({
    nome: "", email: "", cpf: "", telefone: "",
    cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", estado: ""
  });

  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState("");


  const [pedidoRealizadoId, setPedidoRealizadoId] = useState<string | null>(null);


  useEffect(() => {
    if (carrinho.length === 0 && !processando && !pedidoRealizadoId) {
      router.push("/");
    }
  }, [carrinho, router, processando, pedidoRealizadoId]);

  const handleFinalizarPedido = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    setProcessando(true);

    try {
      const payloadPedido = {
        cliente: {
          nome: formData.nome, email: formData.email, cpf: formData.cpf, telefone: formData.telefone
        },
        enderecoEntrega: {
          cep: formData.cep, logradouro: formData.logradouro, numero: formData.numero,
          complemento: formData.complemento, bairro: formData.bairro, cidade: formData.cidade, estado: formData.estado
        },
        itens: carrinho.map(item => ({
          variacaoProdutoId: item.variacaoId,
          produtoId: item.produtoId,
          quantidade: Number(item.quantidade),
          precoUnitario: item.preco
        })),
        valorTotal: valorTotal
      };

      const response = await api.post("/pedidos", payloadPedido);

      // Abre o modal de sucesso com o ID que veio do Java!
      setPedidoRealizadoId(response.data.lookupId || response.data.id || "123456");
      limparCarrinho(); // Esvazia o carrinho por trás dos panos

    } catch (error: any) {
      setErro(error.response?.data?.message || "Erro ao processar seu pedido.");
    } finally {
      setProcessando(false);
    }
  };

  if (carrinho.length === 0 && !pedidoRealizadoId) return null;

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col relative">
      <Header />

      <main className="flex-grow pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Finalizar Compra</h1>
            <p className="text-gray-400 mt-2">Preencha seus dados para concluir o pedido de forma rápida e segura.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 xl:col-span-8 space-y-8">
              <form id="checkout-form" onSubmit={handleFinalizarPedido} className="space-y-8">
                {erro && (
                  <div className="bg-red-950/50 border-l-4 border-red-500 p-4 rounded-md text-sm text-red-200 font-semibold">
                    {erro}
                  </div>
                )}
                <DadosCliente valores={formData} setValores={setFormData} />
                <EnderecoEntrega valores={formData} setValores={setFormData} />
              </form>
            </div>

            <div className="lg:col-span-5 xl:col-span-4">
              {/* Deixamos o componente muito mais limpo na chamada */}
              <ResumoPedido processando={processando} />
            </div>
          </div>
        </div>
      </main>
      {pedidoRealizadoId && <ModalSucesso pedidoId={pedidoRealizadoId} />}
    </div>
  );
}