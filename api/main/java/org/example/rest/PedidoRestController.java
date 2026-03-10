package org.example.rest;

import org.example.exception.MirlleException;
import org.example.mapper.PedidoMapper;
import org.example.rest.dto.PedidoBuscarDTO;
import org.example.rest.dto.PedidoCheckoutRequestDTO;
import org.example.rest.dto.PedidoResponseDTO;
import org.example.rest.dto.PedidoStatusUpdateRequestDTO;
import org.example.service.PedidoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/pedidos")
public class PedidoRestController implements PedidoRestControllerAPI{

    private PedidoService service;

    private PedidoMapper mapper;



    @Override
    public ResponseEntity<PedidoResponseDTO> processarCheckout(PedidoCheckoutRequestDTO dto) throws MirlleException {
        return null;
    }

    @Override
    public ResponseEntity<PedidoResponseDTO> recuperarPor(UUID lookupId) throws MirlleException {
        return null;
    }

    @Override
    public ResponseEntity<Page<PedidoResponseDTO>> listarMeusPedidos(Pageable pageable) throws MirlleException {
        return null;
    }

    @Override
    public ResponseEntity<Page<PedidoResponseDTO>> listarPedidosAdmin(PedidoBuscarDTO dto) throws MirlleException {
        return null;
    }



}
