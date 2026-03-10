package org.example.service;

import org.example.exception.EntidadeNaoEncontradaException;
import org.example.exception.RegraNegocioException;
import org.example.model.Cliente;
import org.example.model.EnumPerfil;
import org.example.repository.ClienteRepository;
import org.example.repository.PessoaRepository;
import org.example.rest.dto.AlterarSenhaSalvarRequestDTO;
import org.example.rest.dto.ClienteBuscarDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Cliente criar(Cliente cliente) throws RegraNegocioException {

        if (clienteRepository.findByEmail(cliente.getEmail()).isPresent()) {
            throw new RegraNegocioException("Este email já está em uso por uma conta");
        }

        cliente.setSenha(passwordEncoder.encode(cliente.getSenha()));

        cliente.setTipoPerfil(EnumPerfil.CLIENTE);

        return cliente;

    }

    @Transactional
    public Cliente atualizar(UUID lookupId, Cliente novosDadosCliente) throws EntidadeNaoEncontradaException {

        if(!clienteRepository.findByLookupId(lookupId).isPresent()){
            throw new EntidadeNaoEncontradaException("Cliente não encontrado");
        }

        Cliente clienteAtualizar = recuperarPor(lookupId);

        clienteAtualizar.setNome(novosDadosCliente.getNome());
        clienteAtualizar.setTelefone(novosDadosCliente.getTelefone());

        return clienteRepository.save(clienteAtualizar);

    }

    @Transactional
    public Cliente recuperarPor(UUID lookupId) throws EntidadeNaoEncontradaException {
        return clienteRepository.findByLookupId(lookupId).orElseThrow(() -> new EntidadeNaoEncontradaException("Entidade não encontrada"));
    }

    @Transactional
    public void remover(UUID lookupId) throws EntidadeNaoEncontradaException {

        Cliente clienteRemover= recuperarPor(lookupId);

        clienteRepository.delete(clienteRemover);

    }

    @Transactional
    public List<Cliente> listar(){

        return clienteRepository.findAll();
    }


    public Page<Cliente> buscar(ClienteBuscarDTO dto){

        Pageable paginacao = PageRequest.of(0, 10);
        return clienteRepository.findAll(paginacao);
    }

    @Transactional
    public void alterarSenha(UUID lookupId, AlterarSenhaSalvarRequestDTO dto) throws EntidadeNaoEncontradaException, RegraNegocioException {

        Cliente cliente = recuperarPor(lookupId);

        if(!passwordEncoder.matches(dto.getSenhaVelha(), cliente.getSenha())){
            throw new RegraNegocioException("A senha atual informada está incorreta");
        }

        if(passwordEncoder.matches(dto.getSenhaVelha(), cliente.getSenha())){
            throw new RegraNegocioException("A senha velha não pode ser igual a nova senha");
        }

        cliente.setSenha(passwordEncoder.encode(dto.getSenhaNova()));
        clienteRepository.save(cliente);
    }



}
