package org.example.service;

import org.example.exception.RegraNegocioException;
import org.example.model.Cliente;
import org.example.model.Endereco;
import org.example.repository.ClienteRepository;
import org.example.repository.EnderecoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class EnderecoService {

    @Autowired
    private EnderecoRepository enderecoRepository;

    @Autowired
    private ClienteRepository clienteRepository;


    @Transactional
    public Endereco criar(Endereco endereco) throws RegraNegocioException {
        Cliente clienteLogado = obterClienteLogado();

        endereco.setCliente(clienteLogado);

        return enderecoRepository.save(endereco);
    }

    public Endereco recuperarPor(UUID lookupId) throws RegraNegocioException {
        Endereco endereco = enderecoRepository.findByLookupId(lookupId)
                .orElseThrow(() -> new RegraNegocioException("Endereço não encontrado."));

        Cliente clienteLogado = obterClienteLogado();

        if (!endereco.getCliente().getId().equals(clienteLogado.getId())) {
            throw new RegraNegocioException("Acesso negado, este endereço não pertence à sua conta.");
        }

        return endereco;
    }


    @Transactional
    public Endereco atualizar(UUID lookupId, Endereco dadosAtualizados) throws RegraNegocioException {


        Endereco enderecoExistente = recuperarPor(lookupId);


        enderecoExistente.setCep(dadosAtualizados.getCep());
        enderecoExistente.setPagarNaEntrega(dadosAtualizados.isPagarNaEntrega());
        enderecoExistente.setRua(dadosAtualizados.getRua());
        enderecoExistente.setNumero(dadosAtualizados.getNumero());
        enderecoExistente.setComplemento(dadosAtualizados.getComplemento());
        enderecoExistente.setBairro(dadosAtualizados.getBairro());


        return enderecoRepository.save(enderecoExistente);
    }


    @Transactional
    public void remover(UUID lookupId) throws RegraNegocioException {
        Endereco endereco = recuperarPor(lookupId);
        enderecoRepository.delete(endereco);
    }


    public List<Endereco> listar() throws RegraNegocioException {
        Cliente clienteLogado = obterClienteLogado();


        return clienteLogado.getEnderecos();
    }


    public Page<Endereco> buscar(Pageable pageable) {
        return enderecoRepository.findAll(pageable);
    }




    private Cliente obterClienteLogado() throws RegraNegocioException {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();

        return clienteRepository.findByEmail(email)
                .orElseThrow(() -> new RegraNegocioException("Cliente não autorizado ou não encontrado."));
    }
}