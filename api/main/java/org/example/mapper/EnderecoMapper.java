package org.example.mapper;

import org.example.model.Endereco;
import org.example.rest.dto.Endereco.EnderecoResponseDTO;
import org.example.rest.dto.Endereco.EnderecoSalvarRequestDTO;
import org.springframework.stereotype.Component;

@Component
public class EnderecoMapper {


    public Endereco from(EnderecoSalvarRequestDTO dto){

        return Endereco.builder()
                .cep(dto.getCep())
                .cidade(dto.getCidade())
                .estado(dto.getEstado())
                .rua(dto.getRua())
                .bairro(dto.getBairro())
                .numero(dto.getNumero())
                .complemento(dto.getComplemento())
                .ativo(true)
                .build();

    }


    public EnderecoResponseDTO from(Endereco entity){

        EnderecoResponseDTO dto= new EnderecoResponseDTO();

        dto.setLookupId(entity.getLookupId());
        dto.setCep(entity.getCep());
        dto.setCidade(entity.getCidade());
        dto.setEstado(entity.getEstado());
        dto.setRua(entity.getRua());
        dto.setBairro(entity.getBairro());
        dto.setNumero(entity.getNumero());
        dto.setComplemento(entity.getComplemento());
        dto.setAtivo(entity.getAtivo());

        return dto;

    }



}
