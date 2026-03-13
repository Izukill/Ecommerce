package org.example.service;

import org.example.exception.EntidadeNaoEncontradaException;
import org.example.exception.RegraNegocioException;
import org.example.model.Categoria;
import org.example.model.Produto;
import org.example.repository.CategoriaRepository;
import org.example.rest.dto.Categoria.CategoriaBuscarDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Transactional
    public Categoria criar(Categoria categoria) throws RegraNegocioException {
        if (categoriaRepository.existsByNomeIgnoreCase(categoria.getNome())) {
            throw new RegraNegocioException("Já existe uma categoria cadastrada com este nome.");
        }

        return categoriaRepository.save(categoria);
    }

    @Transactional
    public Categoria atualizar(UUID lookupId, Categoria categoriaNovosDados) throws EntidadeNaoEncontradaException, RegraNegocioException {
        Categoria categoria= recuperarPor(lookupId);

        if (!categoria.getNome().equalsIgnoreCase(categoriaNovosDados.getNome()) &&
                categoriaRepository.existsByNomeIgnoreCase(categoriaNovosDados.getNome())) {
            throw new RegraNegocioException("Já existe outra categoria cadastrada com o nome informado.");
        }

        categoria.setNome(categoriaNovosDados.getNome());

        if (categoria.isAtivo() != categoriaNovosDados.isAtivo()) {
            atualizarProdutosdeCategoria(categoria, categoriaNovosDados.isAtivo());
        }

        categoria.setAtivo(categoriaNovosDados.isAtivo());

        return categoriaRepository.save(categoria);

    }

    public Categoria recuperarPor(UUID lookupId) throws EntidadeNaoEncontradaException {
        return categoriaRepository.findByLookupId(lookupId)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Categoria não encontrada."));
    }

    @Transactional
    public void remover(UUID lookupId) throws EntidadeNaoEncontradaException {
        Categoria categoria = recuperarPor(lookupId);
        categoriaRepository.delete(categoria);

    }

    public Page<Categoria> buscar(CategoriaBuscarDTO dto, Pageable pageable){
        return categoriaRepository.buscarPorFiltros(dto.getNome(), dto.getAtivo(), pageable);
    }


    public void atualizarProdutosdeCategoria(Categoria categoria, boolean statusAtivo){
        if (categoria.getProdutos() != null && !categoria.getProdutos().isEmpty()) {
            for (Produto p : categoria.getProdutos()) {
                p.setAtivo(statusAtivo);
            }
        }
    }


}
