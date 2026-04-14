package org.example.mapper;

import org.example.model.Administrador;
import org.example.model.EnumPerfil;
import org.example.rest.dto.Administrador.AdministradorResponseDTO;
import org.example.rest.dto.Administrador.AdministradorSalvarRequestDTO;
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
                .permissaoTotal(dto.getPermissaoTotal())
                .categoriasPage(dto.getCategoriasPage())
                .clientePage(dto.getClientePage())
                .pedidosPage(dto.getPedidosPage())
                .produtosPage(dto.getProdutosPage())
                .relatoriosPage(dto.getRelatoriosPage())
                .build();


    }

    public AdministradorResponseDTO from(Administrador entity){

        AdministradorResponseDTO dto = new AdministradorResponseDTO();

        dto.setLookupId(entity.getLookupId());
        dto.setNome(entity.getNome());
        dto.setCargo(entity.getCargo());
        dto.setEmail(entity.getEmail());
        dto.setPermissaoTotal(entity.isPermissaoTotal());
        dto.setClientePage(entity.isClientePage());
        dto.setCategoriasPage(entity.isCategoriasPage());
        dto.setPedidosPage(entity.isPedidosPage());
        dto.setProdutosPage(entity.isProdutosPage());
        dto.setRelatoriosPage(entity.isRelatoriosPage());

        return dto;

    }


}
