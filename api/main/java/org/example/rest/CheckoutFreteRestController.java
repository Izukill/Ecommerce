package org.example.rest;

import jakarta.validation.Valid;
import org.example.exception.MirlleException;
import org.example.model.CheckoutFrete;
import org.example.rest.dto.Checkout.CheckoutFreteResponseDTO;
import org.example.rest.dto.Checkout.CheckoutFreteSalvarResquestDTO;
import org.example.service.CheckoutFreteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/config")
public class CheckoutFreteRestController implements CheckoutFreteRestControllerAPI{


    @Autowired
    private CheckoutFreteService checkoutFreteService;

    @GetMapping
    @Override
    public ResponseEntity<CheckoutFreteResponseDTO> obterConfiguracao() {
        CheckoutFrete config = checkoutFreteService.obterConfiguracoes();

        CheckoutFreteResponseDTO response = new CheckoutFreteResponseDTO();
        response.setFrete(config.getFrete());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/frete")
    @Override
    public ResponseEntity<CheckoutFreteResponseDTO> atualizarFrete(@Valid @RequestBody CheckoutFreteSalvarResquestDTO dto) {
        CheckoutFrete configAtualizada = checkoutFreteService.atualizar(dto.getFrete());

        CheckoutFreteResponseDTO response = new CheckoutFreteResponseDTO();
        response.setFrete(configAtualizada.getFrete());

        return ResponseEntity.ok(response);
    }
}
