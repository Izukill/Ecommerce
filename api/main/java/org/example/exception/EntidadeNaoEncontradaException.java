package org.example.exception;

public class EntidadeNaoEncontradaException extends Exception {

    private static final long serialVersionUID = 1L;

    public EntidadeNaoEncontradaException(String message) {
        super(message);
    }

    public EntidadeNaoEncontradaException(String nomeEntidade, Object id) {
        super(String.format("%s com identificador '%s' não foi encontrado(a).", nomeEntidade, id));
    }
}
