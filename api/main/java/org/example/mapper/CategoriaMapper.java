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
                .build();


    }

    public CategoriaReponseDTO from(Categoria entity){

        CategoriaReponseDTO dto = new CategoriaReponseDTO();

        dto.setLookupId(entity.getLookupId());
        dto.setNome(entity.getNome());
        dto.setAtivo(entity.isAtivo());

        return dto;

    }

}
