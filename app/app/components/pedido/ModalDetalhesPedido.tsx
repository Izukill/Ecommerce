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
  isAdmin?: boolean;
  onVerPix?: (pedidoId: string, valorTotal: number) => void;
}

export default function ModalDetalhesPedido({
  isOpen,
  pedidoSelecionado,
  onClose,
  formatarData,
  formatarMoeda,
  getStatusBadge,
  onAtualizarStatus,
  isAdmin = false,
  onVerPix
}: ModalDetalhesPedidoProps) {

  if (!isOpen || !pedidoSelecionado) return null;


  const renderBotoesAcao = () => {

    // VISÃO DO CLIENTE
    if (!isAdmin) {
      switch (pedidoSelecionado.status) {
        case "AGUARDANDO_PAGAMENTO":
          return (
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {onVerPix && (
                <button
                  onClick={() => onVerPix(pedidoSelecionado.lookupId, pedidoSelecionado.valorTotal)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-green-500/20 hover:bg-green-500/40 text-green-400 font-extrabold text-sm rounded-lg transition-colors border border-green-500/50"
                >
                  ✔️ Pagar Agora
                </button>
              )}
              <button
                onClick={() => onAtualizarStatus(pedidoSelecionado.lookupId, "CANCELADO")}
                className="flex-1 sm:flex-none px-4 py-2 bg-red-600/10 hover:bg-red-600/30 text-red-400 font-extrabold text-sm rounded-lg transition-colors border border-red-600/30"
              >
                ✕ Cancelar Pedido
              </button>
            </div>
          );
        case "CANCELADO":
          return (
            <button
              onClick={() => onAtualizarStatus(pedidoSelecionado.lookupId, "AGUARDANDO_PAGAMENTO")}
              className="w-full sm:w-auto px-4 py-2 bg-yellow-600/10 hover:bg-yellow-600/30 text-yellow-500 font-extrabold text-sm rounded-lg transition-colors border border-yellow-600/30"
            >
              ⟲ Reabrir Pedido
            </button>
          );
        default:
          return null;
      }
    }

    switch (pedidoSelecionado.status) {
      case "AGUARDANDO_PAGAMENTO":
        return (
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => onAtualizarStatus(pedidoSelecionado.lookupId, "PAGO")}
              className="flex-1 sm:flex-none px-4 py-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 font-extrabold text-sm rounded-lg transition-colors border border-green-600/50"
            >
              ✓ Forçar Pagamento
            </button>
            <button
              onClick={() => onAtualizarStatus(pedidoSelecionado.lookupId, "CANCELADO")}
              className="flex-1 sm:flex-none px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 font-extrabold text-sm rounded-lg transition-colors border border-red-600/50"
            >
              ✕ Cancelar
            </button>
          </div>
        );
      case "PAGO":
        return (
          <button
            onClick={() => onAtualizarStatus(pedidoSelecionado.lookupId, "ENVIADO")}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all border border-blue-500"
          >
            📦 Marcar como Enviado
          </button>
        );
      case "CANCELADO":
        return (
          <button
            onClick={() => onAtualizarStatus(pedidoSelecionado.lookupId, "AGUARDANDO_PAGAMENTO")}
            className="w-full sm:w-auto px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-500 font-extrabold text-sm rounded-lg transition-colors border border-yellow-600/50"
          >
            ⟲ Reabrir Pedido
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="bg-neutral-900 border-t-4 border-[#C2AE82] rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">

        <div className="p-4 sm:p-6 border-b border-neutral-800 flex justify-between items-start gap-4">
          <div className="break-all">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              <span className="text-gray-400 font-normal mr-2 hidden sm:inline">Data:</span>
              <span className="text-gray-400 font-normal mr-1 sm:hidden">🗓️</span>
              {formatarData(pedidoSelecionado.dataHora)}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 uppercase tracking-wider font-mono">
              Pedido <span className="text-[#C2AE82]">#{pedidoSelecionado.lookupId.split("-")[0]}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-4 flex-shrink-0">
            <span className={`px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase rounded-full border text-center ${getStatusBadge(pedidoSelecionado.status)}`}>
              {pedidoSelecionado.status || "Desconhecido"}
            </span>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors bg-neutral-800 p-1.5 sm:p-2 rounded-lg">
              ✕
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 custom-scrollbar">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black p-4 rounded-lg border border-neutral-800 overflow-hidden">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cliente</p>
              <p className="text-sm text-white truncate"><span className="font-semibold text-gray-400">Nome:</span> {pedidoSelecionado.cliente?.nome}</p>
              <p className="text-sm text-white truncate"><span className="font-semibold text-gray-400">Número:</span> {pedidoSelecionado.cliente?.telefone || "Sem telefone"}</p>
              <p className="text-sm text-white truncate"><span className="font-semibold text-gray-400">E-mail:</span> {pedidoSelecionado.cliente?.email || "Sem e-mail"}</p>
            </div>

            <div className="bg-black p-4 rounded-lg border border-neutral-800 overflow-hidden">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Endereço de Entrega</p>
              {pedidoSelecionado.enderecoEntrega ? (
                <div className="space-y-0.5">
                  <p className="text-sm text-white truncate">
                    <span className="font-semibold text-gray-400">Rua:</span> {pedidoSelecionado.enderecoEntrega.logradouro || pedidoSelecionado.enderecoEntrega.rua}, Nº {pedidoSelecionado.enderecoEntrega.numero}
                  </p>
                  {pedidoSelecionado.enderecoEntrega.complemento && (
                    <p className="text-sm text-white truncate"><span className="font-semibold text-gray-400">Comp:</span> {pedidoSelecionado.enderecoEntrega.complemento}</p>
                  )}
                  <p className="text-sm text-white truncate"><span className="font-semibold text-gray-400">Bairro:</span> {pedidoSelecionado.enderecoEntrega.bairro}</p>
                  <p className="text-sm text-white truncate"><span className="font-semibold text-gray-400">Cidade:</span> {pedidoSelecionado.enderecoEntrega.cidade} - {pedidoSelecionado.enderecoEntrega.estado}</p>
                  <p className="text-sm text-white truncate"><span className="font-semibold text-gray-400">CEP:</span> {pedidoSelecionado.enderecoEntrega.cep}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic mt-2">Endereço não retornado pelo servidor.</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3 border-b border-neutral-800 pb-2">Itens Comprados</h4>
            {pedidoSelecionado.itens && pedidoSelecionado.itens.length > 0 ? (
              <ul className="space-y-3">
                {pedidoSelecionado.itens.map((item, idx) => (
                  <li key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-neutral-800/50 p-3 sm:p-4 rounded-lg border border-neutral-800 gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-neutral-900 rounded-md border border-neutral-700 overflow-hidden flex items-center justify-center">
                        {item.imagemUrl ? (
                          <img src={item.imagemUrl} alt={item.nomeProduto} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-neutral-600 text-[10px] sm:text-xs text-center px-1">Sem foto</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm sm:text-lg text-gray-200 line-clamp-2 leading-tight">{item.nomeProduto}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {item.cor || "Cor Única"} {item.tamanho ? `- Tam: ${item.tamanho}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t border-neutral-700 sm:border-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
                      <span className="text-lg sm:text-2xl font-black text-white bg-black px-3 py-1 rounded-md border border-neutral-700">
                        {item.quantidade}x
                      </span>
                      <div className="text-right sm:border-l sm:border-neutral-700 sm:pl-4">
                        <p className="text-[10px] sm:text-xs text-gray-400">{formatarMoeda(item.precoUnitario)} un.</p>
                        <p className="font-bold text-base sm:text-lg text-[#C2AE82]">{formatarMoeda(item.quantidade * item.precoUnitario)}</p>
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

        <div className="p-4 sm:p-6 border-t border-neutral-800 bg-black/50 rounded-b-xl flex flex-col-reverse sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <div className="w-full sm:w-auto flex justify-center sm:justify-start">
            {renderBotoesAcao()}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end bg-neutral-900 sm:bg-transparent p-3 sm:p-0 rounded-lg border border-neutral-800 sm:border-0">
            <span className="text-xs sm:text-sm font-bold text-gray-400 uppercase">Total do Pedido</span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#C2AE82]">{formatarMoeda(pedidoSelecionado.valorTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}