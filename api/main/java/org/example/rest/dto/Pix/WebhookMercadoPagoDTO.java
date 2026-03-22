package org.example.rest.dto.Pix;

import lombok.Data;

//clase que serve como confirmação de pagamento
@Data
public class WebhookMercadoPagoDTO {
    private String action; //ex:"payment.updated" ou "payment.created"
    private DataMP data;   //aqui dentro vem o ID do pagamento

    @Data
    public static class DataMP {
        private String id;
    }
}