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
    private EnderecoRepository enderecoRepository;

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

    @Autowired
    private CheckoutFreteService checkoutFreteService;


    @Transactional
    public CheckoutResponseDTO processarCheckout(PedidoCheckoutRequestDTO dto) throws RegraNegocioException {

        Cliente cliente = obterOuCriarCliente(dto);
        Endereco endereco = processarEnderecoEntrega(dto, cliente);

        BigDecimal freteCobrado = checkoutFreteService.obterConfiguracoes().getFrete();

        Pedido pedido = new Pedido();
        pedido.setItens(new ArrayList<>());
        pedido.setCliente(cliente);
        pedido.setEnderecoEntrega(endereco);
        pedido.setFreteFixo(freteCobrado);
        pedido.setStatus(EnumStatusPedido.AGUARDANDO_PAGAMENTO);
        pedido.setDataHora(LocalDateTime.now());
        pedido.setDataExpiracao(LocalDateTime.now().plusMinutes(30));

        BigDecimal valorTotalItens = processarItensBaixarEstoque(dto, pedido);
        pedido.setValorTotal(valorTotalItens.add(freteCobrado));

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

        return pedidoRepository.buscarComFiltros(
                dto.getClienteNome(),
                dto.getStatus(),
                dto.getPrecoMin(),
                dto.getDataInicial(),
                dto.getDataFinal(),
                pageable
        );

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




    //metodos auxiliares

    private Cliente obterClienteLogado() throws RegraNegocioException {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();


        return clienteRepository.findByEmail(email)
                .orElseThrow(() -> new RegraNegocioException("Cliente não autorizado ou não encontrado."));
    }


    private Cliente obterOuCriarCliente(PedidoCheckoutRequestDTO dto) {
        return clienteRepository.findByEmail(dto.getCliente().getEmail())
                .orElseGet(() -> {
                    Cliente novoCliente = new Cliente();
                    novoCliente.setNome(dto.getCliente().getNome());
                    novoCliente.setEmail(dto.getCliente().getEmail());
                    novoCliente.setCpf(dto.getCliente().getCpf());
                    novoCliente.setTelefone(dto.getCliente().getTelefone());
                    return clienteRepository.save(novoCliente);
                });
    }

    private Endereco processarEnderecoEntrega(PedidoCheckoutRequestDTO dto, Cliente cliente) throws RegraNegocioException {

        if (dto.getEnderecoEntrega().getLookupId() != null) {
            return enderecoRepository.findByLookupId(dto.getEnderecoEntrega().getLookupId())
                    .orElseThrow(() -> new RegraNegocioException("Endereço selecionado não encontrado."));
        }

        //se n tem id ve se já existe no banco
        Optional<Endereco> enderecoDuplicado = enderecoRepository.findByClienteAndCepAndNumero(
                cliente,
                dto.getEnderecoEntrega().getCep(),
                dto.getEnderecoEntrega().getNumero()
        );

        if (enderecoDuplicado.isPresent()) {
            return enderecoDuplicado.get();
        }

        //se for novo cria e salva
        Endereco novoEndereco = new Endereco();
        novoEndereco.setCep(dto.getEnderecoEntrega().getCep());
        novoEndereco.setRua(dto.getEnderecoEntrega().getRua());
        novoEndereco.setNumero(dto.getEnderecoEntrega().getNumero());
        novoEndereco.setComplemento(dto.getEnderecoEntrega().getComplemento());
        novoEndereco.setBairro(dto.getEnderecoEntrega().getBairro());
        novoEndereco.setCidade(dto.getEnderecoEntrega().getCidade());
        novoEndereco.setEstado(dto.getEnderecoEntrega().getEstado());
        novoEndereco.setCliente(cliente);

        return enderecoRepository.save(novoEndereco);
    }

    private BigDecimal processarItensBaixarEstoque(PedidoCheckoutRequestDTO dto, Pedido pedido) throws RegraNegocioException {
        BigDecimal valorTotalCarrinho = BigDecimal.ZERO;

        for (ItemPedidoSalvarRequestDTO itemDto : dto.getItens()) {
            VariacaoProduto variacaoProduto = variacaoProdutoRepository.findByLookupId(itemDto.getVariacaoProdutoId())
                    .orElseThrow(() -> new RegraNegocioException("Variação de produto não encontrada."));

            if (variacaoProduto.getQuantidadeEstoque() < itemDto.getQuantidade()) {
                throw new RegraNegocioException("Estoque insuficiente para o produto: " + variacaoProduto.getProduto().getNome());
            }

            //subtrai do estoque
            variacaoProduto.setQuantidadeEstoque(variacaoProduto.getQuantidadeEstoque() - itemDto.getQuantidade());

            ItemPedido novoItem = new ItemPedido();
            novoItem.setProduto(variacaoProduto);
            novoItem.setQuantidade(itemDto.getQuantidade());

            Produto produtoCatalogo = variacaoProduto.getProduto();
            BigDecimal precoReal = produtoCatalogo.getPreco();

            if (produtoCatalogo.getPrecoPromocional() != null) {
                precoReal = produtoCatalogo.getPrecoPromocional();
            }

            novoItem.setPrecoUnitario(precoReal);

            //calculo do valor
            BigDecimal subtotalItem = precoReal.multiply(BigDecimal.valueOf(novoItem.getQuantidade()));
            valorTotalCarrinho = valorTotalCarrinho.add(subtotalItem);

            novoItem.setPedido(pedido);
            pedido.getItens().add(novoItem);
        }

        return valorTotalCarrinho;
    }



}
