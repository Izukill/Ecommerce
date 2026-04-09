package org.example.mock;

import org.example.model.*;
import org.example.repository.CategoriaRepository;
import org.example.repository.PessoaRepository;
import org.example.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
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

    @Override
    public void run(String... args) throws Exception {

        if (repository.findByEmail("jaqueline@gmail.com").isEmpty()) {


            Administrador adm = Administrador.builder()
                    .nome("Jaqueline Ferreira")
                    .permissaoTotal(true)
                    .email("jaqueline@gmail.com")
                    .ativo(true)
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


}
