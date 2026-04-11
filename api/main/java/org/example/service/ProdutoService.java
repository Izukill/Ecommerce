package org.example.service;

import org.example.exception.EntidadeNaoEncontradaException;
import org.example.exception.RegraNegocioException;
import org.example.model.Categoria;
import org.example.model.Produto;
import org.example.model.VariacaoProduto;
import org.example.repository.CategoriaRepository;
import org.example.repository.PedidoRepository;
import org.example.repository.ProdutoRepository;
import org.example.rest.dto.Produto.ProdutoBuscarDTO;
import org.example.rest.dto.Produto.ProdutoSalvarRequestDTO;
import org.example.rest.dto.VariacaoProduto.VariacaoProdutoSalvarRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private PedidoRepository pedidoRepository;


    @Transactional
    public Produto criar(Produto produto) throws RegraNegocioException {

        Categoria categoriaReal = categoriaRepository.findByLookupId(produto.getCategoria().getLookupId())
                .orElseThrow(() -> new RegraNegocioException("Categoria não encontrada!"));

        //seta cada variação para o produto ao qual ela pertence
        if (produto.getVariacaoProduto() != null && !produto.getVariacaoProduto().isEmpty()) {
            produto.getVariacaoProduto().forEach(variacao -> variacao.setProduto(produto));
        }

        produto.setCategoria(categoriaReal);
        produto.setAtivo(true);

        aplicarRegraDePrecoPromocional(produto, categoriaReal, produto.getPrecoPromocional());

        return produtoRepository.save(produto);
    }

    public Produto recuperarPor(UUID lookupId) throws RegraNegocioException {
        return produtoRepository.findByLookupId(lookupId)
                .orElseThrow(() -> new RegraNegocioException("Produto não encontrado no catálogo."));
    }

    @Transactional
    public Produto atualizar(UUID lookupId, ProdutoSalvarRequestDTO dto) throws RegraNegocioException {
        Produto produtoExistente = recuperarPor(lookupId);

        Categoria categoriaReal = categoriaRepository.findByLookupId(dto.getCategoria().getLookupId())
                .orElseThrow(() -> new RegraNegocioException("Categoria não encontrada!"));

        produtoExistente.setNome(dto.getNome());
        produtoExistente.setPreco(dto.getPreco());
        produtoExistente.setCategoria(categoriaReal);
        produtoExistente.setImagemUrl(dto.getImagemUrl());
        produtoExistente.setAtivo(dto.isAtivo());
        produtoExistente.setDescricao(dto.getDescricao());

        aplicarRegraDePrecoPromocional(produtoExistente, categoriaReal, dto.getPrecoPromocional());

        sincronizarVariacoes(produtoExistente, dto.getVariacaoProduto());

        return produtoRepository.save(produtoExistente);
    }

    @Transactional
    public void remover(UUID lookupId) throws RegraNegocioException {
        Produto produto = recuperarPor(lookupId);

        boolean jaFoiVendido = produtoRepository.isProdutoVendido(produto);

        if (jaFoiVendido) {
            produto.setAtivo(false); //soft delete

            if (produto.getVariacaoProduto() != null) {
                for (VariacaoProduto variacao : produto.getVariacaoProduto()) {
                    variacao.setAtivo(false);
                    variacao.setQuantidadeEstoque(0);
                }
            }
            produtoRepository.save(produto);

        } else {
            produtoRepository.delete(produto);
        }
    }


    public Page<Produto> buscar(ProdutoBuscarDTO dto, Pageable pageable) throws EntidadeNaoEncontradaException {

        return produtoRepository.buscarPorFiltros(
                dto.getNome(),
                dto.getCategoriaId(),
                dto.getSemCategoria(),
                dto.getAtivo(),
                pageable
        );
    }

    public void ativar(UUID lookupId) throws RegraNegocioException {
        Produto produto= recuperarPor(lookupId);

        produto.setAtivo(true);
        produtoRepository.save(produto);
    }

    //métodos auxiliares

    @Transactional
    public void aplicarPromocaoCategoria(UUID categoriaId, BigDecimal percentualDesconto) throws RegraNegocioException {

        if (percentualDesconto.compareTo(BigDecimal.ZERO) <= 0 || percentualDesconto.compareTo(new BigDecimal("100")) >= 0) {
            throw new RegraNegocioException("O desconto deve estar entre 1% e 99%.");
        }

        Categoria categoria = categoriaRepository.findByLookupId(categoriaId)
                .orElseThrow(() -> new RegraNegocioException("Categoria não encontrada."));

        categoria.setPercentualDesconto(percentualDesconto);
        categoriaRepository.save(categoria);

        //busca todos os produtos dessa categoria
        List<Produto> produtos = produtoRepository.findByCategoria(categoria);

        for (Produto produto : produtos) {
            //calcula o valor
            BigDecimal valorDesconto = produto.getPreco().multiply(percentualDesconto).divide(new BigDecimal("100"));

            BigDecimal precoNovo = produto.getPreco().subtract(valorDesconto);

            produto.setPrecoPromocional(precoNovo);
        }

        produtoRepository.saveAll(produtos);
    }

    @Transactional
    public void removerPromocaoCategoria(UUID categoriaId) throws RegraNegocioException {
        Categoria categoria = categoriaRepository.findByLookupId(categoriaId)
                .orElseThrow(() -> new RegraNegocioException("Categoria não encontrada."));

        categoria.setPercentualDesconto(null);
        categoriaRepository.save(categoria);

        List<Produto> produtos = produtoRepository.findByCategoria(categoria);

        for (Produto produto : produtos) {
            produto.setPrecoPromocional(null);
        }

        produtoRepository.saveAll(produtos);
    }

    private void aplicarRegraDePrecoPromocional(Produto produto, Categoria categoria, BigDecimal precoPromocionalManual) throws RegraNegocioException {
        if (categoria.getPercentualDesconto() != null && categoria.getPercentualDesconto().compareTo(BigDecimal.ZERO) > 0) {

            // Se a categoria tem desconto, o sistema calcula e força o preço
            BigDecimal valorDesconto = produto.getPreco().multiply(categoria.getPercentualDesconto()).divide(new BigDecimal("100"));
            BigDecimal precoCalculado = produto.getPreco().subtract(valorDesconto);
            produto.setPrecoPromocional(precoCalculado);

        } else {

            //se não tem desconto da categoria valida o desconto manual do usuário
            if (precoPromocionalManual != null) {
                if (precoPromocionalManual.compareTo(produto.getPreco()) >= 0) {
                    throw new RegraNegocioException("O preço promocional deve ser menor que o preço original");
                }
            }
            produto.setPrecoPromocional(precoPromocionalManual);
        }
    }

    private void sincronizarVariacoes(Produto produtoExistente, List<VariacaoProdutoSalvarRequestDTO> variacoesDto) throws RegraNegocioException {
        List<UUID> variacoesRecebidas = new ArrayList<>();

        for (VariacaoProdutoSalvarRequestDTO varDto : variacoesDto) {
            if (varDto.getLookupId() != null) {

                VariacaoProduto varExistente = produtoExistente.getVariacaoProduto().stream()
                        .filter(v -> v.getLookupId().equals(varDto.getLookupId()))
                        .findFirst()
                        .orElseThrow(() -> new RegraNegocioException("Variação não pertence a este produto"));

                varExistente.setCor(varDto.getCor());
                varExistente.setTamanho(varDto.getTamanho());
                varExistente.setQuantidadeEstoque(varDto.getQuantidadeEstoque());
                varExistente.setImagemUrl(varDto.getImagemUrl());
                varExistente.setAtivo(true);
                variacoesRecebidas.add(varExistente.getLookupId());

            } else {

                //verifica se já existe uma inativa no banco
                Optional<VariacaoProduto> varDesativada = produtoExistente.getVariacaoProduto().stream()
                        .filter(v -> v.getCor().equalsIgnoreCase(varDto.getCor()) &&
                                v.getTamanho().equals(varDto.getTamanho()))
                        .findFirst();

                if (varDesativada.isPresent()) {
                    VariacaoProduto ressuscitada = varDesativada.get();
                    ressuscitada.setQuantidadeEstoque(varDto.getQuantidadeEstoque());
                    ressuscitada.setImagemUrl(varDto.getImagemUrl());
                    ressuscitada.setAtivo(true);
                    variacoesRecebidas.add(ressuscitada.getLookupId());

                } else {
                    // Realmente é nova
                    VariacaoProduto novaVar = new VariacaoProduto();
                    novaVar.setCor(varDto.getCor());
                    novaVar.setTamanho(varDto.getTamanho());
                    novaVar.setQuantidadeEstoque(varDto.getQuantidadeEstoque());
                    novaVar.setImagemUrl(varDto.getImagemUrl());
                    novaVar.setAtivo(true);
                    novaVar.setProduto(produtoExistente);

                    produtoExistente.getVariacaoProduto().add(novaVar);
                }
            }
        }

        //desativa as variações que não vieram do front
        for (VariacaoProduto varAntiga : produtoExistente.getVariacaoProduto()) {
            if (varAntiga.getLookupId() != null && !variacoesRecebidas.contains(varAntiga.getLookupId())) {
                varAntiga.setAtivo(false);
            }
        }
    }



}