package org.example.security;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Base64;

@Converter
@Component
public class CpfEncryptConverter implements AttributeConverter<String, String> {

    private static final String ALGORITHM = "AES";

    private static byte[] KEY;

    @Value("${mirlle.security.cpf.key}")
    public void setKey(String secretKey) {
        KEY = secretKey.getBytes();
    }


    @Override
    public String convertToDatabaseColumn(String cpfAberto) {
        if (cpfAberto == null) return null;
        try {
            Key key = new SecretKeySpec(KEY, ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, key);

            byte[] cpfCriptografado = cipher.doFinal(cpfAberto.getBytes());
            return Base64.getEncoder().encodeToString(cpfCriptografado);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao criptografar o CPF", e);
        }
    }

    @Override
    public String convertToEntityAttribute(String cpfCriptografadoNoBanco) {
        if (cpfCriptografadoNoBanco == null) return null;
        try {
            Key key = new SecretKeySpec(KEY, ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, key);

            byte[] cpfDescriptografado = cipher.doFinal(Base64.getDecoder().decode(cpfCriptografadoNoBanco));
            return new String(cpfDescriptografado);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao descriptografar o CPF", e);
        }
    }


}
