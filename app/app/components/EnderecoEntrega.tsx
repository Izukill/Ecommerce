'use client';

const mascaraCEP = (valor: string) => {
  return valor
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1'); // Bloqueia digitação após 8 números
};

export default function EnderecoEntrega({ valores, setValores }: any) {
  const handleChange = (campo: string, valor: string) => {
    let valorFormatado = valor;

    if (campo === 'cep') valorFormatado = mascaraCEP(valor);

    setValores((prev: any) => ({ ...prev, [campo]: valorFormatado }));
  };

  return (
    <div className="bg-black border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      <h2 className="text-xl font-bold text-[#C2AE82] mb-6 flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-[#C2AE82]/10 flex items-center justify-center text-sm">2</span>
        Endereço de Entrega
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-5">
        <div className="sm:col-span-2">
          <label className="block text-sm font-bold text-gray-400 mb-1">CEP *</label>
          <input type="text" required value={valores.cep} onChange={(e) => handleChange("cep", e.target.value)} placeholder="00000-000" className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none" />
        </div>
        <div className="sm:col-span-4">
          <label className="block text-sm font-bold text-gray-400 mb-1">Logradouro *</label>
          <input type="text" required value={valores.logradouro} onChange={(e) => handleChange("logradouro", e.target.value)} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-bold text-gray-400 mb-1">Número *</label>
          <input type="text" required value={valores.numero} onChange={(e) => handleChange("numero", e.target.value)} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none" />
        </div>
        <div className="sm:col-span-4">
          <label className="block text-sm font-bold text-gray-400 mb-1">Complemento</label>
          <input type="text" value={valores.complemento} onChange={(e) => handleChange("complemento", e.target.value)} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none" />
        </div>
        <div className="sm:col-span-3">
          <label className="block text-sm font-bold text-gray-400 mb-1">Bairro *</label>
          <input type="text" required value={valores.bairro} onChange={(e) => handleChange("bairro", e.target.value)} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-bold text-gray-400 mb-1">Cidade *</label>
          <input type="text" required value={valores.cidade} onChange={(e) => handleChange("cidade", e.target.value)} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none" />
        </div>
        <div className="sm:col-span-1">
          <label className="block text-sm font-bold text-gray-400 mb-1">UF *</label>
          <input type="text" required maxLength={2} value={valores.estado} onChange={(e) => handleChange("estado", e.target.value.toUpperCase())} placeholder="PB" className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none" />
        </div>
      </div>
    </div>
  );
}