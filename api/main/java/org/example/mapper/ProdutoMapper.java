package org.example.mapper;

import org.example.model.Produto;
import org.example.rest.dto.ProdutoResponseDTO;
import org.example.rest.dto.ProdutoSalvarRequestDTO;
import org.example.rest.dto.VariacaoProdutoResponseDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProdutoMapper {


    public Produto from(ProdutoSalvarRequestDTO dto){

        return Produto.builder()
                .nome(dto.getNome())
                .categoria(dto.getCategoria())
                .ativo(dto.isAtivo())
                .preco(dto.getPreco())
                .imagemUrl(dto.getImagemUrl())
                .build();

    }



    public ProdutoResponseDTO from(Produto entity){

        ProdutoResponseDTO dto= new ProdutoResponseDTO();

        dto.setLookupId(entity.getLookupId());
        dto.setCategoria(entity.getCategoria().name());
        dto.setNome(entity.getNome());
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
