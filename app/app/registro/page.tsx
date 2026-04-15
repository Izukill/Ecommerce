'use client';

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import InputSenha from "@/app/components/login/InputSenha";
import ModalVerificacaoEmail from "@/app/components/login/ModalVerificacaoEmail";
import toast from 'react-hot-toast';

export default function RegistroPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [isModalVerificacaoAberto, setIsModalVerificacaoAberto] = useState(false);

  const handleRegistro = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);

    try {
      await api.post("/clientes", { nome, email, senha });

      setIsModalVerificacaoAberto(true);
      toast.success("Conta criada! Quase lá...");

    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        setErro(error.response.data.detail);
      } else {
        console.error("Erro ao cadastrar:", error);
        toast.error(error.response?.data?.message || "Erro ao criar sua conta.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-black p-10 rounded-xl shadow-2xl border-t-4 border-[#C2AE82]">

        {/* registro  */}
        <div className="text-center">
          <Link href="/" className="text-3xl font-extrabold text-white tracking-tighter cursor-pointer">
            MIRLLE<span className="text-[#C2AE82]">FITNESS</span>
          </Link>
          <p className="mt-2 text-sm text-gray-400 font-medium">
            Crie sua conta para comprar
          </p>
        </div>

        {/* formulário */}
        <form className="mt-8 space-y-6" onSubmit={handleRegistro}>

          {erro && (
            <div className="bg-red-950 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-sm text-red-200 font-semibold">{erro}</p>
            </div>
          )}

          {sucesso && (
            <div className="bg-green-950 border-l-4 border-green-500 p-4 mb-4">
              <p className="text-sm text-green-200 font-semibold">Conta criada com sucesso! Redirecionando...</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-bold text-gray-100">Nome Completo</label>
              <div className="relative mt-1">
                <input
                  id="nome" type="text" required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C2AE82] focus:border-transparent bg-black sm:text-sm [&:autofill]:shadow-[inset_0_0_0px_1000px_#000000] [&:autofill]:[-webkit-text-fill-color:#F3F4F6]"
                  placeholder="Maria da Silva"
                  value={nome} onChange={(e) => setNome(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-100">E-mail</label>
              <div className="relative mt-1">
                <input
                  id="email" type="email" required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C2AE82] focus:border-transparent bg-black sm:text-sm [&:autofill]:shadow-[inset_0_0_0px_1000px_#000000] [&:autofill]:[-webkit-text-fill-color:#F3F4F6]"
                  placeholder="seu@email.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <InputSenha
                id="senha"
                label="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <div>
              <InputSenha
                id="confirmarSenha"
                label="Confirmar Senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit" disabled={carregando || sucesso}
              className="group relative w-full flex justify-center py-3 px-4 border text-sm font-bold rounded-md text-[#C2AE82] bg-black hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-all shadow-md border-neutral-800 hover:border-neutral-700"
            >
              {carregando ? "Criando conta..." : "Cadastrar"}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              Já tem uma conta? <Link href="/login" className="font-bold text-[#C2AE82] hover:underline">Faça login</Link>
            </p>
          </div>
        </form>
      </div>
      <ModalVerificacaoEmail
              isOpen={isModalVerificacaoAberto}
              emailDestino={email}
              onClose={() => setIsModalVerificacaoAberto(false)}
              aoVerificarComSucesso={() => {
                toast.success("Tudo pronto! Agora você já pode fazer login.");
                router.push("/login");
              }}
      />
    </div>
  );
}