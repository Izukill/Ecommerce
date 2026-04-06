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

            String cpfLimpo = cliente.getCpf().replaceAll("[^0-9]", "");

            IdentificationRequest identification = IdentificationRequest.builder()
                    .type("CPF")
                    .number(cpfLimpo)
                    .build();

            PaymentPayerRequest payer = PaymentPayerRequest.builder()
                    .email(cliente.getEmail())
                    .firstName(cliente.getNome())
                    .identification(identification)
                    .build();

            PaymentCreateRequest request = PaymentCreateRequest.builder()
                    .transactionAmount(valorTotal)
                    .paymentMethodId("pix")
                    .payer(payer)
                    .build();

            // AQUI ESTÁ O SEGREDO: A chave de idempotência gerada com UUID
            MPRequestOptions customOptions = MPRequestOptions.builder()
                    .accessToken(accessToken)
                    .customHeaders(java.util.Map.of("x-idempotency-key", java.util.UUID.randomUUID().toString()))
                    .build();

            Payment payment = client.create(request, customOptions);

            String base64 = payment.getPointOfInteraction().getTransactionData().getQrCodeBase64();
            String copiaECola = payment.getPointOfInteraction().getTransactionData().getQrCode();
            Long mpPaymentId = payment.getId();

            return new PixResponseDTO(mpPaymentId, base64, copiaECola);

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

        } catch (MPApiException apiException) {
            System.err.println("ERRO API MERCADO PAGO (Webhook): " + apiException.getApiResponse().getContent());
        } catch (MPException e) {
            System.err.println("ERRO INTERNO NA SDK (Webhook): " + e.getMessage());
        }
    }

    public PixResponseDTO buscarPixExistente(Long idPagamentoMP) {
        try {
            PaymentClient client = new PaymentClient();
            Payment payment = client.get(idPagamentoMP);

            String base64 = payment.getPointOfInteraction().getTransactionData().getQrCodeBase64();
            String copiaECola = payment.getPointOfInteraction().getTransactionData().getQrCode();

            return new PixResponseDTO(idPagamentoMP, base64, copiaECola);

        } catch (MPApiException apiException) {
            System.err.println("ERRO API MP AO BUSCAR: " + apiException.getApiResponse().getContent());
            throw new RuntimeException("Erro ao buscar o QR Code no Mercado Pago.");
        } catch (MPException e) {
            System.err.println("ERRO SDK AO BUSCAR: " + e.getMessage());
            throw new RuntimeException("Erro interno de conexão.");
        }
    }


}