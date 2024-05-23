package ch.refero.rest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import ch.refero.domain.model.Entry;
import ch.refero.domain.model.Injection;
import ch.refero.domain.service.EntryService;
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

    @GetMapping("")
    @CrossOrigin
    public HttpEntity<List<Injection>> list(@RequestParam(required = false) String ref_id) {
        var entries = injectionService.findAll(Optional.ofNullable(ref_id));
        return new ResponseEntity<>(entries, HttpStatus.OK);
    }

    @PostMapping("")
    @CrossOrigin
    public HttpEntity<Injection> post(@Valid @RequestBody Injection injection) {
        return new ResponseEntity<>(injectionService.create(injection), HttpStatus.CREATED);
    }
}
