package ch.refero.domain.error;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class ReferoExceptionHandler extends ResponseEntityExceptionHandler {

    Logger logger = LoggerFactory.getLogger(ResponseEntityExceptionHandler.class);

    /**
     * Is invoked when a method parameter marked with @Valid (like a REST
     * controller) fails validation.
     */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(@NonNull MethodArgumentNotValidException ex, @NonNull HttpHeaders headers, @NonNull HttpStatusCode status, @NonNull WebRequest request) {
        logger.info("@Valid exception :" + ex.getClass().getName());

        final List<String> errors = new ArrayList<String>();
        for (final FieldError error : ex.getBindingResult().getFieldErrors())
            errors.add(error.getDefaultMessage());

        for (final ObjectError error : ex.getBindingResult().getGlobalErrors())
            errors.add(error.getDefaultMessage());

        final ReferoError apiError = new ReferoError(
            HttpStatus.BAD_REQUEST, 
            "Validation failed for an argument, changes not saved.", 
            errors
        );
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({ DataIntegrityViolationException.class })
    protected ResponseEntity<Object> handleDataIntegrityViolationException(@NonNull DataIntegrityViolationException ex) {
        // BUG : depending on wether JDBC or H2 is being used, this will throw a DuplicateKeyException or a DataIntegrityViolationException respectfully
        // this is a bug that still hasn't been fixed, https://github.com/spring-projects/spring-framework/issues/16292
        // depending on the db connector used in production, the output might be a DuplicateKeyException, in which case we can actually return a more
        // specific error message. We could move this exception handler to the controller when needed, though it may lead to duplication

        final List<String> errors = new ArrayList<>();
        
        var cause = ex.getCause();
        while(cause != null) {
           errors.add(cause.getMessage());
           cause = cause.getCause(); 
        }

        final ReferoError persistenceError = new ReferoError(
            HttpStatus.BAD_REQUEST, 
            "Error persisting to database, a database schema constraint was violated.",
            errors
        );
        return new ResponseEntity<>(persistenceError, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResponseStatusException.class)
    protected ResponseEntity<Object> handleResponseStatusException(ResponseStatusException ex) {
        var errors = new ArrayList<String>();
        final ReferoError genericErorr = new ReferoError(
            HttpStatus.BAD_REQUEST, 
            ex.getMessage(),
            errors
        );
        return new ResponseEntity<>(genericErorr, HttpStatus.BAD_REQUEST);
    }
}
