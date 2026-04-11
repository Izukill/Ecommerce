'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface Usuario {
  sub: string;
  perfil: string;
  nome: string;
  email: string;
  lookupId: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  carregando: boolean;
  logout: () => void;
  atualizarSessao: (token: string) => void;
  atualizarNome: (novoNome: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  carregando: true,
  logout: () => {},
  atualizarSessao: () => {},
  atualizarNome: () => {},
});

const decodificarToken = (token: string): Usuario | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    return { ...payload, email: payload.sub };
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("mirlle_token");
    if (!token) { setUsuario(null); setCarregando(false); return; }

    const payload = decodificarToken(token);
    if (!payload) { setUsuario(null); setCarregando(false); return; }

    const expirado = payload.exp ? payload.exp * 1000 < Date.now() : false;
    if (expirado) {
      localStorage.removeItem("mirlle_token");
      localStorage.removeItem("mirlle_nome_override");
      setUsuario(null);
      router.push("/login");
      setCarregando(false);
      return;
    }

    // aplica override de nome se existir
    const nomeGuardado = localStorage.getItem("mirlle_nome_override");
    setUsuario({ ...payload, nome: nomeGuardado ?? payload.nome });
    setCarregando(false);
  }, [pathname]);

  const atualizarNome = (novoNome: string) => {
    localStorage.setItem("mirlle_nome_override", novoNome);
    setUsuario(prev => prev ? { ...prev, nome: novoNome } : null);
  };

  const atualizarSessao = (token: string) => {
    localStorage.setItem("mirlle_token", token);
    localStorage.removeItem("mirlle_nome_override");
    setUsuario(decodificarToken(token));
  };

  const logout = () => {
    localStorage.removeItem("mirlle_token");
    localStorage.removeItem("mirlle_nome_override");
    setUsuario(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ usuario, carregando, logout, atualizarSessao, atualizarNome }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);