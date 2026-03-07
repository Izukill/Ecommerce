package org.example.mapper;

import org.example.model.Cliente;
import org.example.model.EnumPerfil;
import org.example.rest.dto.ClienteResponseDTO;
import org.example.rest.dto.ClienteSalvarRequestDTO;
import org.springframework.stereotype.Component;

@Component
public class ClienteMapper {


    public Cliente from(ClienteSalvarRequestDTO dto){

        return Cliente.builder()
                .nome(dto.getNome())
                .email(dto.getEmail())
                .senha(dto.getSenha())
                .tipoPerfil(EnumPerfil.CLIENTE)
                .telefone(dto.getTelefone())
                .build();


    }


    public ClienteResponseDTO from(Cliente entity){

        ClienteResponseDTO dto= new ClienteResponseDTO();

        dto.setLookupId(entity.getLookupId());
        dto.setNome(entity.getNome());
        dto.setEmail(entity.getEmail());
        dto.setTelefone(entity.getTelefone());

        return dto;

    }





}
