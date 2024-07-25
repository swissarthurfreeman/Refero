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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import ch.refero.domain.model.Entry;
import ch.refero.domain.service.EntryService;
import ch.refero.domain.service.business.EntryContainsDuplicateBkValuesException;
import ch.refero.domain.service.business.EntryHasMissingRequiredValuesException;
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

    @GetMapping
    @CrossOrigin
    public HttpEntity<List<Entry>> list(@RequestParam(required = false) String refid) {
        var entries = entryService.findAll(Optional.ofNullable(refid)); // refid can be null, will work.
        return new ResponseEntity<>(entries, HttpStatus.OK);
    }

    @PostMapping
    @CrossOrigin
    public HttpEntity<Entry> post(@RequestBody @Valid Entry entry) {
        return new ResponseEntity<>(this.entryService.create(entry), HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    @CrossOrigin
    public HttpEntity<Entry> get(@PathVariable String id) {
        return new ResponseEntity<>(entryService.findById(id), HttpStatus.OK);
    }
    
    @PutMapping("{id}")
    @CrossOrigin
    public HttpEntity<Entry> put(@PathVariable String id, @RequestBody Entry entry) {
        return new ResponseEntity<Entry>(this.entryService.update(id, entry), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    @CrossOrigin
    public HttpEntity<Object> delete(@PathVariable String id) {
        this.entryService.delete(id);
        return new ResponseEntity<Object>("", HttpStatus.OK);
    }

    @ExceptionHandler({
        EntryHasMissingRequiredValuesException.class,
        EntryContainsDuplicateBkValuesException.class
    })
    @ResponseBody
    public HttpEntity<Object> handleBusinessRuntimeException(RuntimeException exception) {
        return new ResponseEntity<>(
            exception.getMessage(),
            HttpStatus.BAD_REQUEST);
    }
}
