package ch.refero.rest;


import ch.refero.domain.error.ReferoRuntimeException;
import ch.refero.domain.service.business.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import ch.refero.domain.model.Colfig;
import ch.refero.domain.service.ColfigService;
import jakarta.validation.Valid;

import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/cols")
public class ColfigController {

    Logger logger = LoggerFactory.getLogger(ReferentialController.class);
    
    @Autowired
    public ColfigService colfigService;

    @GetMapping
    @CrossOrigin
    public HttpEntity<List<Colfig>> list(@RequestParam(required = false) String refid) {
        var colfigs = colfigService.findAll(Optional.ofNullable(refid));
        return new ResponseEntity<>(colfigs, HttpStatus.OK);
    }

    @PostMapping
    @CrossOrigin
    public ResponseEntity<Colfig> post(@RequestBody @Valid Colfig col) {
        return new ResponseEntity<Colfig>(colfigService.create(col), HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    @CrossOrigin
    public HttpEntity<Colfig> get(@PathVariable String id) {
        return new ResponseEntity<>(colfigService.findById(id), HttpStatus.OK);
    }

    @PutMapping("{id}")
    @CrossOrigin
    public ResponseEntity<Colfig> put(@PathVariable String id, @RequestBody @Valid Colfig col) {
        return new ResponseEntity<>(colfigService.update(id, col), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Object> delete(@PathVariable String id) {
        colfigService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @ExceptionHandler({
        // IllegalArgumentException.class, // handles invalid dateTime Syntax
        ColfigUpdateConstraintViolationException.class
    })
    @ResponseBody
    public HttpEntity<Object> handleBusinessRuntimeException(ReferoRuntimeException exception) {
        return new ResponseEntity<>(
            exception.fieldsErrorMap,
            HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({
        ColfigDoesNotExistException.class
    })
    @ResponseBody
    public HttpEntity<Object> handleNotFoundRuntimeException(RuntimeException exception) {
        return new ResponseEntity<>(
            exception.getMessage(),
            HttpStatus.NOT_FOUND);
    }
}
