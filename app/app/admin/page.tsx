'use client';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8"> {/* Aumentei o espaçamento geral para respirar mais */}

      {/* Título da Página com fontes maiores e mais unidas (tracking-tight) */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Visão Geral</h2>
        <p className="text-base text-gray-400 mt-2">Bem-vindo ao centro de controle da MirlleFitness.</p>
      </div>

      {/* Cards de Resumo: Fundo Neutral-900, todas com Borda Dourada na Esquerda */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-neutral-900 p-6 rounded-xl shadow-lg border border-neutral-800 border-l-4 border-l-[#C2AE82] hover:bg-neutral-800 transition-colors">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pedidos Hoje</p>
          <p className="text-4xl font-black text-white mt-3">14</p>
        </div>

        <div className="bg-neutral-900 p-6 rounded-xl shadow-lg border border-neutral-800 border-l-4 border-l-[#C2AE82] hover:bg-neutral-800 transition-colors">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Faturamento (Mês)</p>
          <p className="text-4xl font-black text-[#C2AE82] mt-3">R$ 4.250,00</p>
        </div>

        <div className="bg-neutral-900 p-6 rounded-xl shadow-lg border border-neutral-800 border-l-4 border-l-[#C2AE82] hover:bg-neutral-800 transition-colors">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Produtos Ativos</p>
          <p className="text-4xl font-black text-white mt-3">56</p>
        </div>

        <div className="bg-neutral-900 p-6 rounded-xl shadow-lg border border-neutral-800 border-l-4 border-l-[#C2AE82] hover:bg-neutral-800 transition-colors">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Novos Clientes</p>
          <p className="text-4xl font-black text-white mt-3">8</p>
        </div>

      </div>

      {/* Espaço para tabela de últimos pedidos */}
      <div className="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 p-10 h-96 flex flex-col items-center justify-center">
        <p className="text-gray-300 text-lg font-semibold text-center">
          Aqui colocaremos a tabela com os "Últimos Pedidos Recebidos"
        </p>
        <p className="text-sm text-gray-500 font-medium mt-2 text-center">
          (Faremos isso quando integrarmos a rota de Pedidos!)
        </p>
      </div>

    </div>
  );
}