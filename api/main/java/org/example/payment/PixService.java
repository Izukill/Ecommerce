package org.example.payment;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.common.IdentificationRequest;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.core.MPRequestOptions;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.example.model.Cliente;
import org.example.model.EnumStatusPedido;
import org.example.model.Pedido;
import org.example.repository.PedidoRepository;
import org.example.rest.dto.Pix.PixResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Service
public class PixService {

    @Value("${mercadopago.access-token}")
    private String accessToken;

    @Autowired
    private PedidoRepository pedidoRepository;

    //assim que o spring rodar, isso aqui roda e configura a chave lá no banco
    @PostConstruct
    public void init() {
        MercadoPagoConfig.setAccessToken(accessToken);
    }

    public PixResponseDTO gerarPix(BigDecimal valorTotal, Cliente cliente) {
        try {
            PaymentClient client = new PaymentClient();

            OffsetDateTime dataExpiracaoMercadoPago = OffsetDateTime.now().plusMinutes(30); //data expiração do pagamento de 30 min

            String cpfLimpo = cliente.getCpf().replaceAll("[^0-9]", "");

            //pega o cpf limpo para passar no payer request
            IdentificationRequest identification = IdentificationRequest.builder()
                    .type("CPF")
                    .number(cpfLimpo)
                    .build();

            //pega quem tá pagando
            PaymentPayerRequest payer = PaymentPayerRequest.builder()
                    .email(cliente.getEmail())
                    .firstName(cliente.getNome())
                    .identification(identification)
                    .build();

            //pega qual o valor e o metodo de pagamento
            PaymentCreateRequest request = PaymentCreateRequest.builder()
                    .transactionAmount(valorTotal)
                    .paymentMethodId("pix")
                    .payer(payer)
                    .dateOfExpiration(dataExpiracaoMercadoPago)
                    .build();

            MPRequestOptions customOptions = MPRequestOptions.builder()
                    .accessToken(accessToken)
                    .build();

            //se passa as customOptions como segundo parâmetro para passar o token
            Payment payment = client.create(request, customOptions);

            //extrai os dados do QR Code da resposta
            String base64 = payment.getPointOfInteraction().getTransactionData().getQrCodeBase64();
            String copiaECola = payment.getPointOfInteraction().getTransactionData().getQrCode();
            Long mpPaymentId = payment.getId();

            return new PixResponseDTO(mpPaymentId, base64, copiaECola);
            //tratagem de erros pra checar configurações
        } catch (MPApiException apiException) {
            System.err.println("ERRO API MERCADO PAGO: " + apiException.getApiResponse().getContent());
            throw new RuntimeException("Erro na API do Mercado Pago. Verifique os logs.");
        } catch (MPException e) {
            System.err.println("ERRO INTERNO NA SDK: " + e.getMessage());
            throw new RuntimeException("Não foi possível conectar com o Mercado Pago.");
        }
    }

    @Transactional
    public void processarNotificacao(Long idPagamentoMP) {
        try {
            //vai no Mercado Pago e pergunta o status real desse pagamento
            PaymentClient client = new PaymentClient();
            Payment payment = client.get(idPagamentoMP);

            //o status é pago / "approved"
            if ("approved".equals(payment.getStatus())) {

                //acha quem é o dono desse pagamento no NOSSO banco de dados
                Pedido pedido = pedidoRepository.findByPagamentoMercadoPagoId(idPagamentoMP)
                        .orElseThrow(() -> new RuntimeException("Pedido não encontrado para o Pagamento: " + idPagamentoMP));

                //se ainda estiver aguardando, atualiza o pedido pra pago
                if (pedido.getStatus() == EnumStatusPedido.AGUARDANDO_PAGAMENTO) {
                    pedido.setStatus(EnumStatusPedido.PAGO);
                    pedidoRepository.save(pedido);

                    System.out.println("PIX RECEBIDO! Pedido " + pedido.getLookupId() + " atualizado para PAGO.");
                }
            }

        } catch (MPApiException | MPException e) {
            System.err.println("Erro ao verificar pagamento no Mercado Pago: " + e.getMessage());
        }
    }


}