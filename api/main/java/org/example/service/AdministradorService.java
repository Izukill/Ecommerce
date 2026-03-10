package org.example.service;

import org.example.exception.EntidadeNaoEncontradaException;
import org.example.exception.RegraNegocioException;
import org.example.model.Administrador;
import org.example.model.EnumCargo;
import org.example.model.EnumPerfil;
import org.example.repository.AdministradorRepository;
import org.example.repository.PessoaRepository;
import org.example.rest.dto.AdministradorBuscarDTO;
import org.example.rest.dto.AlterarSenhaSalvarRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AdministradorService {

    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Transactional
    public Administrador criar(Administrador admin) throws RegraNegocioException {

        if(administradorRepository.findByEmail(admin.getEmail()).isPresent()){
            throw new RegraNegocioException("Esse email já está em uso por uma conta");
        }

        admin.setSenha(passwordEncoder.encode(admin.getSenha()));
        admin.setTipoPerfil(EnumPerfil.ADM);
        admin.setPermissaoTotal(true);

        return administradorRepository.save(admin);
    }

    @Transactional
    public Administrador atualizar(UUID lookupId, Administrador novosDadosAdmin) throws EntidadeNaoEncontradaException {

        if(!administradorRepository.findByLookupId(lookupId).isPresent()){
            throw new EntidadeNaoEncontradaException("Administrador não encontrado");
        }

        Administrador administradorAtulizar= recuperarPor(lookupId);

        administradorAtulizar.setNome(novosDadosAdmin.getNome());
        administradorAtulizar.setPermissaoTotal(novosDadosAdmin.isPermissaoTotal());
        administradorAtulizar.setTipoPerfil(novosDadosAdmin.getTipoPerfil());
        administradorAtulizar.setCargo(novosDadosAdmin.getCargo());

        return administradorRepository.save(administradorAtulizar);

    }

    @Transactional
    public Administrador recuperarPor(UUID lookupId) throws EntidadeNaoEncontradaException {
        return administradorRepository.findByLookupId(lookupId).orElseThrow(() -> new EntidadeNaoEncontradaException("Entidade não encontrada"));
    }

    @Transactional
    public void remover(UUID lookupId) throws EntidadeNaoEncontradaException {

        Administrador administradorRemover = recuperarPor(lookupId);

        administradorRepository.delete(administradorRemover);
    }


    public Page<Administrador> buscar(AdministradorBuscarDTO dto){

        Pageable paginacao = PageRequest.of(0, 10);
        return administradorRepository.findAll(paginacao);
    }


    @Transactional
    public void alterarSenha(UUID lookupId, AlterarSenhaSalvarRequestDTO dto) throws EntidadeNaoEncontradaException, RegraNegocioException {

        Administrador administrador = recuperarPor(lookupId);

        if(passwordEncoder.matches(dto.getSenhaVelha(), administrador.getSenha())){
            throw new RegraNegocioException("A senha atual informada está incorreta");
        }

        if(passwordEncoder.matches(dto.getSenhaVelha(), administrador.getSenha())){
            throw new RegraNegocioException("A senha velha não pode ser igual a nova senha");
        }

        administrador.setSenha(passwordEncoder.encode(dto.getSenhaNova()));

        administradorRepository.save(administrador);
    }

}
