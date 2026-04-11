package org.example.mapper;

import org.example.model.Categoria;
import org.example.rest.dto.Categoria.CategoriaReponseDTO;
import org.example.rest.dto.Categoria.CategoriaSalvarRequestDTO;
import org.springframework.stereotype.Component;

@Component
public class CategoriaMapper {

    public Categoria from(CategoriaSalvarRequestDTO dto){
        return Categoria.builder()
                .nome(dto.getNome())
                .mostrarNaHome(dto.getMostrarNaHome())
                .ordemExibicao(dto.getOrdemExibicao())
                .build();


    }

    public CategoriaReponseDTO from(Categoria entity){

        CategoriaReponseDTO dto = new CategoriaReponseDTO();

        dto.setLookupId(entity.getLookupId());
        dto.setNome(entity.getNome());
        dto.setMostrarNaHome(entity.getMostrarNaHome());
        dto.setOrdemExibicao(entity.getOrdemExibicao());
        dto.setAtivo(entity.isAtivo());
        dto.setPercentualDesconto(entity.getPercentualDesconto());

        return dto;

    }

}
