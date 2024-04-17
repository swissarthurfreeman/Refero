package ch.refero.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.refero.domain.model.Entry;
import ch.refero.domain.model.Referential;
import ch.refero.domain.repository.EntryRepository;
import ch.refero.domain.repository.ReferentialRepository;
import java.util.List;
import java.util.Optional;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/records")
public class EntryController {

    @Autowired
    private EntryRepository recRepo;

    
    @GetMapping("")
    public HttpEntity<List<Entry>> list() {
        var recs = recRepo.findAll();
        return new ResponseEntity<>(recs, HttpStatus.OK);
    }

    @GetMapping("{id}")
    public HttpEntity<Optional<Entry>> get(@PathVariable String id) {
        var rec = recRepo.findById(id);
        if(rec.isPresent())
            return new ResponseEntity<>(rec, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("")
    public HttpEntity<Entry> post(@RequestBody Entry rec) {
        recRepo.save(rec);
        return new ResponseEntity<Entry>(rec, HttpStatus.OK);
    }
}
