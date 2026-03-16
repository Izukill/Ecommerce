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
