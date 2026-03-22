package org.example.rest.dto.Pix;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PixResponseDTO {
    private Long idPagamentoMercadoPago; //ID de controle deles
    private String qrCodeBase64;         //a imagem do QR Code
    private String qrCodeCopiaECola;     //o texto do Copia e Cola
}
