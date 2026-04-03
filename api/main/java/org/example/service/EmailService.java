package org.example.service;

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
    public void enviarEmailVerificacao(String destinatario, String codigo){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinatario);
        message.setSubject("Verifique sua conta - MirlleFitness");
        message.setText("Olá! Seu código de verificação é: " + codigo +
                "\n\nEste código expira em 15 minutos.");

        javaMailSender.send(message);

    }
}
