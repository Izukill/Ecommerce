package org.example.mapper;

import org.example.model.EnumTamanho;
import org.example.model.Produto;
import org.example.model.VariacaoProduto;
import org.example.rest.dto.Produto.ProdutoResponseDTO;
import org.example.rest.dto.Produto.ProdutoSalvarRequestDTO;
import org.example.rest.dto.VariacaoProduto.VariacaoProdutoResponseDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProdutoMapper {


    public Produto from(ProdutoSalvarRequestDTO dto){


        Produto produto = Produto.builder()
                .nome(dto.getNome())
                .categoria(dto.getCategoria())
                .preco(dto.getPreco())
                .imagemUrl(dto.getImagemUrl())
                .descricao(dto.getDescricao())
                .ativo(dto.isAtivo())
                .build();

        //verifica se o Front-end enviou variações
        if (dto.getVariacaoProduto() != null) {
            List<VariacaoProduto> variacoesEntidade = dto.getVariacaoProduto().stream()
                    .map(varDto -> {
                        VariacaoProduto variacao = new VariacaoProduto();
                        variacao.setTamanho(varDto.getTamanho());
                        variacao.setCor(varDto.getCor());
                        variacao.setQuantidadeEstoque(varDto.getQuantidadeEstoque());
                        variacao.setImagemUrl(varDto.getImagemUrl());
                        variacao.setProduto(produto);

                        return variacao;
                    })
                    .toList();

            produto.setVariacaoProduto(variacoesEntidade);
        }

        return produto;
    }



    public ProdutoResponseDTO from(Produto entity){

        ProdutoResponseDTO dto = new ProdutoResponseDTO();

        dto.setLookupId(entity.getLookupId());
        dto.setCategoria(entity.getCategoria());
        dto.setNome(entity.getNome());
        dto.setDataCriacao(entity.getDataCriacao());
        dto.setAtivo(entity.isAtivo());
        dto.setImagemUrl(entity.getImagemUrl());
        dto.setDescricao(entity.getDescricao());
        dto.setPreco(entity.getPreco());

        //convertendo a lista de entidades para VariaçãoProdutoResponseDTO
        if (entity.getVariacaoProduto() != null) {
            List<VariacaoProdutoResponseDTO> variacoesDto = entity.getVariacaoProduto().stream()
                    .map(varEntidade -> {
                        VariacaoProdutoResponseDTO varDto = new VariacaoProdutoResponseDTO();

                        varDto.setLookupId(varEntidade.getLookupId());
                        if (varEntidade.getTamanho() != null) {
                            varDto.setTamanho(varEntidade.getTamanho().name());
                        }
                        varDto.setCor(varEntidade.getCor());
                        varDto.setQuantidadeEstoque(varEntidade.getQuantidadeEstoque());
                        varDto.setImagemUrl(varEntidade.getImagemUrl());

                        return varDto;
                    })
                    .toList();

            dto.setVariacoes(variacoesDto);
        }

        return dto;

    }




}
