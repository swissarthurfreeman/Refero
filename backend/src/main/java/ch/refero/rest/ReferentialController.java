package ch.refero.rest;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.validation.FieldError;

import ch.refero.domain.model.Referential;
import ch.refero.domain.service.ReferentialService;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/refs")
public class ReferentialController {
    
    Logger logger = LoggerFactory.getLogger(ReferentialController.class);
    
    @Autowired
    private ReferentialService refService;
    
    @GetMapping("")
    @CrossOrigin
    public HttpEntity<List<Referential>> list() {
        return new ResponseEntity<>(refService.findAll(), HttpStatus.OK);
    }


    @GetMapping("{id}")
    @CrossOrigin
    public HttpEntity<Referential> get(@PathVariable String id) {
        var ref = refService.findById(id);
        if(ref.isPresent())
            return new ResponseEntity<>(ref.get(), HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("{id}")
    @CrossOrigin
    public HttpEntity<Referential> put(@PathVariable String id, @RequestBody @Valid Referential ref) {
        var updatedRef = refService.update(id, ref);
        if (updatedRef.isPresent())
            return new ResponseEntity<>(updatedRef.get(), HttpStatus.OK);
        
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    
    @PostMapping("")
    @CrossOrigin
    public HttpEntity<Referential> post(@Valid @RequestBody Referential ref) {
        return new ResponseEntity<>(refService.create(ref), HttpStatus.CREATED);
    }

    // see https://github.com/eugenp/tutorials/tree/master/spring-boot-modules/spring-boot-validation
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
        Map<String, String> errors = new HashMap<>();
        errors.put("message", "Unique referential name violation.");
        return errors;
    }

}
