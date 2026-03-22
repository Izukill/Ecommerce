package org.example.rest;


import org.example.payment.PixService;
import org.example.rest.dto.Pix.WebhookMercadoPagoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WebHookController implements WebHookControllerAPI{


    @Autowired
    private PixService pixService;

    @Override
    @PostMapping("/webhook/mercadopago")
    public ResponseEntity<Void> receberNotificacaoPix(@RequestBody WebhookMercadoPagoDTO payload) {

        System.out.println("Mercado pago chamou o pix meu dog tá suave" + payload.getAction());

        // Verifica se é uma notificação de atualização de pagamento
        if ("payment.updated".equals(payload.getAction()) || "payment.created".equals(payload.getAction())) {

            //pega o ID que o Mercado Pago mandou
            Long idPagamentoMP = Long.valueOf(payload.getData().getId());

            //manda pro Service ir lá conferir se foi pago mesmo
            pixService.processarNotificacao(idPagamentoMP);
        }

        //é uma ação atômica, então precisa dar 200, se não a transação é cancelada.
        return ResponseEntity.ok().build();
    }

}
