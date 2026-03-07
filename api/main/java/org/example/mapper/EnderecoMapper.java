package org.example.mapper;

import org.example.model.Endereco;
import org.example.rest.dto.EnderecoResponseDTO;
import org.example.rest.dto.EnderecoSalvarRequestDTO;
import org.springframework.stereotype.Component;

@Component
public class EnderecoMapper {


    public Endereco from(EnderecoSalvarRequestDTO dto){

        return Endereco.builder()
                .cep(dto.getCep())
                .rua(dto.getRua())
                .bairro(dto.getBairro())
                .numero(dto.getNumero())
                .complemento(dto.getComplemento())
                .pagarNaEntrega(dto.getPagarNaEntrega())
                .build();

    }


    public EnderecoResponseDTO from(Endereco entity){

        EnderecoResponseDTO dto= new EnderecoResponseDTO();

        dto.setLookupID(entity.getLookupId());
        dto.setCep(entity.getCep());
        dto.setRua(entity.getRua());
        dto.setBairro(entity.getBairro());
        dto.setNumero(entity.getNumero());
        dto.setComplemento(entity.getComplemento());
        dto.setPagarNaEntrega(entity.isPagarNaEntrega());

        return dto;

    }



}
