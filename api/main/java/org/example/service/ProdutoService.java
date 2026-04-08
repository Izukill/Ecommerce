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
    public Produto criar(Produto produto) {

        UUID categoriaLookupId = produto.getCategoria().getLookupId();
        Categoria categoriaReal = categoriaRepository.findByLookupId(categoriaLookupId)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada!"));

        //seta cada variacao o produto a qual ela pertence
        if (produto.getVariacaoProduto() != null && !produto.getVariacaoProduto().isEmpty()) {
            produto.getVariacaoProduto().forEach(variacao -> variacao.setProduto(produto));
        }

        produto.setCategoria(categoriaReal);
        produto.setAtivo(true);

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
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada!"));

        produtoExistente.setNome(dto.getNome());
        produtoExistente.setPreco(dto.getPreco());
        produtoExistente.setCategoria(categoriaReal);
        produtoExistente.setImagemUrl(dto.getImagemUrl());
        produtoExistente.setAtivo(dto.isAtivo());
        produtoExistente.setDescricao(dto.getDescricao());

        // Lista para rastrear quais variações o Front-end mandou (ou seja, quais devem ficar ativas)
        List<UUID> variacoesRecebidas = new ArrayList<>();

        //Processa apenas o que veio do front
        for (VariacaoProdutoSalvarRequestDTO varDto : dto.getVariacaoProduto()) {

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
                // B) O front acha que é nova, vamos verificar se já existe uma "inativa" no banco
                Optional<VariacaoProduto> varDesativada = produtoExistente.getVariacaoProduto().stream()
                        .filter(v -> v.getCor().equalsIgnoreCase(varDto.getCor()) &&
                                v.getTamanho().equals(varDto.getTamanho()))
                        .findFirst();

                if (varDesativada.isPresent()) {
                    // 🎉 "Ressuscita" a variação inativa!
                    VariacaoProduto ressuscitada = varDesativada.get();
                    ressuscitada.setQuantidadeEstoque(varDto.getQuantidadeEstoque());
                    ressuscitada.setImagemUrl(varDto.getImagemUrl());
                    ressuscitada.setAtivo(true);

                    variacoesRecebidas.add(ressuscitada.getLookupId());

                } else {
                    //Se realmente for inédita
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

        // 2. SEGUNDO LOOP: Desativa as variações que não vieram do front (O Soft Delete perfeito)
        for (VariacaoProduto varAntiga : produtoExistente.getVariacaoProduto()) {
            if (varAntiga.getLookupId() != null && !variacoesRecebidas.contains(varAntiga.getLookupId())) {
                varAntiga.setAtivo(false); // Fica oculta da loja, mas os pedidos antigos não quebram!
            }
        }

        return produtoRepository.save(produtoExistente);
    }

    @Transactional
    public void remover(UUID lookupId) throws RegraNegocioException {
        Produto produto = recuperarPor(lookupId);

        // 1. Pergunta ao banco se esse produto já tem alguma venda no histórico
        boolean jaFoiVendido = produtoRepository.isProdutoVendido(produto);

        if (jaFoiVendido) {
            produto.setAtivo(false); // Esconde o produto

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

        //filtro por nome
        if (dto.getNome() != null && !dto.getNome().isBlank()) {
            return produtoRepository.findByNomeContainingIgnoreCaseAndAtivoTrue(dto.getNome(), pageable);
        }

        //filtro por categoria
        if (dto.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findByLookupId(dto.getCategoriaId())
                    .orElseThrow(() -> new EntidadeNaoEncontradaException("Categoria não encontrada."));
            return produtoRepository.findByCategoriaAndAtivoTrue(categoria, pageable);
        }

        //se n tiver filtros returona tudo
        return produtoRepository.findByAtivoTrue(pageable);
    }

    public void ativar(UUID lookupId) throws RegraNegocioException {
        Produto produto= recuperarPor(lookupId);

        produto.setAtivo(true);
        produtoRepository.save(produto);
    }
}