'use client';

interface GaleriaProdutoProps {
  imagemCapa: string;
  imagemVariacao?: string | null;
  nomeProduto: string;
}

export default function GaleriaProduto({ imagemCapa, imagemVariacao, nomeProduto }: GaleriaProdutoProps) {
  // Se a variação selecionada tiver foto, mostra ela. Se não, mostra a capa original.
  const imagemExibicao = imagemVariacao || imagemCapa || "/placeholder-produto.png";

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-[4/5] w-full bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl relative">
        <img
          src={imagemExibicao}
          alt={nomeProduto}
          className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
        />
      </div>
    </div>
  );
}