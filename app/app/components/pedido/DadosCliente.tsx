'use client';

//funções de formatação (Máscaras)
const mascaraCPF = (valor: string) => {
  return valor
    .replace(/\D/g, '')//remove tudo que não for número
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

const mascaraTelefone = (valor: string) => {
  return valor
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

export default function DadosCliente({ valores, setValores }: any) {
  const handleChange = (campo: string, valor: string) => {
    let valorFormatado = valor;

    //aplica a máscara dependendo do campo que está sendo digitado
    if (campo === 'cpf') valorFormatado = mascaraCPF(valor);
    if (campo === 'telefone') valorFormatado = mascaraTelefone(valor);

    setValores((prev: any) => ({ ...prev, [campo]: valorFormatado }));
  };

  return (
    <div className="bg-black border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      <h2 className="text-xl font-bold text-[#C2AE82] mb-6 flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-[#C2AE82]/10 flex items-center justify-center text-sm">1</span>
        Dados Pessoais
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className="block text-sm font-bold text-gray-400 mb-1">Nome Completo *</label>
          <input type="text" required value={valores.nome} onChange={(e) => handleChange("nome", e.target.value)} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-1">E-mail *</label>
          <input type="email" required value={valores.email} onChange={(e) => handleChange("email", e.target.value)} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-1">CPF *</label>
          <input type="text" required value={valores.cpf} onChange={(e) => handleChange("cpf", e.target.value)} placeholder="000.000.000-00" className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-bold text-gray-400 mb-1">Telefone / WhatsApp *</label>
          <input type="text" required value={valores.telefone} onChange={(e) => handleChange("telefone", e.target.value)} placeholder="(00) 00000-0000" className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none" />
        </div>
      </div>
    </div>
  );
}