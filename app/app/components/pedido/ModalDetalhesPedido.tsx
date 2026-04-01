'use client';

export interface Cliente {
  nome: string;
  telefone?: string;
  email?: string;
}

export interface Endereco {
  cep: string;
  logradouro?: string;
  rua?: string;
  numero: number | string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface ItemPedido {
  nomeProduto: string;
  imagemUrl?: string;
  cor?: string;
  tamanho?: string;
  quantidade: number;
  precoUnitario: number;
}

export interface Pedido {
  lookupId: string;
  status: string;
  valorTotal: number;
  dataHora: string;
  cliente: Cliente;
  enderecoEntrega?: Endereco;
  itens?: ItemPedido[];
}

interface ModalDetalhesPedidoProps {
  isOpen: boolean;
  pedidoSelecionado: Pedido | null;
  onClose: () => void;
  formatarData: (dataIso: string) => string;
  formatarMoeda: (valor: number) => string;
  getStatusBadge: (status: string) => string;
  onAtualizarStatus: (pedidoId: string, novoStatus: string) => void;
}

export default function ModalDetalhesPedido({
  isOpen,
  pedidoSelecionado,
  onClose,
  formatarData,
  formatarMoeda,
  getStatusBadge,
  onAtualizarStatus,
}: ModalDetalhesPedidoProps) {

  if (!isOpen || !pedidoSelecionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="bg-neutral-900 border-t-4 border-[#C2AE82] rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">

        {/* Header do Modal */}
        <div className="p-6 border-b border-neutral-800 flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-extrabold text-white">
              <span className="text-gray-400 font-normal mr-2">Data:</span>
              {formatarData(pedidoSelecionado.dataHora)}
            </h3>
            <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-mono">
              Pedido <span className="text-[#C2AE82]">#{pedidoSelecionado.lookupId.split("-")[0]}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className={`px-4 py-1.5 text-xs font-bold uppercase rounded-full border ${getStatusBadge(pedidoSelecionado.status)}`}>
              {pedidoSelecionado.status || "Desconhecido"}
            </span>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors bg-neutral-800 p-2 rounded-lg">
              ✕
            </button>
          </div>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 overflow-y-auto space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bloco Cliente */}
            <div className="bg-black p-4 rounded-lg border border-neutral-800">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cliente</p>
              <p className="text-sm text-white"><span className="font-semibold text-gray-400">Nome:</span> {pedidoSelecionado.cliente?.nome}</p>
              <p className="text-sm text-white"><span className="font-semibold text-gray-400">Número:</span> {pedidoSelecionado.cliente?.telefone || "Sem telefone"}</p>
              <p className="text-sm text-white"><span className="font-semibold text-gray-400">E-mail:</span> {pedidoSelecionado.cliente?.email || "Sem e-mail"}</p>
            </div>

            {/* Bloco Endereço */}
            <div className="bg-black p-4 rounded-lg border border-neutral-800">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Endereço de Entrega</p>
              {pedidoSelecionado.enderecoEntrega ? (
                <div className="space-y-0.5">
                  <p className="text-sm text-white">
                    <span className="font-semibold text-gray-400">Rua:</span> {pedidoSelecionado.enderecoEntrega.logradouro || pedidoSelecionado.enderecoEntrega.rua}, Nº {pedidoSelecionado.enderecoEntrega.numero}
                  </p>
                  {pedidoSelecionado.enderecoEntrega.complemento && (
                    <p className="text-sm text-white"><span className="font-semibold text-gray-400">Comp:</span> {pedidoSelecionado.enderecoEntrega.complemento}</p>
                  )}
                  <p className="text-sm text-white"><span className="font-semibold text-gray-400">Bairro:</span> {pedidoSelecionado.enderecoEntrega.bairro}</p>
                  <p className="text-sm text-white"><span className="font-semibold text-gray-400">Cidade:</span> {pedidoSelecionado.enderecoEntrega.cidade} - {pedidoSelecionado.enderecoEntrega.estado}</p>
                  <p className="text-sm text-white"><span className="font-semibold text-gray-400">CEP:</span> {pedidoSelecionado.enderecoEntrega.cep}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic mt-2">Endereço não retornado pelo servidor.</p>
              )}
            </div>
          </div>

          {/* Lista de Itens */}
          <div>
            <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3 border-b border-neutral-800 pb-2">Itens Comprados</h4>
            {pedidoSelecionado.itens && pedidoSelecionado.itens.length > 0 ? (
              <ul className="space-y-3">
                {pedidoSelecionado.itens.map((item, idx) => (
                  <li key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-neutral-800/50 p-4 rounded-lg border border-neutral-800 gap-4">

                    {/* 👇 Lado Esquerdo: Imagem + Textos */}
                    <div className="flex items-center gap-4">

                      {/* Container da Imagem */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-neutral-900 rounded-md border border-neutral-700 overflow-hidden flex items-center justify-center">
                        {item.imagemUrl ? (
                          <img
                            src={item.imagemUrl}
                            alt={item.nomeProduto}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-neutral-600 text-xs text-center px-1">Sem foto</span>
                        )}
                      </div>

                      {/* Textos do Produto */}
                      <div>
                        <p className="font-bold text-base sm:text-lg text-gray-200 line-clamp-2">{item.nomeProduto}</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {item.cor || "Cor Única"} {item.tamanho ? `- Tam: ${item.tamanho}` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Lado Direito: Quantidade e Preços */}
                    <div className="flex items-center gap-4 self-end sm:self-auto flex-shrink-0">
                      <span className="text-xl sm:text-2xl font-black text-white bg-black px-3 py-1 rounded-md border border-neutral-700">
                        {item.quantidade}x
                      </span>
                      <div className="text-right border-l border-neutral-700 pl-4">
                        <p className="text-xs text-gray-400">{formatarMoeda(item.precoUnitario)} un.</p>
                        <p className="font-bold text-lg text-[#C2AE82]">{formatarMoeda(item.quantidade * item.precoUnitario)}</p>
                      </div>
                    </div>

                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">Itens do pedido não carregados.</p>
            )}
          </div>

        </div>

        {/* Footer do Modal */}
        <div className="p-6 border-t border-neutral-800 bg-black/50 rounded-b-xl flex justify-between items-center">

          {pedidoSelecionado.status === "PAGO" ? (
            <button
              onClick={() => onAtualizarStatus(pedidoSelecionado.lookupId, "ENVIADO")}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all border border-blue-500"
            >
              Marcar como Enviado
            </button>
          ) : (
            <div></div>
          )}

          <div className="text-right flex items-center gap-3">
            <span className="text-sm font-bold text-gray-400 uppercase">Total do Pedido</span>
            <span className="text-2xl font-extrabold text-[#C2AE82]">{formatarMoeda(pedidoSelecionado.valorTotal)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}