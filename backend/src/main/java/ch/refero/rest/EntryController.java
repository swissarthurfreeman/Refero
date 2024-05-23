package ch.refero.rest;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import ch.refero.domain.model.Entry;
import ch.refero.domain.service.EntryService;
import ch.refero.domain.service.ReferentialService;
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
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/entries")
public class EntryController {
    Logger logger = LoggerFactory.getLogger(EntryController.class);
    
    @Autowired
    private EntryService entryService;

    @GetMapping("")
    @CrossOrigin
    public HttpEntity<List<Entry>> list(@RequestParam(required = false) String ref_id) {
        var entries = entryService.findAll(Optional.ofNullable(ref_id)); // ref_id can be null, will work.
        return new ResponseEntity<>(entries, HttpStatus.OK);
    }

    @GetMapping("{id}")
    @CrossOrigin
    public HttpEntity<Optional<Entry>> get(@PathVariable String id) {
        var entry = entryService.findById(id);
        if(entry.isPresent())
            return new ResponseEntity<>(entry, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("")
    @CrossOrigin
    public HttpEntity<Entry> post(@RequestBody @Valid Entry entry) {
        // TODO : validate entry, check all constraints, throw errors that can be handled by ReferoExceptionHandler class
        /*var ref = refService.findById(entry.ref_id);
        if(ref.isPresent()) {
            var entryCreationReport = entryService.create(entry, ref.get()); 
            if(entryCreationReport.isPresent()) {

            }
            return new ResponseEntity<Entry>(newEntry, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);*/
        return new ResponseEntity<>(this.entryService.create(entry), HttpStatus.CREATED);
    }


    @PutMapping("{id}")
    @CrossOrigin
    public HttpEntity<Entry> put(@PathVariable String id, @RequestBody @Valid Entry entry) {
        var updatedEntry = entryService.update(entry.id, entry);
        logger.info("PUT :", entry.id, entry.fields);

        return new ResponseEntity<Entry>(updatedEntry, HttpStatus.OK);
    }
}
