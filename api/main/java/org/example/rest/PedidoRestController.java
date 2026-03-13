package org.example.rest;

import org.example.exception.MirlleException;
import org.example.mapper.PedidoMapper;
import org.example.model.Pedido;
import org.example.rest.dto.Pedido.PedidoBuscarDTO;
import org.example.rest.dto.Pedido.PedidoCheckoutRequestDTO;
import org.example.rest.dto.Pedido.PedidoResponseDTO;
import org.example.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/pedidos")
public class PedidoRestController implements PedidoRestControllerAPI{

    @Autowired
    private PedidoService service;

    @Autowired
    private PedidoMapper mapper;



    @Override
    @PostMapping
    public ResponseEntity<PedidoResponseDTO> processarCheckout(@RequestBody PedidoCheckoutRequestDTO dto) throws MirlleException {
        Pedido pedido = mapper.from(dto);
        Pedido pedidoCheckout = service.processarCheckout(pedido);

        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.from(pedidoCheckout));
    }

    @Override
    @GetMapping("/{lookupId}")
    public ResponseEntity<PedidoResponseDTO> recuperarPor(@PathVariable UUID lookupId) throws MirlleException {
        Pedido pedido = service.recuperarPor(lookupId);
        return ResponseEntity.ok(mapper.from(pedido));
    }

    @Override
    @GetMapping("/meus-pedidos")
    public ResponseEntity<Page<PedidoResponseDTO>> listarMeusPedidos(PedidoBuscarDTO dto,Pageable pageable) throws MirlleException {
        Page<Pedido> pagina = service.listarMeusPedidos(dto,pageable);
        return ResponseEntity.ok(pagina.map(mapper::from));
    }

    @Override
    @GetMapping
    public ResponseEntity<Page<PedidoResponseDTO>> listarPedidosAdmin(PedidoBuscarDTO dto, Pageable pageable) throws MirlleException {
        Page<Pedido> pagina = service.listarPedidosAdmin(dto,pageable);
        return ResponseEntity.ok(pagina.map(mapper::from));
    }



}
