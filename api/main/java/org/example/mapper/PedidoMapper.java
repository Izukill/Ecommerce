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
        dto.setCliente(entity.getCliente());
        dto.setFreteFixo(entity.getFreteFixo());
        dto.setEnderecoEntrega(entity.getEnderecoEntrega());
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
                            itemDto.setImagemUrl(itemEntidade.getProduto().getImagemUrl());

                            //navegando mais fundo para pegar o nome da roupa (ex: Top, Biquíni) e a imagem
                            if (itemEntidade.getProduto().getProduto() != null) {
                                itemDto.setNomeProduto(itemEntidade.getProduto().getProduto().getNome());
                                itemDto.setImagemCapa(itemEntidade.getProduto().getProduto().getImagemUrl());
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
