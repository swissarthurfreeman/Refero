package ch.refero.rest;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.validation.FieldError;

import ch.refero.domain.model.Colfig;
import ch.refero.domain.service.ColfigService;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/cols")
public class ColfigController {

    Logger logger = LoggerFactory.getLogger(ReferentialController.class);
    
    @Autowired
    public ColfigService colfigService;

    @GetMapping("")
    public HttpEntity<List<Colfig>> list(@RequestParam(required = false) String ref_id) {
        var colfigs = colfigService.findAll(Optional.ofNullable(ref_id));
        return new ResponseEntity<>(colfigs, HttpStatus.OK);
    }

    @GetMapping("{id}")
    public HttpEntity<Optional<Colfig>> get(@PathVariable String id) {
        var colfig = colfigService.findById(id);
        if(colfig.isPresent())
            return new ResponseEntity<>(colfig, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("")
    public ResponseEntity<Colfig> post(@RequestBody @Valid Colfig col) {
        var savedCol = colfigService.save(col);
        if(savedCol.isPresent())
            return new ResponseEntity<Colfig>(savedCol.get(), HttpStatus.CREATED);
        
        logger.info("Throw exception !");
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ref_id is not valid");
    }

    // TODO : make sure a column that's a FK doesn't have a date format, etc. 
    // TODO : Add PUT mapping for updating columns. 

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(ResponseStatusException.class)
    public Map<String, String> handleResponseStatusException(ResponseStatusException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("message", ex.getReason());
        return errors;
    }
    
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public Map<String, String> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", "Column name is already present for this referential."); 
        return error;
    }
}
