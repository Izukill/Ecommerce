'use client';
import { useState } from 'react';
import { api } from "@/lib/api";
import ModalAtivacao from "@/app/components/layout/ModalAtivacao";
import toast from 'react-hot-toast';

export interface Endereco {
    lookupID: number;
    cep: string;
    rua: string;
    bairro: string;
    numero: number;
    cidade: string;
    complemento?: string;
    estado: string;
}

interface ModalProps {
    enderecoEditando: Endereco | null;
    setEnderecoEditando: (endereco: Endereco | null) => void;
    aoSalvarComSucesso: (enderecoAtualizado: Endereco) => void;
}

export default function ModalEditarEndereco({
    enderecoEditando,
    setEnderecoEditando,
    aoSalvarComSucesso
}: ModalProps) {

    const [isConfirmando, setIsConfirmando] = useState(false);

    if (!enderecoEditando) return null;

    const atualizarCampoEndereco = (campo: keyof Endereco, valor: string | number) => {
        setEnderecoEditando({ ...enderecoEditando, [campo]: valor });
    };

    const handleSalvarClick = (e: React.FormEvent) => {
        e.preventDefault();
        setIsConfirmando(true);
    };

    const executarAtualizacaoAPI = async () => {
        try {
            await api.put(`/enderecos/${enderecoEditando.lookupID}`, enderecoEditando);
            aoSalvarComSucesso(enderecoEditando);
            setIsConfirmando(false);
            setEnderecoEditando(null);

            toast("Endereço atualizado com sucesso! ✅");
        } catch (error: any) {
            console.error("Erro ao atualizar endereço:", error.response?.data || error.message);
            toast("❌ Erro ao atualizar o endereço");
            setIsConfirmando(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                    <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">Editar Endereço</h3>
                        <button onClick={() => setEnderecoEditando(null)} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                    </div>

                    <div className="p-6 overflow-y-auto">
                        <form id="form-endereco" onSubmit={handleSalvarClick} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-bold text-gray-400 mb-1">CEP</label>
                                <input type="text" value={enderecoEditando.cep || ''} onChange={(e) => atualizarCampoEndereco('cep', e.target.value)} maxLength={9} required className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none transition" />
                            </div>
                            <div className="sm:col-span-4">
                                <label className="block text-sm font-bold text-gray-400 mb-1">Rua / Avenida</label>
                                <input type="text" value={enderecoEditando.rua || ''} onChange={(e) => atualizarCampoEndereco('rua', e.target.value)} required className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none transition" />
                            </div>
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-bold text-gray-400 mb-1">Bairro</label>
                                <input type="text" value={enderecoEditando.bairro || ''} onChange={(e) => atualizarCampoEndereco('bairro', e.target.value)} required className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none transition" />
                            </div>
                            <div className="sm:col-span-1">
                                <label className="block text-sm font-bold text-gray-400 mb-1">Número</label>
                                <input type="number" value={enderecoEditando.numero || ''} onChange={(e) => atualizarCampoEndereco('numero', Number(e.target.value))} required className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none transition" />
                            </div>
                            <div className="sm:col-span-4">
                                <label className="block text-sm font-bold text-gray-400 mb-1">Complemento (Opcional)</label>
                                <input type="text" value={enderecoEditando.complemento || ''} onChange={(e) => atualizarCampoEndereco('complemento', e.target.value)} placeholder="Ex: Apto 202, Bloco A" className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none transition" />
                            </div>
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-bold text-gray-400 mb-1">Cidade</label>
                                <input type="text" value={enderecoEditando.cidade || ''} onChange={(e) => atualizarCampoEndereco('cidade', e.target.value)} required className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none transition" />
                            </div>
                            <div className="sm:col-span-1">
                                <label className="block text-sm font-bold text-gray-400 mb-1">UF</label>
                                <input type="text" value={enderecoEditando.estado || ''} onChange={(e) => atualizarCampoEndereco('estado', e.target.value.toUpperCase())} maxLength={2} required className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-[#C2AE82] outline-none transition" />
                            </div>
                        </form>
                    </div>

                    <div className="p-6 border-t border-neutral-800 flex justify-end gap-3 bg-neutral-950">
                        <button type="button" onClick={() => setEnderecoEditando(null)} className="px-5 py-2 rounded-lg font-bold text-gray-400 hover:text-white hover:bg-neutral-800 transition">Cancelar</button>
                        <button type="submit" form="form-endereco" className="px-5 py-2 rounded-lg font-bold bg-[#C2AE82] text-black hover:bg-[#a69265] transition shadow-lg">Atualizar</button>
                    </div>
                </div>
            </div>
            <ModalAtivacao
                isOpen={isConfirmando}
                onClose={() => setIsConfirmando(false)}
                onConfirm={executarAtualizacaoAPI}
                titulo="Confirmar Alterações"
                mensagem={<span>Tem certeza que deseja atualizar os dados deste endereço em seu perfil?</span>}
            />
        </>
    );
}