import Link from "next/link";

// Essa interface reflete os dados que o seu Spring Boot (ProdutoResponseDTO) vai devolver
export interface Produto {
  lookupId: string;
  nome: string;
  categoria: string;
  preco: number;
  imagemUrl?: string; // Colocamos opcional porque ainda não implementamos upload de fotos no back-end
}

interface ProdutoCardProps {
  produto: Produto;
}

export default function ProdutoCard({ produto }: ProdutoCardProps) {
  // Formatador nativo do JavaScript para transformar 99.9 em "R$ 99,90"
  const precoFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(produto.preco);

  // Usamos um placeholder cinza caso o produto não tenha foto ainda
  const imagemPadrao = "https://via.placeholder.com/400x500?text=Sem+Foto";

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">

      {/* Área da Imagem */}
      <div className="relative h-80 w-full overflow-hidden bg-gray-100">
        <img
          src={produto.imagemUrl || imagemPadrao}
          alt={produto.nome}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {/* Etiqueta de Categoria (ex: MODA_PRAIA) */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 text-black backdrop-blur-sm shadow-sm">
            {produto.categoria.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Área de Informações */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 truncate">
          <Link href={`/produtos/${produto.lookupId}`}>
            {/* O "absolute inset-0" faz com que o card inteiro seja clicável, não apenas o texto */}
            <span aria-hidden="true" className="absolute inset-0" />
            {produto.nome}
          </Link>
        </h3>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <p className="text-xl font-extrabold text-black">{precoFormatado}</p>

          {/* Botão de Ação Visual */}
          <button className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors z-10 relative">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}