import axios from "axios";

// 1. Criamos a instância base.
// Note que já colocamos o seu context-path aqui para não precisar repetir nunca mais!
export const api = axios.create({
  baseURL: "http://localhost:8080/Mirlle/api",
});

// 2. Configurando o Interceptador de Requisição
api.interceptors.request.use(
  (config) => {
    // O Next.js roda no servidor e no navegador.
    // O typeof window garante que só vamos procurar o localStorage quando estivermos no navegador.
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("mirlle_token");

      // Se achou o token na memória, carimba ele no cabeçalho da requisição!
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);