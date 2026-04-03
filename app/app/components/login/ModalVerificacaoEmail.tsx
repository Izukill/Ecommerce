'use client';

import { useState, useEffect } from 'react';
import { api } from "@/lib/api";
import toast from 'react-hot-toast';

interface ModalVerificacaoEmailProps {
  isOpen: boolean;
  emailDestino: string;
  onClose: () => void;
  aoVerificarComSucesso: () => void;
}

export default function ModalVerificacaoEmail({
  isOpen,
  emailDestino,
  onClose,
  aoVerificarComSucesso
}: ModalVerificacaoEmailProps) {

  const [codigo, setCodigo] = useState('');
  const [validando, setValidando] = useState(false);

  // 👇 Novo estado para controlar os 5 minutos (300 segundos). Começa em 0 (liberado).
  const [tempoEspera, setTempoEspera] = useState(0);

  // 👇 Efeito que gerencia o cronômetro
  useEffect(() => {
    if (tempoEspera <= 0) return;

    // A cada 1 segundo (1000ms), diminui 1 do tempoEspera
    const intervalId = setInterval(() => {
      setTempoEspera((prev) => prev - 1);
    }, 1000);

    // Limpeza do intervalo para evitar vazamento de memória quando o componente sumir
    return () => clearInterval(intervalId);
  }, [tempoEspera]);

  if (!isOpen) return null;

  // Função auxiliar para deixar o tempo bonitinho (ex: 04:59)
  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60).toString().padStart(2, '0');
    const seg = (segundos % 60).toString().padStart(2, '0');
    return `${minutos}:${seg}`;
  };

  const handleVerificarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (codigo.length < 6) {
      toast.error("O código deve ter 6 números.");
      return;
    }

    setValidando(true);

    try {
      await api.post('/login/validar-codigo', {
        email: emailDestino,
        codigo: codigo
      });

      toast.success("E-mail verificado com sucesso! 🎉");
      aoVerificarComSucesso();
      onClose();

    } catch (error: any) {
      console.error("Erro na validação:", error);
      toast.error(error.response?.data?.message || "Código inválido ou expirado.");
    } finally {
      setValidando(false);
    }
  };

  const reenviarCodigo = async () => {
    // Trava de segurança extra caso tentem forçar o clique pelo console
    if (tempoEspera > 0) return;

    try {
      await api.post('/login/reenviar-codigo', { email: emailDestino });
      toast.success("Novo código enviado para o seu e-mail!");

      // 👇 Inicia o cronômetro de 5 minutos (300 segundos)
      setTempoEspera(300);
    } catch (error) {
      toast.error("Erro ao reenviar o código. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col items-center text-center p-8 relative">

        <div className="w-16 h-16 bg-[#C2AE82]/10 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#C2AE82]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h3 className="text-2xl font-extrabold text-white mb-2">Verifique seu E-mail</h3>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Enviamos um código de 6 dígitos para <br/>
          <strong className="text-white">{emailDestino}</strong>
        </p>

        <form onSubmit={handleVerificarCodigo} className="w-full space-y-6">

          <div>
            <input
              type="text"
              maxLength={6}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full text-center text-4xl tracking-[0.5em] font-black px-4 py-4 bg-black border border-neutral-700 rounded-xl text-[#C2AE82] focus:ring-2 focus:ring-[#C2AE82] outline-none transition placeholder-gray-800"
              required
            />
          </div>

          <button
            type="submit"
            disabled={validando || codigo.length < 6}
            className="w-full py-4 bg-[#C2AE82] hover:bg-[#a8956b] text-black font-extrabold text-lg rounded-xl shadow-[0_0_20px_rgba(194,174,130,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {validando ? "Verificando..." : "Confirmar Código"}
          </button>
        </form>

        <div className="mt-8 text-sm text-gray-500">
          Não recebeu o e-mail?{' '}
          {tempoEspera > 0 ? (
            <span className="text-neutral-500 font-mono font-bold ml-1">
              Aguarde {formatarTempo(tempoEspera)}
            </span>
          ) : (
            <button onClick={reenviarCodigo} className="text-[#C2AE82] hover:text-white font-bold transition ml-1">
              Reenviar código
            </button>
          )}
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition">
          ✕
        </button>

      </div>
    </div>
  );
}