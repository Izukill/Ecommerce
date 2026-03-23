# E-commerce Loja de Roupas

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![Banco Relacional](https://img.shields.io/badge/Banco_de_Dados-Relacional-blue?style=for-the-badge&logo=databricks&logoColor=white)

## 📖 Sobre o Projeto

Este é o meu primeiro projeto independente de e-commerce, focado em criar uma solução completa de ponta a ponta. Inicialmente, o foco está na construção de um **Backend robusto utilizando Spring (Java)**, com planos futuros de integração com um **Frontend moderno construído em Next.js**.

O principal objetivo deste repositório é aplicar na prática os meus conhecimentos de desenvolvimento, construindo uma API estruturada e integrada a um banco de dados relacional. 

## 🎯 Objetivos e Funcionalidades

* **Gestão de Catálogo:** Gerenciamento completo de produtos e suas variações (ex: tamanho, cor).
* **Controle de Estoque:** Atualização e rastreio de disponibilidade de itens.
* **Fluxo de Pedidos:** Suporte ao ciclo de vida completo de uma compra.
* **Controle de Acessos:** Diferentes níveis de permissão e acesso (ex: cliente, administrador).
* **Aprendizado Prático:** Consolidar tecnologias modernas de mercado.

---

## 🏗️ Arquitetura e Modelagem

Para entender melhor a estrutura de dados e as entidades do sistema, consulte os diagramas abaixo:

* **Modelo MER (Modelo Entidade-Relacionamento):** [Visualizar Imagem MER](https://github.com/Izukill/Ecommerce/blob/480e3691930a56946d1b806e2ffb326f82192803/Modelo%20MER%20Ecommerce.png)
* **Diagrama de Classes:** [Visualizar PDF do Diagrama](https://github.com/Izukill/Ecommerce/blob/480e3691930a56946d1b806e2ffb326f82192803/Diagrama%20de%20Classe%20Ecommerce.pdf)

---

## 📝 Padrão de Commits

Para manter o histórico do projeto limpo e rastreável, este repositório segue uma convenção rigorosa de commits:

| Tipo | Descrição | Exemplo de Uso |
| :--- | :--- | :--- |
| **`feat`** | Introdução de um recurso totalmente novo no sistema ou no código. | `feat: implementacao do endpoint de criar pedido` |
| **`fix`** | Resolução de um bug, erro ou ajuste de comportamento incorreto de algo já entregue. | `fix: correcao do calculo de valor total na classe Pedido` |
| **`add`** | Inclusão de arquivos auxiliares (configurações, imagens, docs ou dependências). | `add: inclusao do diagrama de classes e MER no README` |
| **`remove`** | Exclusão de arquivos, limpeza de código morto ou remoção de configurações antigas. | `remove: exclusao da antiga classe Cor, substituida por Variacao` |

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para rodar a aplicação localmente (ambiente de desenvolvimento - Frontend):

**1. Acesse a pasta da aplicação:**
```bash
cd app
npm install axios
npm run dev
