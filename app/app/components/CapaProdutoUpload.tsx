'use client';

import { ChangeEvent, useState } from "react";
import { api } from "@/lib/api";

interface CapaProdutoUploadProps {
  imagemUrl: string;
  setImagemUrl: (url: string) => void;
}

export default function CapaProdutoUpload({ imagemUrl, setImagemUrl }: CapaProdutoUploadProps) {
  const [fazendoUpload, setFazendoUpload] = useState(false);
  const [erro, setErro] = useState("");

  const handleUploadImagem = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFazendoUpload(true);
    setErro("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/upload/imagem", formData);
      setImagemUrl(response.data);
    } catch (error) {
      setErro("Falha ao enviar a imagem de capa.");
    } finally {
      setFazendoUpload(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-gray-100">Foto Principal (Capa)</label>

      {erro && <p className="text-xs text-red-400">{erro}</p>}

      <div className="border-2 border-dashed border-neutral-700 rounded-xl p-4 flex flex-col items-center justify-center text-center relative h-72 bg-neutral-900 overflow-hidden transition-colors hover:border-[#C2AE82]">
        {imagemUrl ? (
          <img src={imagemUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="space-y-2">
            <span className="text-4xl">📸</span>
            <p className="text-xs text-gray-400 font-medium px-2">Clique para selecionar a foto de capa.</p>
          </div>
        )}
        <input
          type="file" accept="image/png, image/jpeg, image/webp"
          onChange={handleUploadImagem} disabled={fazendoUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
        />
        {fazendoUpload && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#C2AE82] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {imagemUrl && (
        <button
          type="button" onClick={() => setImagemUrl("")}
          className="w-full py-2 text-xs font-bold text-red-400 bg-red-950/30 rounded-lg hover:bg-red-900/50 transition-colors"
        >
          Remover Foto de Capa
        </button>
      )}
    </div>
  );
}