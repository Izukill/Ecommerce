package org.example.service;

import org.example.model.CheckoutFrete;
import org.example.repository.CheckoutFreteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class CheckoutFreteService {

    @Autowired
    CheckoutFreteRepository checkoutFreteRepository;

    public CheckoutFrete obterConfiguracoes() {
        return checkoutFreteRepository.findById(1L).orElseGet(() -> {
            CheckoutFrete novaConfig = new CheckoutFrete();
            return checkoutFreteRepository.save(novaConfig);
        });
    }

    @Transactional
    public CheckoutFrete atualizar(BigDecimal novoFrete){

        CheckoutFrete checkoutFrete = obterConfiguracoes();

        checkoutFrete.setFrete(novoFrete);

        return checkoutFreteRepository.save(checkoutFrete);

    }


}
