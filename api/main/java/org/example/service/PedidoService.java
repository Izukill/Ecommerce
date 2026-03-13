package org.example.service;


import org.example.exception.RegraNegocioException;
import org.example.model.*;
import org.example.repository.ClienteRepository;
import org.example.repository.PedidoRepository;
import org.example.repository.VariacaoProdutoRepository;
import org.example.rest.dto.Pedido.PedidoBuscarDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
    public Pedido processarCheckout(Pedido pedido) throws RegraNegocioException {

        Cliente clienteLogado = obterClienteLogado();
        pedido.setCliente(clienteLogado);

        pedido.setStatus(EnumStatusPedido.EM_PROCESSO);
        pedido.setDataHora(LocalDateTime.now());
        BigDecimal valorTotalCarrinho = BigDecimal.ZERO;


        for (ItemPedido i: pedido.getItens()){


            //checa se o produto existe e se tem quantidade no estoque
            VariacaoProduto variacaoProduto = variacaoProdutoRepository.findByLookupId(i.getProduto().getLookupId())
                    .orElseThrow(() -> new RegraNegocioException("Produto não encontrado no catálogo da loja"));

            if (variacaoProduto.getQuantidadeEstoque() < i.getQuantidade()) {
                throw new RegraNegocioException("Estoque insuficiente para o produto: " + variacaoProduto.getProduto().getNome());
            }

            //tira do estoque
            variacaoProduto.setQuantidadeEstoque(variacaoProduto.getQuantidadeEstoque() - i.getQuantidade());


            //pega o preço real (salvo no banco) e seta no item
            BigDecimal precoReal = variacaoProduto.getProduto().getPreco();
            i.setPrecoUnitario(precoReal);


            BigDecimal subtotalItem = precoReal.multiply(BigDecimal.valueOf(i.getQuantidade()));

            //adiciona o valor ao carrinho no total
            valorTotalCarrinho = valorTotalCarrinho.add(subtotalItem);

            //faz a relação (o item precisa saber a qual pedido ele se refere no caso)
            i.setPedido(pedido);
            i.setProduto(variacaoProduto);

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
