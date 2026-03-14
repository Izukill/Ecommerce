'use client';

import Link from "next/link";


interface ActionCardProps {
  icone: string;
  titulo: string;
  descricao: string;
  textoBotao: string;
  href: string;
}

export default function ActionCard({ icone, titulo, descricao, textoBotao, href }: ActionCardProps) {
  return (
    <div className="bg-black p-6 rounded-xl shadow-2xl border-t-4 border-[#C2AE82] flex flex-col items-center justify-center text-center hover:bg-neutral-900 transition-colors">
      <span className="text-5xl mb-4">{icone}</span>
      <h3 className="text-xl font-bold text-white mb-2">{titulo}</h3>
      <p className="text-gray-400 text-sm mb-6">{descricao}</p>

      {/* Botão Padronizado Dourado */}
      <Link
        href={href}
        className="px-6 py-2 bg-[#C2AE82] text-black font-extrabold rounded-lg hover:bg-[#a8956b] transition-all shadow-lg hover:scale-105"
      >
        {textoBotao}
      </Link>
    </div>
  );
}