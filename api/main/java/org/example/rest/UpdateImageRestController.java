package org.example.rest;

import org.example.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/upload")
public class UpdateImageRestController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping("/imagem")
    public ResponseEntity<String> uploadImagem(@RequestParam("file") MultipartFile file) {
        try {
            //chama o service que faz a imagem ir para o cloudinary
            String url = cloudinaryService.uploadImagem(file);
            return ResponseEntity.ok(url);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Erro ao fazer upload da imagem");
        }
    }


}
