package org.example.service;


import org.example.exception.RegraNegocioException;
import org.example.mapper.PedidoMapper;
import org.example.model.*;
import org.example.payment.PixService;
import org.example.repository.ClienteRepository;
import org.example.repository.EnderecoRepository;
import org.example.repository.PedidoRepository;
import org.example.repository.VariacaoProdutoRepository;
import org.example.rest.dto.ItemPedido.ItemPedidoSalvarRequestDTO;
import org.example.rest.dto.Pedido.*;
import org.example.rest.dto.Pix.PixResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private VariacaoProdutoRepository variacaoProdutoRepository;

    @Autowired
    private PixService pixService;

    @Autowired
    private PedidoMapper pedidoMapper;

    @Autowired
    private EmailService emailService;


    @Transactional
    public CheckoutResponseDTO processarCheckout(PedidoCheckoutRequestDTO dto) throws RegraNegocioException {

        //busca ou cria o cliente
        Cliente cliente = clienteRepository.findByEmail(dto.getCliente().getEmail())
                .orElseGet(() -> {
                    Cliente novoCliente = new Cliente();
                    novoCliente.setNome(dto.getCliente().getNome());
                    novoCliente.setEmail(dto.getCliente().getEmail());
                    novoCliente.setCpf(dto.getCliente().getCpf());
                    novoCliente.setTelefone(dto.getCliente().getTelefone());
                    return clienteRepository.save(novoCliente);
                });

        //monta o pedido
        Pedido pedido = new Pedido();
        pedido.setItens(new ArrayList<>());
        pedido.setCliente(cliente);

        //seta status do pedido, endereço e a data limite de pagamento
        pedido.setStatus(EnumStatusPedido.AGUARDANDO_PAGAMENTO);
        pedido.setDataHora(LocalDateTime.now());
        pedido.setDataExpiracao(LocalDateTime.now().plusMinutes(30));


        Endereco endereco = new Endereco();
        endereco.setCep(dto.getEnderecoEntrega().getCep());
        endereco.setRua(dto.getEnderecoEntrega().getRua());
        endereco.setNumero(dto.getEnderecoEntrega().getNumero());
        endereco.setComplemento(dto.getEnderecoEntrega().getComplemento());
        endereco.setBairro(dto.getEnderecoEntrega().getBairro());
        endereco.setCidade(dto.getEnderecoEntrega().getCidade());
        endereco.setEstado(dto.getEnderecoEntrega().getEstado());

        endereco.setCliente(cliente);
        pedido.setEnderecoEntrega(endereco);

        //processa os itens e abaixo no estoque
        BigDecimal valorTotalCarrinho = BigDecimal.ZERO;

        for (ItemPedidoSalvarRequestDTO itemDto : dto.getItens()) {
            VariacaoProduto variacaoProduto = variacaoProdutoRepository.findByLookupId(itemDto.getVariacaoProdutoId())
                    .orElseThrow(() -> new RegraNegocioException("Variação de produto não encontrada."));

            if (variacaoProduto.getQuantidadeEstoque() < itemDto.getQuantidade()) {
                throw new RegraNegocioException("Estoque insuficiente para o produto: " + variacaoProduto.getProduto().getNome());
            }

            variacaoProduto.setQuantidadeEstoque(variacaoProduto.getQuantidadeEstoque() - itemDto.getQuantidade());

            ItemPedido novoItem = new ItemPedido();
            novoItem.setProduto(variacaoProduto);
            novoItem.setQuantidade(itemDto.getQuantidade());

            BigDecimal precoReal = variacaoProduto.getProduto().getPreco();
            novoItem.setPrecoUnitario(precoReal);

            BigDecimal subtotalItem = precoReal.multiply(BigDecimal.valueOf(novoItem.getQuantidade()));
            valorTotalCarrinho = valorTotalCarrinho.add(subtotalItem);

            novoItem.setPedido(pedido);
            pedido.getItens().add(novoItem);
        }

        pedido.setValorTotal(valorTotalCarrinho);

        //gera o pix e salva o id no pedido para o mercado pago
        PixResponseDTO pixResponse = pixService.gerarPix(pedido.getValorTotal(), pedido.getCliente());
        pedido.setPagamentoMercadoPagoId(pixResponse.getIdPagamentoMercadoPago());


        Pedido pedidoSalvo = pedidoRepository.save(pedido);
        emailService.enviarEmailNovoPedido(pedidoSalvo, pixResponse);
        PedidoResponseDTO pedidoDTO = pedidoMapper.from(pedidoSalvo);


        return new CheckoutResponseDTO(pedidoDTO, pixResponse);
    }



    @Transactional
    public Pedido recuperarPor(UUID lookupId) throws RegraNegocioException {
        return pedidoRepository.findByLookupId(lookupId)
                .orElseThrow(() -> new RegraNegocioException("Pedido não encontrado."));
    }


    //listar para usuario
    public Page<Pedido> listarMeusPedidos(PedidoBuscarDTO dto, Pageable pageable) throws RegraNegocioException {

        Cliente clienteLogado = obterClienteLogado();


        if (dto.getStatus() != null) {

            return pedidoRepository.findByStatus(dto.getStatus(), pageable);
        }

        if(dto.getDataInicial() != null && dto.getDataFinal() != null){
            return pedidoRepository.findByDataHoraBetween(dto.getDataInicial(), dto.getDataFinal(), pageable);
        }

        return pedidoRepository.findByCliente(clienteLogado, pageable);

    }


    //listar para admin
    public Page<Pedido> listarPedidosAdmin(PedidoBuscarDTO dto, Pageable pageable){

        if (dto.getStatus() != null) {

            return pedidoRepository.findByStatus(dto.getStatus(), pageable);
        }

        if(dto.getDataInicial() != null && dto.getDataFinal() != null){
            return pedidoRepository.findByDataHoraBetween(dto.getDataInicial(), dto.getDataFinal(), pageable);
        }

        return pedidoRepository.findAll(pageable);

    }

    @Transactional
    public void atualizarStatus(UUID lookupId, PedidoStatusUpdateRequestDTO dto) throws RegraNegocioException {

        //trava pro cliente não conseguir alterar o status para pago
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        EnumStatusPedido novoStatus = dto.getStatus();

        if (!isAdmin) {
            //o cliente só tem permissão para transitar entre cancelado e aguardando pagamento
            if (novoStatus != EnumStatusPedido.CANCELADO && novoStatus != EnumStatusPedido.AGUARDANDO_PAGAMENTO) {
                throw new RegraNegocioException("Você não tem permissão para alterar o pedido para este status.");
            }
        }


        Pedido pedido = recuperarPor(lookupId);
        EnumStatusPedido statusAntigo = pedido.getStatus();

        if (statusAntigo == novoStatus) {
            return;
        }

        //reabertura cancelado -> aguardando pagamento
        if (statusAntigo == EnumStatusPedido.CANCELADO && novoStatus != EnumStatusPedido.CANCELADO) {

            for (ItemPedido item : pedido.getItens()) {
                VariacaoProduto produto = item.getProduto();

                if (produto.getQuantidadeEstoque() < item.getQuantidade()) {
                    throw new RegraNegocioException("Estoque insuficiente para reabrir o pedido. O produto ID "
                            + produto.getLookupId() + " não possui " + item.getQuantidade() + " unidades.");
                }

                //tira do estoque denovo e salva
                produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - item.getQuantidade());
                variacaoProdutoRepository.save(produto);
            }
        }

        //pedido cancelado Aguardando pagamento -> cancelado
        else if (statusAntigo != EnumStatusPedido.CANCELADO && novoStatus == EnumStatusPedido.CANCELADO) {

            for (ItemPedido item : pedido.getItens()) {
                VariacaoProduto produto = item.getProduto();

                //devolve pro estoque
                produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + item.getQuantidade());
                variacaoProdutoRepository.save(produto);
            }
        }

        if (novoStatus == EnumStatusPedido.AGUARDANDO_PAGAMENTO) {
            pedido.setDataExpiracao(LocalDateTime.now().plusMinutes(30));
        }

        pedido.setStatus(novoStatus);
        pedidoRepository.save(pedido);
        emailService.enviarEmailAtualizacaoStatus(pedido);
    }

    @Transactional
    public PixResponseDTO recuperarPixDoPedido(UUID lookupId) throws RegraNegocioException {
        Pedido pedido = recuperarPor(lookupId);

        if (pedido.getStatus() != EnumStatusPedido.AGUARDANDO_PAGAMENTO) {
            throw new RegraNegocioException("Este pedido não está mais aguardando pagamento.");
        }

        if (pedido.getPagamentoMercadoPagoId() == null) {
            throw new RegraNegocioException("Nenhum Pix foi gerado para este pedido.");
        }


        return pixService.buscarPixExistente(pedido.getPagamentoMercadoPagoId());
    }




    //metodo auxiliar
    private Cliente obterClienteLogado() throws RegraNegocioException {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();


        return clienteRepository.findByEmail(email)
                .orElseThrow(() -> new RegraNegocioException("Cliente não autorizado ou não encontrado."));
    }



}
