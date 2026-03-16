'use client';

export interface Cliente {
  nome: string;
  telefone?: string;
  email?: string;
}

export interface ItemPedido {
  produtoNome: string;
  variacaoCor?: string;
  variacaoTamanho?: string;
  quantidade: number;
  precoUnitario: number;
}

export interface Pedido {
  lookupId: string;
  status: string;
  valorTotal: number;
  dataHora: string;
  cliente: Cliente;
  itens?: ItemPedido[];
}

interface ModalDetalhesPedidoProps {
  isOpen: boolean;
  pedidoSelecionado: Pedido | null;
  onClose: () => void;
  formatarData: (dataIso: string) => string;
  formatarMoeda: (valor: number) => string;
  getStatusBadge: (status: string) => string;
}

export default function ModalDetalhesPedido({
  isOpen,
  pedidoSelecionado,
  onClose,
  formatarData,
  formatarMoeda,
  getStatusBadge,
}: ModalDetalhesPedidoProps) {

  if (!isOpen || !pedidoSelecionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="bg-neutral-900 border-t-4 border-[#C2AE82] rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">

        {/* Header do Modal - DATA EM DESTAQUE E ID MENOR */}
        <div className="p-6 border-b border-neutral-800 flex justify-between items-start">
          <div>
            {/* 👇 Data Grande e em Foco */}
            <h3 className="text-2xl font-extrabold text-white">
              {formatarData(pedidoSelecionado.dataHora)}
            </h3>
            {/* 👇 ID Menor como detalhe */}
            <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-mono">
              Pedido <span className="text-[#C2AE82]">#{pedidoSelecionado.lookupId.split("-")[0]}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors bg-neutral-800 p-2 rounded-lg">
            ✕
          </button>
        </div>

        {/* Corpo do Modal (Com Scroll) */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Info do Cliente e Status */}
          <div className="grid grid-cols-2 gap-4 bg-black p-4 rounded-lg border border-neutral-800">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Cliente</p>
              <p className="font-bold text-white">{pedidoSelecionado.cliente?.nome}</p>
              <p className="text-sm text-gray-400">{pedidoSelecionado.cliente?.telefone || "Sem telefone"}</p>
              <p className="text-sm text-gray-400">{pedidoSelecionado.cliente?.email || "Sem e-mail"}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status Atual</p>
              <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${getStatusBadge(pedidoSelecionado.status)}`}>
                {pedidoSelecionado.status || "Desconhecido"}
              </span>
            </div>
          </div>

          {/* Lista de Itens */}
          <div>
            <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3 border-b border-neutral-800 pb-2">Itens Comprados</h4>

            {pedidoSelecionado.itens && pedidoSelecionado.itens.length > 0 ? (
              <ul className="space-y-3">
                {pedidoSelecionado.itens.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-neutral-800/50 p-3 rounded-lg border border-neutral-800">
                    <div>
                      <p className="font-bold text-gray-200">{item.produtoNome}</p>
                      <p className="text-xs text-gray-500">
                        {item.variacaoCor} {item.variacaoTamanho ? `- Tam: ${item.variacaoTamanho}` : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{item.quantidade}x <span className="text-white">{formatarMoeda(item.precoUnitario)}</span></p>
                      <p className="font-bold text-[#C2AE82]">{formatarMoeda(item.quantidade * item.precoUnitario)}</p>
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
          <span className="text-sm font-bold text-gray-400 uppercase">Total do Pedido</span>
          <span className="text-2xl font-extrabold text-[#C2AE82]">{formatarMoeda(pedidoSelecionado.valorTotal)}</span>
        </div>

      </div>
    </div>
  );
}