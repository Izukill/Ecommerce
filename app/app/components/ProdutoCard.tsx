import Link from "next/link";

export interface Produto {
  lookupId: string;
  nome: string;
  categoria: string;
  preco: number;
  imagemUrl?: string;
}

interface ProdutoCardProps {
  produto: Produto;
}

export default function ProdutoCard({ produto }: ProdutoCardProps) {
  const precoFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(produto.preco);

  const imagemPadrao = "https://via.placeholder.com/400x500?text=Sem+Foto";

  return (
    // CARD: Fundo Preto Absoluto e Borda bem sutil para separar do fundo da página
    <div className="group relative flex flex-col bg-black rounded-2xl shadow-lg hover:shadow-xl hover:shadow-[#C2AE82]/20 transition-all duration-300 overflow-hidden border border-gray-800">

      {/* Área da Imagem */}
      <div className="relative h-80 w-full overflow-hidden bg-gray-900">
        <img
          src={produto.imagemUrl || imagemPadrao}
          alt={produto.nome}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        {/* Etiqueta de Categoria (Dourada com texto Preto) */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C2AE82] text-black shadow-md">
            {produto.categoria.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Área de Informações */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Nome do Produto (Texto Claro) */}
        <h3 className="text-lg font-bold text-gray-100 truncate group-hover:text-[#C2AE82] transition-colors">
          <Link href={`/produtos/${produto.lookupId}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {produto.nome}
          </Link>
        </h3>

        <div className="mt-auto pt-4 flex items-center justify-between">
          {/* Preço (Dourado) */}
          <p className="text-xl font-extrabold text-[#C2AE82]">{precoFormatado}</p>

          {/* Botão de Carrinho Visual (Preto com borda dourada) */}
          <button className="h-10 w-10 rounded-full bg-black border border-[#C2AE82] flex items-center justify-center text-[#C2AE82] group-hover:bg-[#C2AE82] group-hover:text-black transition-colors z-10 relative shadow-sm">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}