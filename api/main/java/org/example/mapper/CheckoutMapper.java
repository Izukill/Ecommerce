package org.example.mapper;

import org.example.model.CheckoutFrete;
import org.example.rest.dto.Checkout.CheckoutFreteResponseDTO;
import org.example.rest.dto.Checkout.CheckoutFreteSalvarResquestDTO;
import org.springframework.stereotype.Component;

@Component
public class CheckoutMapper{


    public CheckoutFrete from(CheckoutFreteSalvarResquestDTO dto){
        return CheckoutFrete.builder()
                .frete(dto.getFrete())
                .build();
    }

    public CheckoutFreteResponseDTO from (CheckoutFrete entity){

        CheckoutFreteResponseDTO dto = new CheckoutFreteResponseDTO();

        dto.setLookupId(entity.getLookupId());
        dto.setFrete(entity.getFrete());

        return dto;

    }



}
