'use client';

import { useEffect, useState } from "react";
import { api } from "@/lib/api"; // Importa a nossa api configurada!

export default function PedidosAdminPage() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Busca os pedidos. O Axios já vai colocar o "Bearer Token..." sozinho!
    api.get("/pedidos")
      .then((response) => {
        // O Spring Boot devolve paginação, então os dados ficam dentro de response.data.content
        setPedidos(response.data.content);
      })
      .catch((error) => {
        console.error("Erro ao buscar pedidos:", error);
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  if (carregando) return <p className="p-8">Carregando pedidos...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Painel de Pedidos</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        {pedidos.length === 0 ? (
          <p className="p-4 text-gray-500">Nenhum pedido encontrado.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {pedidos.map((pedido: any) => (
              <li key={pedido.lookupId} className="p-4 hover:bg-gray-50">
                <p className="font-semibold text-gray-900">Pedido: {pedido.lookupId}</p>
                {/* Renderize os outros dados do pedido aqui */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}