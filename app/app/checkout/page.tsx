'use client';

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/contexts/CartContext";
import { api } from "@/lib/api";

import Header from "@/app/components/layout/Header";
import DadosCliente from "../components/pedido/DadosCliente";
import EnderecoEntrega from "../components/pedido/EnderecoEntrega";
import ResumoPedido from "../components/pedido/ResumoPedido";
import ModalPagamentoPix from "../components/pedido/ModalPagamentoPix";

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

  const [pixData, setPixData] = useState<any>(null);
  const [isModalPixAberto, setIsModalPixAberto] = useState(false);
  const [valorFinalCongelado, setValorFinalCongelado] = useState(0);

  useEffect(() => {
    // Adicionamos o isModalPixAberto aqui para não redirecionar enquanto o cara paga
    if (carrinho.length === 0 && !processando && !pedidoRealizadoId && !isModalPixAberto) {
      router.push("/");
    }
  }, [carrinho, router, processando, pedidoRealizadoId, isModalPixAberto]);

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
        }))
      };

      const response = await api.post("/pedidos", payloadPedido);

      //pega o pacote do pix lá do backend
      const { pedido, pix } = response.data;

      setPedidoRealizadoId(pedido.lookupId);
      setPixData(pix); //Guarda o QR Code
      setValorFinalCongelado(pedido.valorTotal);
      setIsModalPixAberto(true);

      limparCarrinho();

    } catch (error: any) {
      setErro(error.response?.data?.message || "Erro ao processar seu pedido.");
    } finally {
      setProcessando(false);
    }
  };

  const handleFecharModalPix = () => {
    setIsModalPixAberto(false);
    // Quando ele fechar o modal, podemos mandar ele para a tela inicial ou para uma tela de "Meus Pedidos"
    router.push("/");
  };

  if (carrinho.length === 0 && !pedidoRealizadoId && !isModalPixAberto) return null;

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

              {/* 👇 A MÁGICA ESTÁ AQUI: Essa div 'sticky' gruda no topo (com uma margem de top-24 para não bater no Header) e faz os dois descerem juntos! */}
              <div className="sticky top-24 space-y-6">

                <ResumoPedido processando={processando} />

                {/* MENSAGEM DE AVISO: Pagamento Exclusivo via Pix */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex items-start gap-4 shadow-lg animate-in fade-in duration-500">
                  <div className="flex-shrink-0 bg-[#C2AE82]/10 p-2.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#C2AE82]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm tracking-wide">Pagamento Exclusivo via Pix</h3>
                    <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">
                      Para garantir a separação imediata e o envio mais rápido do seu pacote, atualmente processamos apenas pagamentos por Pix. <strong className="text-gray-300 font-medium">O QR Code será gerado ao finalizar o pedido.</strong>
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      <ModalPagamentoPix
        isOpen={isModalPixAberto}
        pixData={pixData}
        valorTotal={valorFinalCongelado}
        onClose={handleFecharModalPix}
      />

    </div>
  );
}