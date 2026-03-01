package org.example.exception;

public class MirlleException extends Exception {

    private static final long serialVersionUID = 1L;


    public MirlleException(String message, Throwable cause) {
        super(message, cause);
    }

    public MirlleException(String message) {
        super(message);
    }
}
