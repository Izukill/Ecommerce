package org.example.service;

import org.example.model.Pedido;
import org.example.rest.dto.Pix.PixResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Async
    private void enviarEmail(String destinatario, String assunto, String texto) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinatario);
        message.setSubject(assunto);
        message.setText(texto);

        javaMailSender.send(message);
    }


    public void enviarEmailVerificacao(String destinatario, String codigo) {
        String assunto = "Bem-vindo(a)! Verifique sua conta - MirlleFitness";
        String texto = "Olá!\n\n" +
                "Ficamos muito felizes em ter você na MirlleFitness!\n\n" +
                "Para ativar sua conta e começar a comprar, use o código abaixo:\n\n" +
                "CÓDIGO: " + codigo + "\n\n" +
                "Este código expira em 15 minutos.\n" +
                "Abraços, Equipe MirlleFitness.";

        enviarEmail(destinatario, assunto, texto);
    }

    public void enviarEmailRecuperacao(String destinatario, String codigo) {
        String assunto = "Recuperação de Senha - MirlleFitness";
        String texto = "Olá,\n\n" +
                "Recebemos uma solicitação para redefinir a senha da sua conta.\n\n" +
                "Seu código de segurança é:\n\n" +
                "CÓDIGO: " + codigo + "\n\n" +
                "Este código expira em 15 minutos. Se você não solicitou essa alteração, por favor, ignore este e-mail.\n\n" +
                "Equipe MirlleFitness.";

        enviarEmail(destinatario, assunto, texto);
    }

    @Async
    public void enviarEmailNovoPedido(Pedido pedido, PixResponseDTO pix) {
        String destinatario = pedido.getCliente().getEmail();
        String nome = pedido.getCliente().getNome().split(" ")[0];
        String idPedido = pedido.getLookupId().toString().substring(0, 8).toUpperCase();
        String valorFomatado = String.format("R$ %.2f", pedido.getValorTotal());

        String assunto = "Pedido Recebido! #" + idPedido + " - MirlleFitness";
        String texto = "Olá, " + nome + "!\n\n" +
                "Seu pedido #" + idPedido + " foi gerado com sucesso no valor de " + valorFomatado + ".\n\n" +
                "Ele está AGUARDANDO PAGAMENTO. Para garantir suas peças, realize o pagamento do Pix em até 30 minutos.\n\n" +
                "Você pode copiar o código Pix abaixo no aplicativo do seu banco:\n\n" +
                pix.getQrCodeCopiaECola() + "\n\n" +
                "Assim que o pagamento for confirmado, te avisaremos por aqui!\n\n" +
                "Com carinho,\nEquipe MirlleFitness.";

        enviarEmail(destinatario, assunto, texto);
    }

    @Async
    public void enviarEmailAtualizacaoStatus(Pedido pedido) {
        String destinatario = pedido.getCliente().getEmail();
        String nome = pedido.getCliente().getNome().split(" ")[0];
        String idPedido = pedido.getLookupId().toString().substring(0, 8).toUpperCase();

        String assunto = "";
        String texto = "";

        switch (pedido.getStatus()) {

            case PAGO:
                assunto = "Pagamento Aprovado! - Pedido #" + idPedido;
                texto = "Oba, " + nome + "!\n\n" +
                        "O pagamento do seu pedido #" + idPedido + " acabou de ser confirmado!\n" +
                        "Nossa equipe já está separando tudo com muito carinho para você.\n\n" +
                        "Te avisaremos assim que o pacote for enviado.\n\n" +
                        "Equipe MirlleFitness.";
                break;

            case ENVIADO:
                assunto = "Pedido Enviado! 🚚 - Pedido #" + idPedido;
                texto = "Ótimas notícias, " + nome + "!\n\n" +
                        "Seu pedido #" + idPedido + " já está a caminho.\n" +
                        "Fique de olho na entrega! Agradecemos por escolher a MirlleFitness para arrasar nos seus looks.\n\n" +
                        "Com carinho,\nEquipe MirlleFitness.";
                break;

            default:
                return;
        }

        enviarEmail(destinatario, assunto, texto);
    }
}
