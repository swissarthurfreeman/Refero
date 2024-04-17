package ch.refero.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ch.refero.domain.model.Colfig;
import ch.refero.domain.model.Entry;
import ch.refero.domain.repository.ColfigRepository;
import ch.refero.domain.repository.ColfigSpecification;
import ch.refero.domain.repository.EntryRepository;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/cols")
public class ColfigController {

    @Autowired
    private ColfigRepository colRepo;

    
    @GetMapping("")
    public HttpEntity<List<Colfig>> list(@RequestParam String ref_id) {
        var spec = ColfigSpecification.filterColfig(ref_id);
        var cols = colRepo.findAll(spec);
        return new ResponseEntity<>(cols, HttpStatus.OK);
    }

    @GetMapping("{id}")
    public HttpEntity<Optional<Colfig>> get(@PathVariable String id) {
        var col = colRepo.findById(id);
        if(col.isPresent())
            return new ResponseEntity<>(col, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("")
    public HttpEntity<Colfig> post(@RequestBody Colfig col) {
        colRepo.save(col);
        return new ResponseEntity<Colfig>(col, HttpStatus.OK);
    }
}
