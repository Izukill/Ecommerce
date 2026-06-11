<div align="center">

# E-commerce Loja de Roupas

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![Banco Relacional](https://img.shields.io/badge/Banco_de_Dados-Relacional-blue?style=for-the-badge&logo=databricks&logoColor=white)

<img src="app/public/adminlogo.png" width="180" >
</div>

## 📑 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Objetivos e Funcionalidades](#-objetivos-e-funcionalidades)
- [Stack Tecnológica](#-stack-tecnológica)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Quick Start](#-quick-start)
- [☁Infraestrutura e Deploy](#-infraestrutura-e-deploy)
- [Arquitetura e Modelagem](#-arquitetura-e-modelagem)
- [Padrão de Commits](#-padrão-de-commits)
- [Códigos de Status HTTP](#-códigos-de-status-http)
- [Referência da API](#-referência-da-api)


## Sobre o Projeto

Este é o meu primeiro projeto independente de e-commerce, focado em criar uma solução completa de ponta a ponta. Inicialmente, o foco está na construção de um **Backend robusto utilizando Spring (Java)**, com planos futuros de integração com um **Frontend moderno construído em Next.js**.

O principal objetivo deste repositório é aplicar na prática os meus conhecimentos de desenvolvimento, construindo uma API estruturada e integrada a um banco de dados relacional. 

## Objetivos e Funcionalidades

* **Gestão de Catálogo:** Gerenciamento completo de produtos e suas variações (ex: tamanho, cor).
* **Controle de Estoque:** Atualização e rastreio de disponibilidade de itens.
* **Fluxo de Pedidos:** Suporte ao ciclo de vida completo de uma compra.
* **Controle de Acessos:** Diferentes níveis de permissão e acesso (ex: cliente, administrador).
* **Aprendizado Prático:** Consolidar tecnologias modernas de mercado.

---

## Stack Tecnológica

### Frontend

| Tecnologia | Descrição |
|------------|----------|
| Next.js | Framework React com SSR |
| React | Biblioteca de UI |
| TypeScript | Tipagem estática |
| Tailwind CSS | Estilização |
| Axios | Requisições HTTP |

### Backend

| Tecnologia | Descrição |
|------------|----------|
| Spring Boot | API REST |
| Spring Security | Autenticação JWT |
| Spring Data JPA | Persistência |
| PostgreSQL | Banco de dados |

### Infraestrutura

| Tecnologia | Descrição |
|------------|----------|
| Docker | Containerização |
| Vercel / Render | Deploy |
| PostgreSQL | Banco relacional |

---

## Estrutura do Projeto

```text
    MirlleEcommerce/
    ├── api/                          # Backend — Spring Boot
    │   └── main/
    │       ├── java/
    │       │   └── org/example/
    │       │       ├── config/       # Configurações gerais
    │       │       ├── exception/    
    │       │       ├── mapper/      
    │       │       ├── mock/         # Dados/mock para testes
    │       │       ├── model/        # Entidades do sistema
    │       │       ├── payment/      # Integração/lógica de pagamento
    │       │       ├── repository/   
    │       │       ├── rest/         
    │       │       ├── security/     # Configuração de segurança (JWT, etc)
    │       │       ├── service/      
    │       │       └── MirelEcommerceApplication.java
    │       └── resources/
    │           └── application.properties
    │
    ├── app/                          # Frontend — Next.js
    │   ├── .next/                    # Build gerado automaticamente
    │   ├── app/
    │   │   ├── admin/                
    │   │   ├── checkout/             
    │   │   ├── cliente/              
    │   │   ├── components/           
    │   │   ├── contexts/            
    │   │   ├── hooks/                
    │   │   ├── login/               
    │   │   ├── produtos/            
    │   │   ├── recuperar-senha/     
    │   │   ├── registro/             
    │   │   ├── favicon.ico
    │   │   ├── globals.css
    │   │   ├── layout.tsx
    │   │   └── page.tsx              # Página inicial
    │   │
    │   ├── lib/                      # Utilidades/helpers
    │   ├── node_modules/             # Dependências
    │   └── public/                   # Arquivos estáticos

```
---

## Quick Start

### Pré-requisitos

- Node.js 18+
- Java 21+
- Docker
- Git

---

Siga os passos abaixo para rodar a aplicação localmente

### 1. Clone o projeto

```bash

git clone https://github.com/Izukill/Ecommerce.git
cd MirlleEcommerce

```

### 2. Configurar variáveis de ambiente

```bash
   
cp .env.example .env
```
### 3. Subir o backend (docker)

```bash

cd api

docker compose up -d

./mvnw spring-boot:run
```


### API disponível em:

http://localhost:8080//Mirlle/api/

### 4. Subir o frontend

```bash

cd app

npm install

npm run dev
```
### Acesse:

http://localhost:3000

---
## Infraestrutura e Deploy

```text

Frontend (Vercel)
        ↓
Backend (Render / Docker)
        ↓
Banco de Dados (PostgreSQL/AWS)

```

___
## Arquitetura e Modelagem

Para entender melhor a estrutura de dados e as entidades do sistema, consulte os diagramas abaixo (podem ser visualisado em "mermaid.live"):

* Modelo MER (Modelo Entidade-Relacionamento) :

```text

erDiagram
    Pessoas {
        VARCHAR nome
        VARCHAR email "UK"
        VARCHAR cpf "UK"
        VARCHAR senha
        BOOLEAN ativo
        VARCHAR tipo_perfil "EnumPerfil"
    }

    Administradores {
        VARCHAR cargo "EnumCargo"
        BOOLEAN permissao_total
        BOOLEAN pedidos_page
        BOOLEAN produtos_page
        BOOLEAN categorias_page
        BOOLEAN cliente_page
        BOOLEAN relatorios_page
    }

    Clientes {
        DATE data_cadastro
        VARCHAR telefone "UK"
        VARCHAR codigo_verificacao
        TIMESTAMP expiracao_codigo
    }

    Enderecos {
        VARCHAR cep
        VARCHAR rua
        VARCHAR bairro
        INTEGER numero
        VARCHAR complemento
        VARCHAR cidade
        VARCHAR estado
        BOOLEAN ativo
    }

    Pedidos {
        BIGINT pagamento_mercado_pago_id
        VARCHAR status "EnumStatusPedido"
        DECIMAL valor_total
        DECIMAL frete_fixo
        TIMESTAMP data_hora
        TIMESTAMP data_expiracao
    }

    ItemPedidos {
        INTEGER quantidade
        DECIMAL preco_unitario
    }

    Produtos {
        VARCHAR nome
        VARCHAR imagem_url
        DECIMAL preco
        DECIMAL preco_promocional
        VARCHAR descricao
        BOOLEAN ativo
        TIMESTAMP data_criacao
    }

    VariacaoProdutos {
        VARCHAR imagem_url
        VARCHAR tamanho "EnumTamanho"
        VARCHAR cor
        INTEGER quantidade_estoque
        BOOLEAN ativo
    }

    Categorias {
        VARCHAR nome "UK"
        BOOLEAN ativo
        BOOLEAN mostrar_na_home
        INTEGER ordem_exibicao
        DECIMAL percentual_desconto
    }

    %% Relacionamentos de Herança (InheritanceType.JOINED)
    Pessoas ||--o| Administradores : "é um (Especialização)"
    Pessoas ||--o| Clientes : "é um (Especialização)"

    %% Relacionamentos do Cliente
    Clientes ||--o{ Enderecos : "possui"
    Clientes ||--o{ Pedidos : "realiza"

    %% Relacionamentos do Pedido
    Enderecos ||--o{ Pedidos : "usado como endereço de entrega"
    Pedidos ||--o{ ItemPedidos : "contém"

    %% Relacionamentos do Catálogo
    Categorias ||--o{ Produtos : "categoriza"
    Produtos ||--o{ VariacaoProdutos : "possui"
    VariacaoProdutos ||--o{ ItemPedidos : "referenciado em"



```




* Diagrama de Classes :

```text
classDiagram
    direction BT

    %% Classe Abstrata e Heranças
    class Pessoa {
        <<abstract>>
        -Long id
        -UUID lookupId
        -String nome
        -String email
        -String cpf
        -String senha
        -boolean ativo
        -EnumPerfil tipoPerfil
    }

    class Administrador {
        -EnumCargo cargo
        -boolean permissaoTotal
        -boolean pedidosPage
        -boolean produtosPage
        -boolean categoriasPage
        -boolean clientePage
        -boolean relatoriosPage
    }

    class Cliente {
        -LocalDate dataCadastro
        -String telefone
        -String codigoVerificacao
        -LocalDateTime expiracaoCodigo
    }

    Pessoa <|-- Administrador
    Pessoa <|-- Cliente

    %% Entidades Principais e Relacionamentos
    class Endereco {
        -Long id
        -UUID lookupId
        -String cep
        -String rua
        -String bairro
        -Integer numero
        -String complemento
        -String cidade
        -String estado
        -Boolean ativo
    }

    class Pedido {
        -Long id
        -UUID lookupId
        -Long pagamentoMercadoPagoId
        -EnumStatusPedido status
        -BigDecimal valorTotal
        -BigDecimal freteFixo
        -LocalDateTime dataHora
        -LocalDateTime dataExpiracao
    }

    class ItemPedido {
        -Long id
        -UUID lookupId
        -Integer quantidade
        -BigDecimal precoUnitario
    }

    class Produto {
        -Long id
        -UUID lookupId
        -String nome
        -String imagemUrl
        -BigDecimal preco
        -BigDecimal precoPromocional
        -String descricao
        -boolean ativo
        -LocalDateTime dataCriacao
    }

    class VariacaoProduto {
        -Long id
        -UUID lookupId
        -String imagemUrl
        -EnumTamanho tamanho
        -String cor
        -Integer quantidadeEstoque
        -boolean ativo
    }

    class Categoria {
        -Long Id
        -UUID lookupId
        -String nome
        -boolean ativo
        -Boolean mostrarNaHome
        -Integer ordemExibicao
        -BigDecimal percentualDesconto
    }

    %% Definição das Relações
    Cliente "1" -- "0..*" Endereco : possui
    Cliente "1" -- "0..*" Pedido : realiza
    Pedido "0..*" -- "1" Endereco : entregaEm
    Pedido "1" -- "1..*" ItemPedido : contem
    ItemPedido "0..*" -- "1" VariacaoProduto : refere-se
    Produto "1" -- "1..*" VariacaoProduto : possui
    Produto "0..*" -- "1" Categoria : pertence

    %% Enumerações
    class EnumPerfil {
        <<enumeration>>
        ADM
        CLIENTE
    }

    class EnumCargo {
        <<enumeration>>
        DONO
        FUNCIONARIO
    }

    class EnumStatusPedido {
        <<enumeration>>
        AGUARDANDO_PAGAMENTO
        PAGO
        ENVIADO
        CANCELADO
    }

    class EnumTamanho {
        <<enumeration>>
        P
        M
        G
        GG
    }

    %% Vinculação dos Enums às Classes (Visual)
    Pessoa .. EnumPerfil
    Administrador .. EnumCargo
    Pedido .. EnumStatusPedido
    VariacaoProduto .. EnumTamanho
```

---

## Padrão de Commits

Para manter o histórico do projeto limpo e rastreável, este repositório segue uma convenção rigorosa de commits:

| Tipo | Descrição | Exemplo de Uso |
| :--- | :--- | :--- |
| **`feat`** | Introdução de um recurso totalmente novo no sistema ou no código. | `feat: implementacao do endpoint de criar pedido` |
| **`refector`** | Refatoração de código, melhora de lógicas ou de algum sistema. | `refactor: tela de admin.` |
| **`fix`** | Resolução de um bug, erro ou ajuste de comportamento incorreto de algo já entregue. | `fix: correcao do calculo de valor total na classe Pedido` |
| **`add`** | Inclusão de arquivos auxiliares (configurações, imagens, docs ou dependências). | `add: inclusao do diagrama de classes e MER no README` |
| **`remove`** | Exclusão de arquivos, limpeza de código morto ou remoção de configurações antigas. | `remove: exclusao da antiga classe Cor, substituida por Variacao` |



---

## Códigos de Status HTTP

| Código | Significado         |
| ------ | ------------------- |
| 200    | OK                  |
| 201    | Criado              |
| 204    | Sem conteúdo        |
| 400    | Requisição inválida |
| 401    | Não autorizado      |
| 403    | Proibido            |
| 404    | Não encontrado      |
| 500    | Erro interno        |


## Referência da API

Base URL:
```text
/api
```

### Auth

| Método | Endpoint               |
| ------ |------------------------|
| POST   | /login                 |
| POST   | /login/google          |
| POST   | /login/esqueci-senha   |
| POST   | /login/redefinir-senha |
| POST   | /login/validar-codigo  |
| POST   | /login/reenviar-codigo |


### Produtos

| Método | Endpoint                                   |
| ------ | ------------------------------------------ |
| POST   | /produtos                                  |
| GET    | /produtos                                  |
| GET    | /produtos/{lookupId}                       |
| PUT    | /produtos/{lookupId}                       |
| DELETE | /produtos/{lookupId}                       |
| PATCH  | /produtos/{lookupId}/ativar                |
| POST   | /produtos/categoria/{categoriaId}/promocao |
| DELETE | /produtos/categoria/{categoriaId}/promocao |

## Pedidos

| Método | Endpoint                   |
| ------ | -------------------------- |
| POST   | /pedidos                   |
| GET    | /pedidos                   |
| GET    | /pedidos/{lookupId}        |
| GET    | /pedidos/meus-pedidos      |
| PUT    | /pedidos/{lookupId}/status |
| GET    | /pedidos/{lookupId}/pix    |



