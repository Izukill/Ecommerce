package org.example.rest;

import jakarta.validation.Valid;
import org.example.exception.MirlleException;
import org.example.exception.RegraNegocioException;
import org.example.mapper.PedidoMapper;
import org.example.model.Pedido;
import org.example.payment.PixService;
import org.example.rest.dto.Pedido.*;
import org.example.rest.dto.Pix.PixResponseDTO;
import org.example.rest.dto.Pix.WebhookMercadoPagoDTO;
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
    public ResponseEntity<CheckoutResponseDTO> processarCheckout(@RequestBody PedidoCheckoutRequestDTO dto) throws MirlleException {
        CheckoutResponseDTO pacotePronto = service.processarCheckout(dto);

        //devolve o pix + pedido para o front mandar as requisicões corretas
        return ResponseEntity.status(HttpStatus.CREATED).body(pacotePronto);
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

    @Override
    @PutMapping("/{lookupId}/status")
    public ResponseEntity<Void> atualizarStatus(@PathVariable("lookupId") UUID lookupId, @RequestBody @Valid PedidoStatusUpdateRequestDTO dto) throws RegraNegocioException {
        service.atualizarStatus(lookupId, dto);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{lookupId}/pix")
    public ResponseEntity<PixResponseDTO> recuperarPix(@PathVariable("lookupId") UUID lookupId) throws RegraNegocioException {
        PixResponseDTO pix = service.recuperarPixDoPedido(lookupId);
        return ResponseEntity.ok(pix);
    }






}
