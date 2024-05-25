package ch.refero.domain.error;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
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
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.google.gson.Gson;

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

        Map<String, String> errMap = new HashMap<String, String>();
        for (final FieldError error : ex.getBindingResult().getFieldErrors())
            errMap.put(error.getField(), error.getDefaultMessage());

        for (final ObjectError error : ex.getBindingResult().getGlobalErrors()) {
            if(error.getObjectName().equals("refView")) {
                errMap.put("name", error.getDefaultMessage());
            } else {
                errMap.put(error.getObjectName(), error.getDefaultMessage());
            }
        }
            

        Gson gson = new Gson();
        String jsonErrMap = gson.toJson(errMap);
        
        final ReferoError apiError = new ReferoError(
            HttpStatus.BAD_REQUEST, 
            jsonErrMap
        );

        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    /*
     * Exception thrown when an attempt to insert or update data results in violation of an integrity constraint.
     */
    @ExceptionHandler({ DataIntegrityViolationException.class })
    protected ResponseEntity<Object> handleDataIntegrityViolationException(@NonNull DataIntegrityViolationException ex) {
        // BUG : depending on wether JDBC or H2 is being used, this will throw a DuplicateKeyException or a DataIntegrityViolationException respectfully
        // this is a bug that still hasn't been fixed, https://github.com/spring-projects/spring-framework/issues/16292
        // depending on the db connector used in production, the output might be a DuplicateKeyException, in which case we can actually return a more
        // specific error message. We could move this exception handler to the controller when needed, though it may lead to duplication

        final ReferoError persistenceError = new ReferoError(
            HttpStatus.BAD_REQUEST, 
            ex.getMessage()
        );
        return new ResponseEntity<>(persistenceError, HttpStatus.BAD_REQUEST);
    }
}
