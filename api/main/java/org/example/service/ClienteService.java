package org.example.service;

import org.example.exception.EntidadeNaoEncontradaException;
import org.example.exception.RegraNegocioException;
import org.example.model.Cliente;
import org.example.model.EnumPerfil;
import org.example.repository.ClienteRepository;
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
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Transactional
    public Cliente criar(Cliente cliente) throws RegraNegocioException {

        Optional<Cliente> clienteExistente = clienteRepository.findByEmail(cliente.getEmail());
        Cliente clienteSalvo; //variável para segurar o cliente após o save, para mandar o e-mail

        String codigo = String.format("%06d", new Random().nextInt(999999)); //gera o código de verificação
        LocalDateTime expiracao = LocalDateTime.now().plusMinutes(15);

        if (clienteExistente.isPresent()) {
            Cliente clienteRef = clienteExistente.get();
            if(clienteRef.getSenha() != null && !clienteRef.getSenha().isEmpty()){
                throw new RegraNegocioException("Essa conta já possui um login, Por favor use outro Email.");
            }

            //atualiza o cliente que já existia (ex: comprou sem conta antes)
            clienteRef.setSenha(passwordEncoder.encode(cliente.getSenha()));
            clienteRef.setNome(cliente.getNome());
            clienteRef.setTipoPerfil(EnumPerfil.CLIENTE);
            clienteRef.setDataCadastro(LocalDate.now());
            clienteRef.setAtivo(false);
            clienteRef.setCodigoVerificacao(codigo);
            clienteRef.setExpiracaoCodigo(expiracao);

            clienteSalvo = clienteRepository.save(clienteRef);

        } else {
            //cliente novo
            Cliente clienteNovo = new Cliente();
            clienteNovo.setSenha(passwordEncoder.encode(cliente.getSenha()));
            clienteNovo.setDataCadastro(LocalDate.now());
            clienteNovo.setTipoPerfil(EnumPerfil.CLIENTE);
            clienteNovo.setNome(cliente.getNome());
            clienteNovo.setEmail(cliente.getEmail());
            clienteNovo.setAtivo(false);
            clienteNovo.setCodigoVerificacao(codigo);
            clienteNovo.setExpiracaoCodigo(expiracao);

            clienteSalvo = clienteRepository.save(clienteNovo);
        }

        emailService.enviarEmailVerificacao(clienteSalvo.getEmail(), codigo);

        return clienteSalvo;
    }

    @Transactional
    public Cliente atualizar(UUID lookupId, Cliente novosDadosCliente) throws EntidadeNaoEncontradaException {

        if(!clienteRepository.findByLookupId(lookupId).isPresent()){
            throw new EntidadeNaoEncontradaException("Cliente não encontrado");
        }

        Cliente clienteAtualizar = recuperarPor(lookupId);

        clienteAtualizar.setNome(novosDadosCliente.getNome());
        clienteAtualizar.setTelefone(novosDadosCliente.getTelefone());
        clienteAtualizar.setCpf(novosDadosCliente.getCpf());

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
    public void solicitarRecuperacaoSenha(String email) throws EntidadeNaoEncontradaException {
        Cliente cliente = clienteRepository.findByEmail(email)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Cliente não encontrado com este e-mail."));


        String codigo = String.format("%06d", new Random().nextInt(999999));
        cliente.setCodigoVerificacao(codigo);
        cliente.setExpiracaoCodigo(LocalDateTime.now().plusMinutes(15));
        clienteRepository.save(cliente);


        emailService.enviarEmailRecuperacao(cliente.getEmail(), codigo);
    }

    @Transactional
    public void redefinirSenhaComCodigo(String email, String codigo, String novaSenha) throws RegraNegocioException, EntidadeNaoEncontradaException {
        Cliente cliente = clienteRepository.findByEmail(email)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Cliente não encontrado com este e-mail."));

        if (cliente.getCodigoVerificacao() == null || !cliente.getCodigoVerificacao().equals(codigo)) {
            throw new RegraNegocioException("Código de verificação inválido.");
        }

        if (LocalDateTime.now().isAfter(cliente.getExpiracaoCodigo())) {
            throw new RegraNegocioException("O código expirou. Solicite um novo.");
        }

        if(cliente.getSenha().equals(passwordEncoder.encode(novaSenha))){
            throw new RegraNegocioException("A Nova senha Não pode ser igual senha Antiga");
        }

        cliente.setSenha(passwordEncoder.encode(novaSenha));
        cliente.setCodigoVerificacao(null);
        cliente.setExpiracaoCodigo(null);
        clienteRepository.save(cliente);
    }


    public Cliente buscarClienteLogado() throws RegraNegocioException {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();

        return clienteRepository.findByEmail(email)
                .orElseThrow(() -> new RegraNegocioException("Cliente não autorizado ou não encontrado."));
    }

    @Transactional
    public void validarCodigo(String email, String codigo) throws RegraNegocioException, EntidadeNaoEncontradaException {
        Cliente cliente = clienteRepository.findByEmail(email)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Cliente não encontrado com este e-mail."));

        if (cliente.isAtivo()) {
            throw new RegraNegocioException("Esta conta já está ativada.");
        }

        if (!codigo.equals(cliente.getCodigoVerificacao())) {
            throw new RegraNegocioException("Código de verificação inválido.");
        }

        if (LocalDateTime.now().isAfter(cliente.getExpiracaoCodigo())) {
            throw new RegraNegocioException("O código expirou. Por favor, solicite um novo.");
        }


        cliente.setAtivo(true);
        cliente.setCodigoVerificacao(null);
        cliente.setExpiracaoCodigo(null);

        clienteRepository.save(cliente);
    }

    @Transactional
    public void reenviarCodigo(String email) throws RegraNegocioException, EntidadeNaoEncontradaException {
        Cliente cliente = clienteRepository.findByEmail(email)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Cliente não encontrado com este e-mail."));

        if (cliente.isAtivo()) {
            throw new RegraNegocioException("Esta conta já está ativada.");
        }

        //gera um novo código e renova o tempo de expiração
        String novoCodigo = String.format("%06d", new Random().nextInt(999999));
        cliente.setCodigoVerificacao(novoCodigo);
        cliente.setExpiracaoCodigo(LocalDateTime.now().plusMinutes(15));
        clienteRepository.save(cliente);

        emailService.enviarEmailVerificacao(cliente.getEmail(), novoCodigo);
    }



}
