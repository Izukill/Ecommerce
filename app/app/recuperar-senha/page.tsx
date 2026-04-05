'use client';

import { useState, FormEvent, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import InputSenha from "@/app/components/login/InputSenha";

function RecuperarSenhaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [etapa, setEtapa] = useState<1 | 2 | 3>(1);
  const [carregando, setCarregando] = useState(false);

  // Estados da etapa 2 e 3
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Puxa o e-mail da URL (aquele que mandamos lá da tela de login)
  useEffect(() => {
    const emailDaUrl = searchParams.get("email");
    if (emailDaUrl) setEmail(emailDaUrl);
  }, [searchParams]);

  // Passo 1: Dispara o E-mail
  const handleSolicitarCodigo = async (e: FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    try {
      await api.post("/login/esqueci-senha", { email });
      toast.success("Código enviado para o seu e-mail!");
      setEtapa(2); // Vai pra tela de digitar o código
    } catch (error) {
      toast.error("Erro ao solicitar código. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  // Passo 2 e 3: Envia a nova senha com o código
  const handleRedefinirSenha = async (e: FormEvent) => {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem!");
      return;
    }
    if (codigo.length < 6) {
      toast.error("Digite o código de 6 dígitos.");
      return;
    }

    setCarregando(true);
    try {
      await api.post("/login/redefinir-senha", {
        email,
        codigo,
        novaSenha
      });
      toast.success("Senha alterada com sucesso! Faça login.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data || "Código inválido ou expirado.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-black p-10 rounded-xl shadow-2xl border-t-4 border-[#C2AE82]">

        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Recuperar Senha</h2>
          <p className="mt-2 text-sm text-gray-400">
            {etapa === 1 && "Informe seu e-mail para receber um código de recuperação."}
            {etapa > 1 && "Digite o código recebido e sua nova senha."}
          </p>
        </div>

        {/* ETAPA 1: Pede apenas o E-mail */}
        {etapa === 1 && (
          <form className="mt-8 space-y-6 animate-in fade-in" onSubmit={handleSolicitarCodigo}>
            <div>
              <label className="block text-sm font-bold text-gray-100 mb-1">E-mail cadastrado</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C2AE82]"
                placeholder="seu@email.com"
              />
            </div>
            <button
              type="submit"
              disabled={carregando || !email}
              className="w-full py-3 bg-[#C2AE82] hover:bg-[#a8956b] text-black font-extrabold rounded-lg transition-colors disabled:opacity-50"
            >
              {carregando ? "Enviando..." : "Receber Código"}
            </button>
          </form>
        )}

        {/* ETAPAS 2 e 3: Digita o código e a nova senha juntos */}
        {etapa > 1 && (
          <form className="mt-8 space-y-5 animate-in slide-in-from-right-4" onSubmit={handleRedefinirSenha}>

            <div>
              <label className="block text-sm font-bold text-gray-100 mb-1">Código de 6 dígitos</label>
              <input
                type="text"
                required
                maxLength={6}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 text-center tracking-widest text-2xl font-bold bg-neutral-900 border border-neutral-700 rounded-lg text-[#C2AE82] focus:outline-none focus:ring-2 focus:ring-[#C2AE82] placeholder-neutral-700"
                placeholder="000000"
              />
            </div>

            <InputSenha
              id="novaSenha"
              label="Nova Senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />

            <InputSenha
              id="confirmarSenha"
              label="Confirmar Nova Senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />

            <button
              type="submit"
              disabled={carregando || codigo.length < 6 || !novaSenha}
              className="w-full mt-6 py-3 bg-[#C2AE82] hover:bg-[#a8956b] text-black font-extrabold rounded-lg transition-colors disabled:opacity-50"
            >
              {carregando ? "Validando..." : "Alterar Senha"}
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-white transition-colors">
            &larr; Voltar para o Login
          </Link>
        </div>

      </div>
    </div>
  );
}

// O Suspense é necessário no Next.js quando usamos useSearchParams
export default function RecuperarSenhaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950 flex items-center justify-center text-[#C2AE82]">Carregando...</div>}>
      <RecuperarSenhaContent />
    </Suspense>
  );
}