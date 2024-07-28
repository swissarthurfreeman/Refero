package ch.refero.rest;
import ch.refero.domain.error.ReferoRuntimeException;
import ch.refero.domain.service.business.ColfigDoesNotExistException;
import ch.refero.domain.service.business.ColfigUpdateConstraintViolationException;
import ch.refero.domain.service.business.InjectionDoesNotExistException;
import ch.refero.domain.service.business.InjectionUpdateConstraintViolationException;
import org.springframework.web.bind.annotation.*;

import ch.refero.domain.model.Injection;
import ch.refero.domain.service.InjectionService;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/injections")
public class InjectionController {
    Logger logger = LoggerFactory.getLogger(EntryController.class);
    
    @Autowired
    private InjectionService injectionService;

    @GetMapping
    @CrossOrigin
    public HttpEntity<List<Injection>> list(@RequestParam(required = false) String refid) {
        var entries = injectionService.findAll(Optional.ofNullable(refid));
        return new ResponseEntity<>(entries, HttpStatus.OK);
    }

    @PostMapping
    @CrossOrigin
    public HttpEntity<Injection> post(@Valid @RequestBody Injection injection) {
        return new ResponseEntity<>(injectionService.create(injection), HttpStatus.CREATED);
    }

    @PutMapping("{id}")
    @CrossOrigin
    public HttpEntity<Injection> put(@PathVariable String id, @RequestBody @Valid Injection injection) {
        return new ResponseEntity<>(injectionService.update(id, injection), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    @CrossOrigin
    public HttpEntity<Object> delete(@PathVariable String id) {
        injectionService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @ExceptionHandler({
        InjectionUpdateConstraintViolationException.class
    })
    @ResponseBody
    public HttpEntity<Object> handleBusinessRuntimeException(ReferoRuntimeException exception) {
        return new ResponseEntity<>(
            exception.fieldsErrorMap,
            HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({
        InjectionDoesNotExistException.class
    })
    @ResponseBody
    public HttpEntity<Object> handleNotFoundRuntimeException(RuntimeException exception) {
        return new ResponseEntity<>(
            exception.getMessage(),
            HttpStatus.NOT_FOUND);
    }
}
