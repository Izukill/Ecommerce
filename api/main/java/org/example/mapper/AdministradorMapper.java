package org.example.mapper;

import org.example.model.Administrador;
import org.example.model.EnumPerfil;
import org.example.rest.dto.AdministradorResponseDTO;
import org.example.rest.dto.AdministradorSalvarRequestDTO;
import org.springframework.stereotype.Component;

@Component
public class AdministradorMapper {

    //converte pra salvar no banco
    public Administrador from(AdministradorSalvarRequestDTO dto){
        return Administrador.builder()
                .cargo(dto.getCargo())
                .nome(dto.getNome())
                .email(dto.getEmail())
                .senha(dto.getSenha())
                .tipoPerfil(EnumPerfil.ADM)
                .permissaoTotal(dto.isPermissaoTotal())
                .build();


    }

    public AdministradorResponseDTO from(Administrador entity){

        AdministradorResponseDTO dto = new AdministradorResponseDTO();

        dto.setLookupId(entity.getLookupId());
        dto.setNome(entity.getNome());
        dto.setCargo(entity.getCargo());
        dto.setEmail(entity.getEmail());

        return dto;

    }


}
