package ch.refero.domain.error;


import org.springframework.http.HttpStatus;

public class ReferoError {
    public HttpStatus status;  
    // A JSON serialized map of errors for object creation
    // but in case of unique key constraint validation 
    // TODO : make custom annotation for unicity to make sure we get similar errors
    public String message;          

    ReferoError(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}
