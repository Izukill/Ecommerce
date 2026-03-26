"use client";

import { useState } from "react";

interface InputSenhaProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default function InputSenha({ id, label, value, onChange, placeholder = "••••••••" }: InputSenhaProps) {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-gray-100">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          name={id}
          type={mostrarSenha ? "text" : "password"}
          required
          // Adicionamos as proteções do autofill aqui no final também!
          className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C2AE82] focus:border-transparent bg-black sm:text-sm pr-10 [&:autofill]:shadow-[inset_0_0_0px_1000px_#000000] [&:autofill]:[-webkit-text-fill-color:#F3F4F6]"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />

        {/* Botão do Olhinho  */}
        <button
          type="button"
          onClick={() => setMostrarSenha(!mostrarSenha)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 focus:outline-none"
          tabIndex={-1}
        >
          {mostrarSenha ? (
            // Ícone: Olho Aberto
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            // Ícone: Olho Fechado
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.52-3.11m2.59-2.59A8.96 8.96 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-1.24 2.37m-2.91 2.91L9.81 14.19m4.38-4.38L12 12" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}