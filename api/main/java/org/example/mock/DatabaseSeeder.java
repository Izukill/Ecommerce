package org.example.mock;

import org.example.model.*;
import org.example.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private PessoaRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private EnderecoRepository enderecoRepository;

    @Override
    public void run(String... args) throws Exception {

        if (repository.findByEmail("jaqueline@gmail.com").isEmpty()) {


            Administrador adm = Administrador.builder()
                    .nome("Jaqueline Ferreira")
                    .permissaoTotal(true)
                    .email("jaqueline@gmail.com")
                    .ativo(true)
                    .pedidosPage(true)
                    .produtosPage(true)
                    .categoriasPage(true)
                    .clientePage(true)
                    .relatoriosPage(true)
                    .tipoPerfil(EnumPerfil.ADM)
                    .cargo(EnumCargo.DONO)
                    .senha(passwordEncoder.encode("batata"))
                    .lookupId(UUID.randomUUID())
                    .build();

            repository.save(adm);


            System.out.println(">>> Admin padrão criado: jaqueline@gmail.com / batata");
        }

        if (repository.findByEmail("luan@gmail.com").isEmpty()) {


            Administrador adm = Administrador.builder()
                    .nome("Luan Lorêto")
                    .permissaoTotal(true)
                    .email("luan@gmail.com")
                    .tipoPerfil(EnumPerfil.ADM)
                    .ativo(true)
                    .pedidosPage(true)
                    .produtosPage(true)
                    .categoriasPage(true)
                    .clientePage(true)
                    .relatoriosPage(true)
                    .cargo(EnumCargo.DONO)
                    .senha(passwordEncoder.encode("senha"))
                    .lookupId(UUID.randomUUID())
                    .build();

            repository.save(adm);

        }


        if (produtoRepository.count() > 0) {
            System.out.println("Banco de dados já populado. Ignorando Mock...");
            return;
        }

        System.out.println("Iniciando geração de dados de Mock...");


        Categoria catBone = Categoria.builder()
                .nome("Bonés")
                .ativo(true)
                .mostrarNaHome(true)
                .ordemExibicao(1)
                .build();

        Categoria catFitness = Categoria.builder()
                .nome("Fitness")
                .ativo(true)
                .mostrarNaHome(true)
                .ordemExibicao(2)
                .build();

        Categoria catCompressao = Categoria.builder()
                .nome("Compressão")
                .ativo(true)
                .mostrarNaHome(true)
                .ordemExibicao(3)
                .build();

        categoriaRepository.saveAll(Arrays.asList(catBone, catFitness, catCompressao));


        Produto boneAbaReta = criarProduto("Boné Aba Reta Premium", "120.00", "Boné estilo urbano com fechamento ajustável e tecido respirável.", catBone);
        boneAbaReta.setVariacaoProduto(Arrays.asList(
                criarVariacao(boneAbaReta, EnumTamanho.P, "Preto", 15),
                criarVariacao(boneAbaReta, EnumTamanho.P, "Branco", 10)
        ));

        Produto boneTrucker = criarProduto("Boné Trucker Esportivo", "89.90", "Ideal para corridas ao ar livre. Possui tela traseira para ventilação máxima.", catBone);
        boneTrucker.setVariacaoProduto(Arrays.asList(
                criarVariacao(boneTrucker, EnumTamanho.P, "Azul Marinho", 20),
                criarVariacao(boneTrucker, EnumTamanho.P, "Cinza", 5)
        ));



        Produto camisaDryFit = criarProduto("Camiseta Dry Fit Pro", "149.90", "Tecnologia de evaporação rápida de suor. Modelagem anatômica para treino.", catFitness);
        camisaDryFit.setVariacaoProduto(Arrays.asList(
                criarVariacao(camisaDryFit, EnumTamanho.P, "Preto", 30),
                criarVariacao(camisaDryFit, EnumTamanho.M, "Preto", 45),
                criarVariacao(camisaDryFit, EnumTamanho.G, "Preto", 25),
                criarVariacao(camisaDryFit, EnumTamanho.M, "Branco", 20)
        ));

        Produto leggingAlta = criarProduto("Calça Legging Cintura Alta", "199.90", "Tecido zero transparência com alta elasticidade e compressão leve no abdômen.", catFitness);
        leggingAlta.setVariacaoProduto(Arrays.asList(
                criarVariacao(leggingAlta, EnumTamanho.M, "Rosa", 12),
                criarVariacao(leggingAlta, EnumTamanho.G, "Rosa", 10),
                criarVariacao(leggingAlta, EnumTamanho.M, "Preto", 50)
        ));

        Produto topSustentacao = criarProduto("Top Esportivo Alta Sustentação", "119.50", "Costuras reforçadas e bojo removível para treinos de alto impacto.", catFitness);
        topSustentacao.setVariacaoProduto(Arrays.asList(
                criarVariacao(topSustentacao, EnumTamanho.P, "Vermelho", 8),
                criarVariacao(topSustentacao, EnumTamanho.M, "Vermelho", 15),
                criarVariacao(topSustentacao, EnumTamanho.G, "Preto", 22)
        ));


        Produto camisaTermica = criarProduto("Camisa Térmica Segunda Pele", "135.00", "Mantém a temperatura corporal ideal e melhora a circulação durante a atividade física.", catCompressao);
        camisaTermica.setVariacaoProduto(Arrays.asList(
                criarVariacao(camisaTermica, EnumTamanho.P, "Preto", 40),
                criarVariacao(camisaTermica, EnumTamanho.M, "Preto", 60),
                criarVariacao(camisaTermica, EnumTamanho.G, "Preto", 60),
                criarVariacao(camisaTermica, EnumTamanho.GG, "Preto", 35)
        ));

        Produto bermudaCompressao = criarProduto("Bermuda Compressão Muscle Recovery", "160.00", "Reduz a fadiga muscular e acelera a recuperação pós-treino.", catCompressao);
        bermudaCompressao.setVariacaoProduto(Arrays.asList(
                criarVariacao(bermudaCompressao, EnumTamanho.M, "Azul", 18),
                criarVariacao(bermudaCompressao, EnumTamanho.G, "Azul", 20),
                criarVariacao(bermudaCompressao, EnumTamanho.GG, "Preto", 15)
        ));
        //tem cascade.typeAll
        produtoRepository.saveAll(Arrays.asList(
                boneAbaReta, boneTrucker,
                camisaDryFit, leggingAlta, topSustentacao,
                camisaTermica, bermudaCompressao
        ));

        // ============ CLIENTES ============
        Cliente ana = criarCliente("Ana Souza", "ana@gmail.com", "11999990001", "111.111.111-01");
        Cliente carlos = criarCliente("Carlos Mendes", "carlos@gmail.com", "11999990002", "222.222.222-02");
        Cliente fernanda = criarCliente("Fernanda Lima", "fernanda@gmail.com", "11999990003", "333.333.333-03");
        Cliente rafael = criarCliente("Rafael Costa", "rafael@gmail.com", "11999990004", "444.444.444-04");

        clienteRepository.saveAll(Arrays.asList(ana, carlos, fernanda, rafael));

        // ============ ENDEREÇOS ============
        Endereco endAna = criarEndereco(ana, "60000-000", "Rua das Flores", "Centro", 100, "CE");
        Endereco endCarlos = criarEndereco(carlos, "01310-100", "Av. Paulista", "Bela Vista", 1578, "SP");
        Endereco endFernanda = criarEndereco(fernanda, "20040-020", "Rua da Assembleia", "Centro", 77, "RJ");
        Endereco endRafael = criarEndereco(rafael, "30130-110", "Av. Afonso Pena", "Centro", 400, "MG");

        ana.setEnderecos(List.of(endAna));
        carlos.setEnderecos(List.of(endCarlos));
        fernanda.setEnderecos(List.of(endFernanda));
        rafael.setEnderecos(List.of(endRafael));

        enderecoRepository.saveAll(Arrays.asList(endCarlos,endAna,endFernanda,endRafael));
        clienteRepository.saveAll(Arrays.asList(ana, carlos, fernanda, rafael));


        BigDecimal frete = new BigDecimal("35.00");

        // ============ PEDIDOS ============

        // Pedido 1 — PAGO — Ana — mês atual
        Pedido p1 = criarPedido(ana, endAna, EnumStatusPedido.PAGO, frete,
                LocalDateTime.now().minusDays(2),
                List.of(
                        criarItem(camisaDryFit.getVariacaoProduto().get(0), 2, new BigDecimal("149.90")),
                        criarItem(leggingAlta.getVariacaoProduto().get(2), 1, new BigDecimal("199.90"))
                )
        );

        // Pedido 2 — ENVIADO — Carlos — mês atual
        Pedido p2 = criarPedido(carlos, endCarlos, EnumStatusPedido.ENVIADO, frete,
                LocalDateTime.now().minusDays(5),
                List.of(
                        criarItem(boneAbaReta.getVariacaoProduto().get(0), 1, new BigDecimal("120.00")),
                        criarItem(bermudaCompressao.getVariacaoProduto().get(0), 1, new BigDecimal("160.00"))
                )
        );

        // Pedido 3 — AGUARDANDO_PAGAMENTO — Fernanda — mês atual
        Pedido p3 = criarPedido(fernanda, endFernanda, EnumStatusPedido.AGUARDANDO_PAGAMENTO, frete,
                LocalDateTime.now().minusDays(1),
                List.of(
                        criarItem(topSustentacao.getVariacaoProduto().get(1), 2, new BigDecimal("119.50"))
                )
        );

        // Pedido 4 — CANCELADO — Rafael — mês atual
        Pedido p4 = criarPedido(rafael, endRafael, EnumStatusPedido.CANCELADO, frete,
                LocalDateTime.now().minusDays(3),
                List.of(
                        criarItem(camisaTermica.getVariacaoProduto().get(1), 1, new BigDecimal("135.00"))
                )
        );

        // Pedido 5 — PAGO — Carlos — mês atual
        Pedido p5 = criarPedido(carlos, endCarlos, EnumStatusPedido.PAGO, frete,
                LocalDateTime.now().minusDays(7),
                List.of(
                        criarItem(camisaDryFit.getVariacaoProduto().get(1), 3, new BigDecimal("149.90")),
                        criarItem(boneTrucker.getVariacaoProduto().get(0), 1, new BigDecimal("89.90"))
                )
        );

        // Pedido 6 — ENVIADO — Ana — mês passado
        Pedido p6 = criarPedido(ana, endAna, EnumStatusPedido.ENVIADO, frete,
                LocalDateTime.now().minusMonths(1).minusDays(5),
                List.of(
                        criarItem(leggingAlta.getVariacaoProduto().get(0), 1, new BigDecimal("199.90")),
                        criarItem(topSustentacao.getVariacaoProduto().get(0), 1, new BigDecimal("119.50"))
                )
        );

        // Pedido 7 — PAGO — Fernanda — mês passado
        Pedido p7 = criarPedido(fernanda, endFernanda, EnumStatusPedido.PAGO, frete,
                LocalDateTime.now().minusMonths(1).minusDays(10),
                List.of(
                        criarItem(bermudaCompressao.getVariacaoProduto().get(1), 2, new BigDecimal("160.00"))
                )
        );

        // Pedido 8 — CANCELADO — Rafael — mês passado
        Pedido p8 = criarPedido(rafael, endRafael, EnumStatusPedido.CANCELADO, frete,
                LocalDateTime.now().minusMonths(1).minusDays(15),
                List.of(
                        criarItem(boneAbaReta.getVariacaoProduto().get(1), 1, new BigDecimal("120.00"))
                )
        );

        // Pedido 9 — PAGO — Ana — 2 meses atrás
        Pedido p9 = criarPedido(ana, endAna, EnumStatusPedido.PAGO, frete,
                LocalDateTime.now().minusMonths(2).minusDays(3),
                List.of(
                        criarItem(camisaTermica.getVariacaoProduto().get(2), 1, new BigDecimal("135.00")),
                        criarItem(camisaDryFit.getVariacaoProduto().get(3), 2, new BigDecimal("149.90"))
                )
        );

        // Pedido 10 — ENVIADO — Carlos — 3 meses atrás
        Pedido p10 = criarPedido(carlos, endCarlos, EnumStatusPedido.ENVIADO, frete,
                LocalDateTime.now().minusMonths(3).minusDays(8),
                List.of(
                        criarItem(topSustentacao.getVariacaoProduto().get(2), 1, new BigDecimal("119.50")),
                        criarItem(boneTrucker.getVariacaoProduto().get(1), 2, new BigDecimal("89.90"))
                )
        );

        // Pedido 11 — PAGO — Fernanda — mês atual
        Pedido p11 = criarPedido(fernanda, endFernanda, EnumStatusPedido.PAGO, frete,
                LocalDateTime.now().minusDays(4),
                List.of(
                        criarItem(camisaDryFit.getVariacaoProduto().get(0), 2, new BigDecimal("149.90")),
                        criarItem(boneAbaReta.getVariacaoProduto().get(0), 1, new BigDecimal("120.00"))
                )
        );

        // Pedido 12 — ENVIADO — Rafael — mês atual
        Pedido p12 = criarPedido(rafael, endRafael, EnumStatusPedido.ENVIADO, frete,
                LocalDateTime.now().minusDays(6),
                List.of(
                        criarItem(bermudaCompressao.getVariacaoProduto().get(2), 1, new BigDecimal("160.00")),
                        criarItem(camisaTermica.getVariacaoProduto().get(0), 1, new BigDecimal("135.00"))
                )
        );

        // Pedido 13 — PAGO — Ana — mês atual
        Pedido p13 = criarPedido(ana, endAna, EnumStatusPedido.PAGO, frete,
                LocalDateTime.now().minusDays(8),
                List.of(
                        criarItem(topSustentacao.getVariacaoProduto().get(2), 3, new BigDecimal("119.50")),
                        criarItem(leggingAlta.getVariacaoProduto().get(1), 1, new BigDecimal("199.90"))
                )
        );

        // Pedido 14 — AGUARDANDO_PAGAMENTO — Carlos — mês atual
        Pedido p14 = criarPedido(carlos, endCarlos, EnumStatusPedido.AGUARDANDO_PAGAMENTO, frete,
                LocalDateTime.now().minusDays(1),
                List.of(
                        criarItem(boneTrucker.getVariacaoProduto().get(1), 2, new BigDecimal("89.90"))
                )
        );

        // Pedido 15 — CANCELADO — Fernanda — mês atual
        Pedido p15 = criarPedido(fernanda, endFernanda, EnumStatusPedido.CANCELADO, frete,
                LocalDateTime.now().minusDays(9),
                List.of(
                        criarItem(camisaTermica.getVariacaoProduto().get(3), 1, new BigDecimal("135.00"))
                )
        );

        // Pedido 16 — PAGO — Rafael — mês passado
        Pedido p16 = criarPedido(rafael, endRafael, EnumStatusPedido.PAGO, frete,
                LocalDateTime.now().minusMonths(1).minusDays(2),
                List.of(
                        criarItem(camisaDryFit.getVariacaoProduto().get(2), 2, new BigDecimal("149.90")),
                        criarItem(bermudaCompressao.getVariacaoProduto().get(0), 1, new BigDecimal("160.00"))
                )
        );

        // Pedido 17 — ENVIADO — Ana — mês passado
        Pedido p17 = criarPedido(ana, endAna, EnumStatusPedido.ENVIADO, frete,
                LocalDateTime.now().minusMonths(1).minusDays(8),
                List.of(
                        criarItem(leggingAlta.getVariacaoProduto().get(0), 2, new BigDecimal("199.90")),
                        criarItem(boneAbaReta.getVariacaoProduto().get(1), 1, new BigDecimal("120.00"))
                )
        );

        // Pedido 18 — PAGO — Carlos — mês passado
        Pedido p18 = criarPedido(carlos, endCarlos, EnumStatusPedido.PAGO, frete,
                LocalDateTime.now().minusMonths(1).minusDays(20),
                List.of(
                        criarItem(topSustentacao.getVariacaoProduto().get(0), 1, new BigDecimal("119.50")),
                        criarItem(camisaTermica.getVariacaoProduto().get(1), 2, new BigDecimal("135.00"))
                )
        );

        // Pedido 19 — CANCELADO — Ana — mês passado
        Pedido p19 = criarPedido(ana, endAna, EnumStatusPedido.CANCELADO, frete,
                LocalDateTime.now().minusMonths(1).minusDays(25),
                List.of(
                        criarItem(boneTrucker.getVariacaoProduto().get(0), 3, new BigDecimal("89.90"))
                )
        );

        // Pedido 20 — PAGO — Fernanda — 2 meses atrás
        Pedido p20 = criarPedido(fernanda, endFernanda, EnumStatusPedido.PAGO, frete,
                LocalDateTime.now().minusMonths(2).minusDays(6),
                List.of(
                        criarItem(camisaDryFit.getVariacaoProduto().get(1), 4, new BigDecimal("149.90"))
                )
        );

        // Pedido 21 — ENVIADO — Rafael — 2 meses atrás
        Pedido p21 = criarPedido(rafael, endRafael, EnumStatusPedido.ENVIADO, frete,
                LocalDateTime.now().minusMonths(2).minusDays(12),
                List.of(
                        criarItem(bermudaCompressao.getVariacaoProduto().get(1), 2, new BigDecimal("160.00")),
                        criarItem(topSustentacao.getVariacaoProduto().get(1), 1, new BigDecimal("119.50"))
                )
        );

        // Pedido 22 — PAGO — Carlos — 2 meses atrás
        Pedido p22 = criarPedido(carlos, endCarlos, EnumStatusPedido.PAGO, frete,
                LocalDateTime.now().minusMonths(2).minusDays(18),
                List.of(
                        criarItem(leggingAlta.getVariacaoProduto().get(2), 1, new BigDecimal("199.90")),
                        criarItem(boneAbaReta.getVariacaoProduto().get(0), 2, new BigDecimal("120.00"))
                )
        );

        // Pedido 23 — AGUARDANDO_PAGAMENTO — Fernanda — 2 meses atrás
        Pedido p23 = criarPedido(fernanda, endFernanda, EnumStatusPedido.AGUARDANDO_PAGAMENTO, frete,
                LocalDateTime.now().minusMonths(2).minusDays(22),
                List.of(
                        criarItem(camisaTermica.getVariacaoProduto().get(2), 1, new BigDecimal("135.00"))
                )
        );

        // Pedido 24 — PAGO — Ana — 3 meses atrás
        Pedido p24 = criarPedido(ana, endAna, EnumStatusPedido.PAGO, frete,
                LocalDateTime.now().minusMonths(3).minusDays(4),
                List.of(
                        criarItem(topSustentacao.getVariacaoProduto().get(2), 2, new BigDecimal("119.50")),
                        criarItem(boneTrucker.getVariacaoProduto().get(0), 2, new BigDecimal("89.90"))
                )
        );

        // Pedido 25 — ENVIADO — Carlos — 3 meses atrás
        Pedido p25 = criarPedido(carlos, endCarlos, EnumStatusPedido.ENVIADO, frete,
                LocalDateTime.now().minusMonths(3).minusDays(14),
                List.of(
                        criarItem(camisaDryFit.getVariacaoProduto().get(3), 3, new BigDecimal("149.90")),
                        criarItem(leggingAlta.getVariacaoProduto().get(1), 1, new BigDecimal("199.90"))
                )
        );

        // Pedido 26 — PAGO — Rafael — 3 meses atrás
        Pedido p26 = criarPedido(rafael, endRafael, EnumStatusPedido.PAGO, frete,
                LocalDateTime.now().minusMonths(3).minusDays(20),
                List.of(
                        criarItem(bermudaCompressao.getVariacaoProduto().get(2), 1, new BigDecimal("160.00")),
                        criarItem(camisaTermica.getVariacaoProduto().get(0), 2, new BigDecimal("135.00"))
                )
        );

        // Pedido 27 — CANCELADO — Carlos — 4 meses atrás
        Pedido p27 = criarPedido(carlos, endCarlos, EnumStatusPedido.CANCELADO, frete,
                LocalDateTime.now().minusMonths(4).minusDays(5),
                List.of(
                        criarItem(boneAbaReta.getVariacaoProduto().get(1), 2, new BigDecimal("120.00"))
                )
        );

        // Pedido 28 — PAGO — Fernanda — 4 meses atrás
        Pedido p28 = criarPedido(fernanda, endFernanda, EnumStatusPedido.PAGO, frete,
                LocalDateTime.now().minusMonths(4).minusDays(10),
                List.of(
                        criarItem(camisaDryFit.getVariacaoProduto().get(0), 2, new BigDecimal("149.90")),
                        criarItem(topSustentacao.getVariacaoProduto().get(0), 1, new BigDecimal("119.50"))
                )
        );

        // Pedido 29 — ENVIADO — Ana — 5 meses atrás
        Pedido p29 = criarPedido(ana, endAna, EnumStatusPedido.ENVIADO, frete,
                LocalDateTime.now().minusMonths(5).minusDays(7),
                List.of(
                        criarItem(leggingAlta.getVariacaoProduto().get(2), 2, new BigDecimal("199.90")),
                        criarItem(bermudaCompressao.getVariacaoProduto().get(0), 1, new BigDecimal("160.00"))
                )
        );

        // Pedido 30 — PAGO — Rafael — 5 meses atrás
        Pedido p30 = criarPedido(rafael, endRafael, EnumStatusPedido.PAGO, frete,
                LocalDateTime.now().minusMonths(5).minusDays(15),
                List.of(
                        criarItem(camisaTermica.getVariacaoProduto().get(3), 1, new BigDecimal("135.00")),
                        criarItem(boneTrucker.getVariacaoProduto().get(1), 3, new BigDecimal("89.90")),
                        criarItem(boneAbaReta.getVariacaoProduto().get(0), 1, new BigDecimal("120.00"))
                )
        );

        pedidoRepository.saveAll(Arrays.asList(
                p1, p2, p3, p4, p5, p6, p7, p8, p9, p10,
                p11, p12, p13, p14, p15, p16, p17, p18, p19, p20,
                p21, p22, p23, p24, p25, p26, p27, p28, p29, p30
        ));

        System.out.println("Mocks gerados com sucesso! 🛒");
    }

    //funções auxiliares pra n encher de código

    private Produto criarProduto(String nome, String preco, String descricao, Categoria categoria) {
        return Produto.builder()
                .nome(nome)
                .preco(new BigDecimal(preco))
                .descricao(descricao)
                .categoria(categoria)
                .ativo(true)
                .build();
    }

    private VariacaoProduto criarVariacao(Produto produto, EnumTamanho tamanho, String cor, int quantidade) {
        return VariacaoProduto.builder()
                .produto(produto)
                .tamanho(tamanho)
                .cor(cor)
                .quantidadeEstoque(quantidade)
                .ativo(true)
                .build();
    }

    private Cliente criarCliente(String nome, String email, String telefone, String cpf) {
        return Cliente.builder()
                .nome(nome)
                .email(email)
                .telefone(telefone)
                .cpf(cpf)
                .senha(passwordEncoder.encode("senha123"))
                .ativo(true)
                .tipoPerfil(EnumPerfil.CLIENTE)
                .lookupId(UUID.randomUUID())
                .dataCadastro(LocalDate.now())
                .build();
    }

    private Endereco criarEndereco(Cliente cliente, String cep, String rua, String bairro, int numero, String estado) {
        return Endereco.builder()
                .cliente(cliente)
                .cep(cep)
                .rua(rua)
                .bairro(bairro)
                .numero(numero)
                .cidade("Cidade")
                .estado(estado)
                .ativo(true)
                .lookupId(UUID.randomUUID())
                .build();
    }

    private Pedido criarPedido(Cliente cliente, Endereco endereco, EnumStatusPedido status,
                               BigDecimal frete, LocalDateTime dataHora, List<ItemPedido> itens) {
        BigDecimal totalItens = itens.stream()
                .map(i -> i.getPrecoUnitario().multiply(BigDecimal.valueOf(i.getQuantidade())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Pedido pedido = Pedido.builder()
                .cliente(cliente)
                .enderecoEntrega(endereco)
                .status(status)
                .freteFixo(frete)
                .valorTotal(totalItens.add(frete))
                .dataHora(dataHora)
                .build();

        itens.forEach(i -> i.setPedido(pedido));
        pedido.setItens(itens);

        return pedido;
    }

    private ItemPedido criarItem(VariacaoProduto variacao, int quantidade, BigDecimal precoUnitario) {
        return ItemPedido.builder()
                .produto(variacao)
                .quantidade(quantidade)
                .precoUnitario(precoUnitario)
                .build();
    }


}
