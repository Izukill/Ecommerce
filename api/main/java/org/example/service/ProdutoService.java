package org.example.service;

import org.example.exception.RegraNegocioException;
import org.example.model.Categoria;
import org.example.model.Produto;
import org.example.repository.CategoriaRepository;
import org.example.repository.ProdutoRepository;
import org.example.rest.dto.Produto.ProdutoBuscarDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;


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
    public Produto atualizar(UUID lookupId, Produto dadosAtualizados) throws RegraNegocioException {
        Produto produtoExistente = recuperarPor(lookupId);


        produtoExistente.setNome(dadosAtualizados.getNome());
        produtoExistente.setPreco(dadosAtualizados.getPreco());
        produtoExistente.setCategoria(dadosAtualizados.getCategoria());
        produtoExistente.setImagemUrl(dadosAtualizados.getImagemUrl());
        produtoExistente.setAtivo(dadosAtualizados.isAtivo());

        return produtoRepository.save(produtoExistente);
    }


    @Transactional
    public void remover(UUID lookupId) throws RegraNegocioException {
        Produto produto = recuperarPor(lookupId);
        produtoRepository.delete(produto);
    }


    public Page<Produto> buscar(ProdutoBuscarDTO dto, Pageable pageable) {

        //filtro por nome
        if (dto.getNome() != null && !dto.getNome().isBlank()) {
            return produtoRepository.findByNomeContainingIgnoreCaseAndAtivoTrue(dto.getNome(), pageable);
        }

        //filtro por categoria
        if (dto.getCategoria() != null) {
            return produtoRepository.findByCategoriaAndAtivoTrue(dto.getCategoria(), pageable);
        }

        //se n tiver filtros returona tudo que estiver ativo
        return produtoRepository.findByAtivoTrue(pageable);
    }
}