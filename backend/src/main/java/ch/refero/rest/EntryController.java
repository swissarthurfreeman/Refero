package ch.refero.rest;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ch.refero.domain.model.Entry;
import ch.refero.domain.service.EntryService;
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
@RequestMapping("/entries")
public class EntryController {
    Logger logger = LoggerFactory.getLogger(EntryController.class);
    
    @Autowired
    private EntryService entryService;

    @GetMapping("")
    @CrossOrigin
    public HttpEntity<List<Entry>> list(@RequestParam(required = false) String refid) {
        var entries = entryService.findAll(Optional.ofNullable(refid)); // refid can be null, will work.
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
        return new ResponseEntity<>(this.entryService.create(entry), HttpStatus.CREATED);
    }

    @PutMapping("{id}")
    @CrossOrigin
    public HttpEntity<Entry> put(@PathVariable String id, @RequestBody @Valid Entry entry) {    // TODO : id is useless here, create takes care of this...
        return new ResponseEntity<Entry>(this.entryService.create(entry), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    @CrossOrigin
    public HttpEntity<Object> delete(@PathVariable String id) {
        this.entryService.delete(id);
        return new ResponseEntity<Object>("", HttpStatus.OK);
    }
}
