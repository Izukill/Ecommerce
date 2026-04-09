'use client';
import { api } from "@/lib/api";
import toast from 'react-hot-toast';

export interface EnderecoCriacao {
    cep: string;
    rua: string;
    bairro: string;
    numero: number | '';
    cidade: string;
    complemento?: string;
    estado: string;
    ativo: boolean;
}

interface ModalProps {
    enderecosAtuais: any[];
    enderecoCriando: EnderecoCriacao | null;
    setEnderecoCriando: React.Dispatch<React.SetStateAction<EnderecoCriacao | null>>;
    aoSalvarComSucesso: (enderecoCriado: any) => void;
}

export default function ModalCriarEndereco({
    enderecosAtuais,
    enderecoCriando,
    setEnderecoCriando,
    aoSalvarComSucesso
}: ModalProps) {

    if (!enderecoCriando) return null;

    const atualizarCampoEndereco = (campo: keyof EnderecoCriacao, valor: string | number) => {
        setEnderecoCriando((prev) => prev ? { ...prev, [campo]: valor } : null);
    };

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let cepNumeros = e.target.value.replace(/\D/g, "");

        //regex de cep
        let cepFormatado = cepNumeros;
        if (cepNumeros.length > 5) {
            cepFormatado = cepNumeros.replace(/^(\d{5})(\d)/, "$1-$2");
        }

        atualizarCampoEndereco('cep', cepFormatado);

        if (cepNumeros.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    setEnderecoCriando((prev) => {
                        if (!prev) return prev;
                        return {
                            ...prev,
                            rua: data.logradouro,
                            bairro: data.bairro,
                            cidade: data.localidade,
                            estado: data.uf
                        };
                    });
                    document.getElementById('input-numero')?.focus(); //foco automático no numero depois de puxar o cep

                } else {
                    alert("CEP não encontrado. Verifique e tente novamente.");
                }
            } catch (error) {
                console.error("Erro ao buscar ViaCEP:", error);
            }
        }
    };

    const executarCriacaoAPI = async (e: React.FormEvent) => {
        e.preventDefault();

        const formatarTexto = (texto: string) => texto ? texto.toString().toLowerCase().trim().replace(/\s+/g, ' ') : '';
        const formatarCep = (cep: string) => cep ? cep.replace(/\D/g, '') : '';

        const enderecoDuplicado = enderecosAtuais.find((end) =>
            formatarCep(end.cep) === formatarCep(enderecoCriando.cep) &&
            formatarTexto(end.rua) === formatarTexto(enderecoCriando.rua) &&
            String(end.numero) === String(enderecoCriando.numero) && // Converte para string por segurança
            formatarTexto(end.bairro) === formatarTexto(enderecoCriando.bairro) &&
            formatarTexto(end.cidade) === formatarTexto(enderecoCriando.cidade) &&
            formatarTexto(end.estado) === formatarTexto(enderecoCriando.estado)
        );

        if (enderecoDuplicado) {
            toast.error("Você já possui este exato endereço cadastrado!");
            return;
        }

        try {
            const response = await api.post('/enderecos', enderecoCriando);
            aoSalvarComSucesso(response.data);
            setEnderecoCriando(null);
            toast.success("Endereço adicionado com sucesso!");

        } catch (error: any) {
            console.error("Erro ao criar endereço:", error.response?.data || error.message);
            toast.error("Erro ao adicionar endereço");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-neutral-900 border-t-4 border-t-[#C2AE82] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Novo Endereço</h3>
                    <button onClick={() => setEnderecoCriando(null)} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form id="form-criar-endereco" onSubmit={executarCriacaoAPI} className="grid grid-cols-1 sm:grid-cols-4 gap-4">

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-bold text-gray-400 mb-1">CEP</label>
                            {/* passa o viaCep no lugar do input normal */}
                            <input
                                type="text"
                                value={enderecoCriando.cep}
                                onChange={handleCepChange}
                                maxLength={9}
                                required
                                placeholder="00000-000"
                                className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none transition"
                            />
                        </div>

                        <div className="sm:col-span-4">
                            <label className="block text-sm font-bold text-gray-400 mb-1">Rua / Avenida</label>
                            <input type="text" value={enderecoCriando.rua} onChange={(e) => atualizarCampoEndereco('rua', e.target.value)} required className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none transition" />
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-sm font-bold text-gray-400 mb-1">Bairro</label>
                            <input type="text" value={enderecoCriando.bairro} onChange={(e) => atualizarCampoEndereco('bairro', e.target.value)} required className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none transition" />
                        </div>

                        <div className="sm:col-span-1">
                            <label className="block text-sm font-bold text-gray-400 mb-1">Número</label>
                            <input id="input-numero" type="number" value={enderecoCriando.numero} onChange={(e) => atualizarCampoEndereco('numero', Number(e.target.value))} required className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none transition" />
                        </div>

                        <div className="sm:col-span-4">
                            <label className="block text-sm font-bold text-gray-400 mb-1">Complemento (Opcional)</label>
                            <input type="text" value={enderecoCriando.complemento || ''} onChange={(e) => atualizarCampoEndereco('complemento', e.target.value)} placeholder="Ex: Apto 202, Bloco A" className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none transition" />
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-sm font-bold text-gray-400 mb-1">Cidade</label>
                            <input type="text" value={enderecoCriando.cidade} onChange={(e) => atualizarCampoEndereco('cidade', e.target.value)} required className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none transition" />
                        </div>

                        <div className="sm:col-span-1">
                            <label className="block text-sm font-bold text-gray-400 mb-1">UF</label>
                            <input type="text" value={enderecoCriando.estado} onChange={(e) => atualizarCampoEndereco('estado', e.target.value.toUpperCase())} maxLength={2} required placeholder="SP" className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none transition" />
                        </div>

                    </form>
                </div>

                <div className="p-6 border-t border-neutral-800 flex justify-end gap-3 bg-neutral-950">
                    <button type="button" onClick={() => setEnderecoCriando(null)} className="px-5 py-2 rounded-lg font-bold text-gray-400 hover:text-white hover:bg-neutral-800 transition">Cancelar</button>
                    <button type="submit" form="form-criar-endereco" className="px-5 py-2 rounded-lg font-bold bg-[#C2AE82] text-black hover:bg-[#a69265] transition shadow-lg">Salvar Endereço</button>
                </div>
            </div>
        </div>
    );
}