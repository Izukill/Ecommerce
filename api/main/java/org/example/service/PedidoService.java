package org.example.service;


import org.example.exception.RegraNegocioException;
import org.example.model.*;
import org.example.repository.ClienteRepository;
import org.example.repository.PedidoRepository;
import org.example.repository.VariacaoProdutoRepository;
import org.example.rest.dto.ItemPedido.ItemPedidoSalvarRequestDTO;
import org.example.rest.dto.Pedido.PedidoBuscarDTO;
import org.example.rest.dto.Pedido.PedidoCheckoutRequestDTO;
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
import java.util.UUID;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private VariacaoProdutoRepository variacaoProdutoRepository;


    @Transactional
    public Pedido processarCheckout(PedidoCheckoutRequestDTO dto) throws RegraNegocioException {

        // =========================================================
        // 1. BUSCA OU CRIA O CLIENTE (O "Cliente Fantasma")
        // =========================================================
        Cliente cliente = clienteRepository.findByEmail(dto.getCliente().getEmail())
                .orElseGet(() -> {
                    // Se não achou, cria um novo cliente silenciosamente!
                    Cliente novoCliente = new Cliente();
                    novoCliente.setNome(dto.getCliente().getNome());
                    novoCliente.setEmail(dto.getCliente().getEmail());
                    novoCliente.setCpf(dto.getCliente().getCpf());
                    novoCliente.setTelefone(dto.getCliente().getTelefone());

                    // Salva e retorna o novo cliente para usarmos no pedido
                    return clienteRepository.save(novoCliente);
                });


        // =========================================================
        // 2. MONTA O PEDIDO E O ENDEREÇO
        // =========================================================
        Pedido pedido = new Pedido();
        pedido.setItens(new ArrayList<>());
        pedido.setCliente(cliente);
        pedido.setStatus(EnumStatusPedido.EM_PROCESSO);
        pedido.setDataHora(LocalDateTime.now());

        // Criando a entidade de endereço com os dados do Front-end
        Endereco endereco = new Endereco();
        endereco.setCep(dto.getEnderecoEntrega().getCep());
        endereco.setLogradouro(dto.getEnderecoEntrega().getLogradouro());
        endereco.setNumero(dto.getEnderecoEntrega().getNumero());
        endereco.setComplemento(dto.getEnderecoEntrega().getComplemento());
        endereco.setBairro(dto.getEnderecoEntrega().getBairro());
        endereco.setCidade(dto.getEnderecoEntrega().getCidade());
        endereco.setEstado(dto.getEnderecoEntrega().getEstado());

        // Associa o endereço ao cliente e ao pedido
        endereco.setCliente(cliente);
        pedido.setEnderecoEntrega(endereco);


        // =========================================================
        // 3. PROCESSA ITENS E ABATE O ESTOQUE
        // =========================================================
        BigDecimal valorTotalCarrinho = BigDecimal.ZERO;

        for (ItemPedidoSalvarRequestDTO itemDto : dto.getItens()) {

            // Checa se a variação existe
            VariacaoProduto variacaoProduto = variacaoProdutoRepository.findByLookupId(itemDto.getVariacaoProdutoId())
                    .orElseThrow(() -> new RegraNegocioException("Variação de produto não encontrada."));

            // Checa o estoque
            if (variacaoProduto.getQuantidadeEstoque() < itemDto.getQuantidade()) {
                throw new RegraNegocioException("Estoque insuficiente para o produto: " + variacaoProduto.getProduto().getNome());
            }

            //tira do estoque
            variacaoProduto.setQuantidadeEstoque(variacaoProduto.getQuantidadeEstoque() - itemDto.getQuantidade());

            //cria o item do pedido
            ItemPedido novoItem = new ItemPedido();
            novoItem.setProduto(variacaoProduto);
            novoItem.setQuantidade(itemDto.getQuantidade());

            //pega o preço real do banco por segurança (ignora o preço do front)
            BigDecimal precoReal = variacaoProduto.getProduto().getPreco();
            novoItem.setPrecoUnitario(precoReal);

            BigDecimal subtotalItem = precoReal.multiply(BigDecimal.valueOf(novoItem.getQuantidade()));
            valorTotalCarrinho = valorTotalCarrinho.add(subtotalItem);

            //faz a relação bidirecional
            novoItem.setPedido(pedido);
            pedido.getItens().add(novoItem);
        }

        pedido.setValorTotal(valorTotalCarrinho);


        return pedidoRepository.save(pedido);
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




    //metodo auxiliar
    private Cliente obterClienteLogado() throws RegraNegocioException {
        ///pega o email do usuario que passou pelo filtro
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();

        //e busca o cliente completo no banco
        return clienteRepository.findByEmail(email)
                .orElseThrow(() -> new RegraNegocioException("Cliente não autorizado ou não encontrado."));
    }



}
