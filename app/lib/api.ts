import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/Mirlle/api",
});

//Configurando o Interceptador de Requisição
api.interceptors.request.use(
  (config) => {

    let token = null;

    //o next.js roda no servidor e no navegador.
    //o typeof window garante que só vamos procurar o localStorage quando estivermos no navegador.
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("mirlle_token");

      //se achou o token na memória, carimba ele no cabeçalho da requisição
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