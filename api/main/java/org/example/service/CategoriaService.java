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

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Transactional
    public Categoria criar(Categoria categoria) throws RegraNegocioException {
        if (categoriaRepository.existsByNomeIgnoreCase(categoria.getNome())) {
            throw new RegraNegocioException("Já existe uma categoria cadastrada com este nome.");
        }

        categoria.setAtivo(true);

        if (categoria.getMostrarNaHome() == null || !categoria.getMostrarNaHome()) {
            categoria.setMostrarNaHome(false);
            categoria.setOrdemExibicao(null);
        } else {
            if (categoria.getOrdemExibicao() == null) categoria.setOrdemExibicao(1);
        }

        Categoria categoriaSalva = categoriaRepository.save(categoria);

        if (Boolean.TRUE.equals(categoriaSalva.getMostrarNaHome())) {
            reorganizarOrdemVitrine(categoriaSalva);
        }

        return categoriaSalva;
    }

    @Transactional
    public Categoria atualizar(UUID lookupId, Categoria categoriaNovosDados) throws EntidadeNaoEncontradaException, RegraNegocioException {
        Categoria categoria= recuperarPor(lookupId);

        if (!categoria.getNome().equalsIgnoreCase(categoriaNovosDados.getNome()) &&
                categoriaRepository.existsByNomeIgnoreCase(categoriaNovosDados.getNome())) {
            throw new RegraNegocioException("Já existe outra categoria cadastrada com o nome informado.");
        }

        categoria.setNome(categoriaNovosDados.getNome());

        boolean estavaNaHome = Boolean.TRUE.equals(categoria.getMostrarNaHome());
        Integer ordemAntiga = categoria.getOrdemExibicao();
        boolean vaiParaHome = Boolean.TRUE.equals(categoriaNovosDados.getMostrarNaHome());

        if (!vaiParaHome) {
            categoria.setMostrarNaHome(false);
            categoria.setOrdemExibicao(null);
        } else {
            categoria.setMostrarNaHome(true);
            categoria.setOrdemExibicao(categoriaNovosDados.getOrdemExibicao());
        }

        if (categoria.isAtivo() != categoriaNovosDados.isAtivo()) {
            atualizarProdutosdeCategoria(categoria, categoriaNovosDados.isAtivo());
        }
        categoria.setAtivo(categoriaNovosDados.isAtivo());

        Categoria categoriaSalva = categoriaRepository.save(categoria);

        if (estavaNaHome && !vaiParaHome && ordemAntiga != null) {
            preencherLacunas(ordemAntiga);//saiu da home
        } else if (vaiParaHome) {
            reorganizarOrdemVitrine(categoriaSalva); //entrou na home
        }

        return categoriaSalva;

    }

    public Categoria recuperarPor(UUID lookupId) throws EntidadeNaoEncontradaException {
        return categoriaRepository.findByLookupId(lookupId)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Categoria não encontrada."));
    }

    @Transactional
    public void remover(UUID lookupId) throws EntidadeNaoEncontradaException {
        Categoria categoria = recuperarPor(lookupId);
        boolean estavaNaHome = Boolean.TRUE.equals(categoria.getMostrarNaHome());
        Integer ordemAntiga = categoria.getOrdemExibicao();

        categoriaRepository.delete(categoria);

        //checagem de se estiver na vitrine reograniza ela
        if (estavaNaHome && ordemAntiga != null) {
            preencherLacunas(ordemAntiga);
        }

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


    //funções auxiliar

    private void reorganizarOrdemVitrine(Categoria categoriaSalva) {

        if (!Boolean.TRUE.equals(categoriaSalva.getMostrarNaHome()) || categoriaSalva.getOrdemExibicao() == null) {
            return;
        }

        int ordemDesejada = categoriaSalva.getOrdemExibicao();

        List<Categoria> outrasCategoriasNaHome = categoriaRepository.findAll().stream()
                .filter(c -> Boolean.TRUE.equals(c.getMostrarNaHome()))
                .filter(c -> !c.getLookupId().equals(categoriaSalva.getLookupId()))
                .sorted(Comparator.comparingInt(c -> c.getOrdemExibicao() != null ? c.getOrdemExibicao() : 999))
                .collect(Collectors.toList());

        int ordemColisao = ordemDesejada;

        //verifica se tem colisão, se tiver soma 1 na ordem dos debaixo
        for (Categoria outra : outrasCategoriasNaHome) {
            if (outra.getOrdemExibicao() != null && outra.getOrdemExibicao() == ordemColisao) {
                outra.setOrdemExibicao(ordemColisao + 1);
                categoriaRepository.save(outra);

                //verifica se quem empurrou colidiu com o próximo da lista
                ordemColisao++;
            }
        }
    }

    private void preencherLacunas(int ordemRemovida) {
        List<Categoria> categoriasAbaixo = categoriaRepository.findAll().stream()
                .filter(c -> Boolean.TRUE.equals(c.getMostrarNaHome()) && c.getOrdemExibicao() != null)
                .filter(c -> c.getOrdemExibicao() > ordemRemovida) //pra pegar só quem tá em baixo
                .collect(Collectors.toList());

        for (Categoria c : categoriasAbaixo) {
            c.setOrdemExibicao(c.getOrdemExibicao() - 1); //sobe de posição
            categoriaRepository.save(c);
        }
    }


}
