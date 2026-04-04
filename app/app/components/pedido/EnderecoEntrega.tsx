'use client';

import { useState } from "react";

interface EnderecoEntregaProps {
  valores: any;
  setValores: (valores: any) => void;
}

export default function EnderecoEntrega({ valores, setValores }: EnderecoEntregaProps) {

  //estado pra mostrar um carregando... enquanto a api do viacep busca
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState("");

  const mascaraCEP = (valor: string) => {
      return valor
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1');
  };

  const buscarCep = async (cepDigitado: string) => {
    //limpa os traços
    const cepLimpo = cepDigitado.replace(/\D/g, '');


    setValores({ ...valores, cep: cepDigitado });

    //só busca quando completar 8 digitos do cep
    if (cepLimpo.length === 8) {
      setBuscandoCep(true);
      setErroCep("");

      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        if (data.erro) {
          setErroCep("CEP não encontrado.");
          return;
        }

        setValores((prev: any) => ({
          ...prev,
          rua: data.logradouro || "", //é passado assim por causa do que o viaCep retorna
          bairro: data.bairro || "",
          cidade: data.localidade || "", //aqui também
          estado: data.uf || ""
        }));

      } catch (error) {
        setErroCep("Erro ao buscar o CEP.");
      } finally {
        setBuscandoCep(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValores({ ...valores, [name]: value });
  };

  return (
    <div className="bg-black border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      <h2 className="text-xl font-bold text-[#C2AE82] mb-6 flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-[#C2AE82]/10 flex items-center justify-center text-sm">2</span>
        Endereço de Entrega
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* CAMPO DO CEP */}
        <div className="md:col-span-2 relative">
          <label className="block text-sm font-bold text-gray-400 mb-1">CEP</label>
          <input
            type="text"
            name="cep"
            value={valores.cep}
            onChange={(e) => buscarCep(e.target.value)}
            maxLength={9}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C2AE82] transition-colors"
            placeholder="00000-000"
            required
          />
          {buscandoCep && <span className="absolute right-4 top-10 text-xs text-[#C2AE82]">Buscando...</span>}
          {erroCep && <span className="text-xs text-red-500 mt-1 block">{erroCep}</span>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-1">Rua</label>
          <input
            type="text"
            name="rua"
            value={valores.rua}
            onChange={handleChange}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C2AE82]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-1">Número</label>
          <input
            type="text"
            name="numero"
            value={valores.numero}
            onChange={handleChange}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C2AE82]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-1">Complemento</label>
          <input
            type="text"
            name="complemento"
            value={valores.complemento}
            onChange={handleChange}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C2AE82]"
            placeholder="Apto, Bloco, etc (Opcional)"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-1">Bairro</label>
          <input
            type="text"
            name="bairro"
            value={valores.bairro}
            onChange={handleChange}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C2AE82]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-1">Cidade</label>
          <input
            type="text"
            name="cidade"
            value={valores.cidade}
            onChange={handleChange}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C2AE82]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-1">Estado (UF)</label>
          <input
            type="text"
            name="estado"
            value={valores.estado}
            onChange={handleChange}
            maxLength={2}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C2AE82] uppercase"
            required
          />
        </div>

      </div>
    </div>
  );
}