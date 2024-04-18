package ch.refero.rest;

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
import ch.refero.domain.service.EntryService;
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
@RequestMapping("/entries")
public class EntryController {
    Logger logger = LoggerFactory.getLogger(EntryController.class);
    
    @Autowired
    private EntryService entryService;

    @GetMapping("")
    public HttpEntity<List<Entry>> list(@RequestParam(required = false) String ref_id) {
        var entries = entryService.findAll(Optional.ofNullable(ref_id)); // ref_id can be null, will work.
        return new ResponseEntity<>(entries, HttpStatus.OK);
    }

    @GetMapping("{id}")
    public HttpEntity<Optional<Entry>> get(@PathVariable String id) {
        var entry = entryService.findById(id);
        if(entry.isPresent())
            return new ResponseEntity<>(entry, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("")
    public HttpEntity<Entry> post(@RequestBody @Valid Entry entry) {
        var newEntry = entryService.create(entry);
        return new ResponseEntity<Entry>(newEntry, HttpStatus.OK);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public Map<String, String> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("message", "Unique entry id violation.");
        return errors;
    }
}
