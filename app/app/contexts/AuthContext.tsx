'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface Usuario {
  sub: string;
  perfil: string;
  nome: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  carregando: boolean;
  logout: () => void;
  atualizarSessao: (token: string) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const decodificarToken = (token: string): Usuario | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Toda vez que a rota muda, ou o app carrega, verificamos o token
  useEffect(() => {
    const token = localStorage.getItem("mirlle_token");
    if (token) {
      setUsuario(decodificarToken(token));
    } else {
      setUsuario(null);
    }
    setCarregando(false);
  }, [pathname]);

  const atualizarSessao = (token: string) => {
    localStorage.setItem("mirlle_token", token);
    setUsuario(decodificarToken(token));
  };

  const logout = () => {
    localStorage.removeItem("mirlle_token");
    setUsuario(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ usuario, carregando, logout, atualizarSessao }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);