package org.example.mapper;

import org.example.model.Produto;
import org.example.rest.dto.Produto.ProdutoResponseDTO;
import org.example.rest.dto.Produto.ProdutoSalvarRequestDTO;
import org.example.rest.dto.VariacaoProduto.VariacaoProdutoResponseDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProdutoMapper {


    public Produto from(ProdutoSalvarRequestDTO dto){

        return Produto.builder()
                .nome(dto.getNome())
                .categoria(dto.getCategoria())
                .preco(dto.getPreco())
                .imagemUrl(dto.getImagemUrl())
                .build();

    }



    public ProdutoResponseDTO from(Produto entity){

        ProdutoResponseDTO dto= new ProdutoResponseDTO();

        dto.setLookupId(entity.getLookupId());
        dto.setCategoria(entity.getCategoria());
        dto.setNome(entity.getNome());
        dto.setAtivo(entity.isAtivo());
        dto.setImagemUrl(entity.getImagemUrl());
        dto.setPreco(entity.getPreco());


        //convertendo a lista para VariacaoProdutoResponse
        if (entity.getVariacaoProduto() != null) {
            List<VariacaoProdutoResponseDTO> variacoesDto = entity.getVariacaoProduto().stream()
                    .map(varEntidade -> {
                        VariacaoProdutoResponseDTO varDto = new VariacaoProdutoResponseDTO();

                        varDto.setLookupId(varEntidade.getLookupId());
                        varDto.setTamanho(varEntidade.getTamanho().name());
                        varDto.setCor(varEntidade.getCor());
                        varDto.setQuantidadeEstoque(varEntidade.getQuantidadeEstoque());

                        return varDto;
                    })
                    .toList();

            dto.setVariacoes(variacoesDto);
        }

        return dto;




    }




}
