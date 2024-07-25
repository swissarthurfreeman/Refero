package ch.refero.rest;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import ch.refero.domain.model.Referential;
import ch.refero.domain.service.ReferentialService;
import ch.refero.domain.service.business.ReferentialDoesNotExistException;
import ch.refero.domain.service.business.ReferentialWithSameCodeAlreadyExistsException;
import ch.refero.domain.service.business.ReferentialWithSameNameAlreadyExistsException;
import jakarta.validation.Valid;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/refs")
public class ReferentialController {
    
    Logger logger = LoggerFactory.getLogger(ReferentialController.class);
    
    @Autowired
    private ReferentialService refService;
    
    @GetMapping
    @CrossOrigin
    public HttpEntity<List<Referential>> list() {
        return new ResponseEntity<>(refService.findAll(), HttpStatus.OK);
    }

    @PostMapping
    @CrossOrigin
    public HttpEntity<Referential> post(@RequestBody @Valid Referential ref) {
        return new ResponseEntity<>(refService.create(ref), HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    @CrossOrigin
    public HttpEntity<Referential> get(@PathVariable String id) {
        return new ResponseEntity<>(refService.findById(id), HttpStatus.OK);
    }

    @PutMapping("{id}")
    @CrossOrigin
    public HttpEntity<Referential> put(@PathVariable String id, @RequestBody @Valid Referential ref) {
        // PUT of new id should create the resource. 
        return new ResponseEntity<>(refService.update(id, ref), HttpStatus.OK); 
    }

    @DeleteMapping("{id}")
    @CrossOrigin
    public HttpEntity<Object> delete(@PathVariable String id) {
        refService.delete(id);
        return new ResponseEntity<>("", HttpStatus.OK);
    }

    @ExceptionHandler({
        ReferentialWithSameNameAlreadyExistsException.class,
        ReferentialWithSameCodeAlreadyExistsException.class
    })
    @ResponseBody
    public HttpEntity<Object> handleBusinessRuntimeException(RuntimeException exception) {
        return new ResponseEntity<>(
            exception.getMessage(),
            HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({
        ReferentialDoesNotExistException.class
    })
    @ResponseBody
    public HttpEntity<Object> handleNotFoundRuntimeException(RuntimeException exception) {
        return new ResponseEntity<>(
            exception.getMessage(),
            HttpStatus.NOT_FOUND);
    }
}

