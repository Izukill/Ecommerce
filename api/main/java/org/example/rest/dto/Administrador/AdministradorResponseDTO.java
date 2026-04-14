package org.example.rest.dto.Administrador;

import lombok.Data;
import org.example.model.EnumCargo;

import java.util.UUID;

@Data
public class AdministradorResponseDTO {

    private UUID lookupId;

    private String nome;

    private String email;

    private EnumCargo cargo;

    private boolean permissaoTotal;

    private boolean pedidosPage;

    private boolean produtosPage;

    private boolean categoriasPage;

    private boolean clientePage;

    private boolean relatoriosPage;
}
