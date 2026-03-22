package org.example.rest;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.example.rest.dto.Pix.WebhookMercadoPagoDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;

public interface WebHookControllerAPI {

    @Operation(summary = "Recebe a notificação do pix, checa se a transação foi feita.",
            description = "função que checa se o pix realmente foi feito")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realiada com sucesso")
    })
    @PostMapping("/webhook/mercadopago")
    ResponseEntity<Void> receberNotificacaoPix(@RequestBody WebhookMercadoPagoDTO payload);

}
