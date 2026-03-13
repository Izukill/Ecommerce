package org.example.mapper;

import org.example.model.Endereco;
import org.example.model.ItemPedido;
import org.example.model.Pedido;
import org.example.model.VariacaoProduto;
import org.example.rest.dto.ItemPedido.ItemPedidoResponseDTO;
import org.example.rest.dto.Pedido.PedidoCheckoutRequestDTO;
import org.example.rest.dto.Pedido.PedidoResponseDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PedidoMapper {

    public Pedido from(PedidoCheckoutRequestDTO dto){

       //conversao da lista do DTO de PedidoCheckout (para não passar ItemPedido direto e não possa se alterar o preçoUnitário presente nele)
        List<ItemPedido> itensEntidade = dto.getItens().stream()
                .map(itemDto -> {
                    ItemPedido item = new ItemPedido();
                    item.setQuantidade(itemDto.getQuantidade());

                    VariacaoProduto variacao = new VariacaoProduto();
                    variacao.setLookupId(itemDto.getVariacaoProdutoId());
                    item.setProduto(variacao);


                    //os preços continuam nulls pois eles não vem do dto, serão tratados no service de pedido
                    return item;
                })
                .toList();


        //precisa criar porque o DTO apenas passa o UUID de endereço ao inves do objeto, isso é tratado no service de pedido
        Endereco endereco= new Endereco();
        endereco.setLookupId(dto.getEnderecoEntregaId());



        return Pedido.builder()
                .itens(itensEntidade)
                .enderecoEntrega(endereco)
                .build();


    }


    public PedidoResponseDTO from(Pedido entity){

        PedidoResponseDTO dto= new PedidoResponseDTO();

        dto.setLookupId(entity.getLookupId());
        dto.setStatus(entity.getStatus());
        dto.setDataHora(entity.getDataHora());
        dto.setNomeCliente(entity.getCliente().getNome());
        dto.setCepEntrega(entity.getEnderecoEntrega().getCep());
        dto.setValorTotal(entity.getValorTotal());

        //Convertendo a lista de Entidades para a lista de DTOs
        if (entity.getItens() != null) {
            List<ItemPedidoResponseDTO> itensDto = entity.getItens().stream()
                    .map(itemEntidade -> {
                        ItemPedidoResponseDTO itemDto = new ItemPedidoResponseDTO();

                        itemDto.setLookupId(itemEntidade.getLookupId());
                        itemDto.setQuantidade(itemEntidade.getQuantidade());
                        itemDto.setPrecoUnitario(itemEntidade.getPrecoUnitario());

                        // "Achatando" os dados da Variação e do Produto para o DTO
                        if (itemEntidade.getProduto() != null) {
                            itemDto.setTamanho(itemEntidade.getProduto().getTamanho().name());
                            itemDto.setCor(itemEntidade.getProduto().getCor());

                            //navegando mais fundo para pegar o nome da roupa (ex: Top, Biquíni)
                            if (itemEntidade.getProduto().getProduto() != null) {
                                itemDto.setNomeProduto(itemEntidade.getProduto().getProduto().getNome());
                            }
                        }

                        return itemDto;
                    })
                    .toList(); //junta tudo na nova lista de DTOs

            dto.setItens(itensDto);
        }

        return dto;


    }




}
