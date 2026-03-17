import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export interface PedidoResumo {
  lookupId: string;
  clienteNome: string;
  dataHora: string;
  status: string;
  total: number;
}

export interface DashboardAdmin {
  faturamentoMes: number;
  produtosAtivos: number;
  pedidosMes: number;
  aguardandoEnvio: number;
  ultimosPedidos: PedidoResumo[];
}

export function useAdminDashboard() {

  const [dashboard, setDashboard] = useState<DashboardAdmin | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {

    const carregar = async () => {
      try {

        const response = await api.get("/admin/dashboard");

        setDashboard(response.data);

      } catch (error) {

        console.error("Erro ao carregar dashboard", error);

      } finally {

        setCarregando(false);

      }
    };

    carregar();

  }, []);

  return { dashboard, carregando };
}