package ch.refero.domain.error;

import java.util.Map;
import org.slf4j.Logger;
import java.util.HashMap;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;


@ControllerAdvice   // Deals with basic validation at controller level whenever an @Valid annotation is passed. 
public class ReferoExceptionHandler extends ResponseEntityExceptionHandler {

    Logger logger = LoggerFactory.getLogger(ReferoExceptionHandler.class);

    @Override
    @Nullable   // returns a map of errors for every field that failed validation. 
    protected ResponseEntity<Object> handleMethodArgumentNotValid(@NonNull MethodArgumentNotValidException ex,
            @NonNull HttpHeaders headers, @NonNull HttpStatusCode status, @NonNull WebRequest request) {
        
        Map<String, String> errorMap = new HashMap<>();
        
        for (final FieldError error : ex.getBindingResult().getFieldErrors())
            errorMap.put(error.getField(), error.getDefaultMessage());
        
        return new ResponseEntity<>(errorMap, HttpStatus.BAD_REQUEST);
    }
}
