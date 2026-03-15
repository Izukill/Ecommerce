'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

//molde que vai pro carrinho
interface ItemCarrinho {
  produtoId: string;
  variacaoId: string;
  nome: string;
  preco: number;
  cor: string;
  tamanho: string;
  quantidade: string | number;
  quantidadeEstoqueMaxima: number;
  imagemUrl: string;
}

interface CartContextData {
  carrinho: ItemCarrinho[];
  quantidadeTotal: number;
  valorTotal: number;
  adicionarAoCarrinho: (item: ItemCarrinho) => void;
  removerDoCarrinho: (variacaoId: string) => void;
  atualizarQuantidade: (variacaoId: string, novaQuantidade: number) => void;
  limparCarrinho: () => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [iniciado, setIniciado] = useState(false);

  //ao abrir o site, busca o carrinho salvo no navegador
  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem('@MirlleFitness:carrinho');
    if (carrinhoSalvo) {
      setCarrinho(JSON.parse(carrinhoSalvo));
    }
    setIniciado(true);
  }, []);

  //toda vez que o carrinho mudar, salva no navegador
  useEffect(() => {
    if (iniciado) {
      localStorage.setItem('@MirlleFitness:carrinho', JSON.stringify(carrinho));
    }
  }, [carrinho, iniciado]);

  const adicionarAoCarrinho = (novoItem: ItemCarrinho) => {
    setCarrinho((carrinhoAtual) => {
      // Verifica se a mesma cor e tamanho já estão no carrinho
      const itemExistente = carrinhoAtual.find(item => item.variacaoId === novoItem.variacaoId);

      if (itemExistente) {
        //se já tem, só soma a quantidade (respeitando o limite do estoque)
        return carrinhoAtual.map(item =>
          item.variacaoId === novoItem.variacaoId
            ? { ...item, quantidade: Math.min(Number(item.quantidade) + Number(novoItem.quantidade), item.quantidadeEstoqueMaxima) }
            : item
        );
      }

      //se não tem, adiciona como item novo
      return [...carrinhoAtual, novoItem];
    });
  };

  const removerDoCarrinho = (variacaoId: string) => {
    setCarrinho(carrinhoAtual => carrinhoAtual.filter(item => item.variacaoId !== variacaoId));
  };

  const atualizarQuantidade = (variacaoId: string, novaQuantidade: number) => {
    if (novaQuantidade <= 0) return;

    setCarrinho(carrinhoAtual =>
      carrinhoAtual.map(item =>
        item.variacaoId === variacaoId
          ? { ...item, quantidade: Math.min(novaQuantidade, item.quantidadeEstoqueMaxima) }
          : item
      )
    );
  };

  const limparCarrinho = () => {
    setCarrinho([]);
  };

  // Cálculos dinâmicos e automáticos!
  const quantidadeTotal = carrinho.reduce((total, item) => total + Number(item.quantidade), 0);
  const valorTotal = carrinho.reduce((total, item) => total + (item.preco * Number(item.quantidade)), 0);

  return (
    <CartContext.Provider value={{
      carrinho,
      quantidadeTotal,
      valorTotal,
      adicionarAoCarrinho,
      removerDoCarrinho,
      atualizarQuantidade,
      limparCarrinho
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}