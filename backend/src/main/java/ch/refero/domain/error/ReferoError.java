package ch.refero.domain.error;

import java.util.List;

import org.springframework.http.HttpStatus;

public class ReferoError {
    public HttpStatus status;
    public String message;
    public List<String> errors;

    ReferoError(HttpStatus status, String message, List<String> errors) {
        this.status = status;
        this.message = message;
        this.errors = errors;
    }
}
