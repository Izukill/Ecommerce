package org.example.service;

import org.example.exception.EntidadeNaoEncontradaException;
import org.example.exception.RegraNegocioException;
import org.example.model.Cliente;
import org.example.model.EnumPerfil;
import org.example.repository.ClienteRepository;
import org.example.rest.dto.Autenticacao.AlterarSenhaSalvarRequestDTO;
import org.example.rest.dto.Cliente.ClienteBuscarDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Cliente criar(Cliente cliente) throws RegraNegocioException {

        Optional<Cliente> clienteExistente= clienteRepository.findByEmail(cliente.getEmail());

        if (clienteExistente.isPresent()) {
            Cliente clienteRef= clienteExistente.get();
            if(clienteRef.getSenha() != null && !clienteRef.getSenha().isEmpty()){
                throw new RegraNegocioException("Essa conta já possui um login, Por favor use outro Email.");
            }

            clienteRef.setSenha(passwordEncoder.encode(cliente.getSenha()));
            clienteRef.setNome(cliente.getNome());
            clienteRef.setTipoPerfil(EnumPerfil.CLIENTE);
            clienteRef.setDataCadastro(LocalDate.now());
            return clienteRepository.save(clienteRef);
        }else {

            Cliente clienteNovo= new Cliente();
            clienteNovo.setSenha(passwordEncoder.encode(cliente.getSenha()));
            clienteNovo.setDataCadastro(LocalDate.now());
            clienteNovo.setTipoPerfil(EnumPerfil.CLIENTE);
            clienteNovo.setNome(cliente.getNome());
            clienteNovo.setEmail(cliente.getEmail());
            return clienteRepository.save(clienteNovo);
        }

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

        if(passwordEncoder.matches(dto.getSenhaNova(), cliente.getSenha())){
            throw new RegraNegocioException("A nova senha não pode ser igual à senha atual");
        }

        cliente.setSenha(passwordEncoder.encode(dto.getSenhaNova()));
        clienteRepository.save(cliente);
    }


    public Cliente buscarClienteLogado() throws RegraNegocioException {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();

        return clienteRepository.findByEmail(email)
                .orElseThrow(() -> new RegraNegocioException("Cliente não autorizado ou não encontrado."));
    }



}
