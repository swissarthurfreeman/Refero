package ch.refero.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.refero.domain.model.Referential;
import ch.refero.domain.repository.ReferentialRepository;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/refs")
public class ReferentialController {

    @Autowired
    private ReferentialRepository refRepository;

    
    @GetMapping("")
    public HttpEntity<List<Referential>> list() {
        var refs = refRepository.findAll();
        return new ResponseEntity<>(refs, HttpStatus.OK);
    }

    @GetMapping("{id}")
    public HttpEntity<Optional<Referential>> get(@PathVariable String id) {
        var ref = refRepository.findById(id);
        if(ref.isPresent())
            return new ResponseEntity<>(ref, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    
}
