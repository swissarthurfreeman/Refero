package ch.refero.rest;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.refero.domain.model.RefView;
import ch.refero.domain.repository.ViewRepository;

@RestController
@RequestMapping("/views")
public class RefViewController {

    @Autowired
    private ViewRepository colRepo;

    
    @GetMapping("")
    public HttpEntity<List<RefView>> list() {
        var cols = colRepo.findAll();
        return new ResponseEntity<>(cols, HttpStatus.OK);
    }

    @GetMapping("{id}")
    public HttpEntity<Optional<RefView>> get(@PathVariable String id) {
        var col = colRepo.findById(id);
        if(col.isPresent())
            return new ResponseEntity<>(col, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("")
    public HttpEntity<RefView> post(@RequestBody RefView col) {
        colRepo.save(col);
        return new ResponseEntity<RefView>(col, HttpStatus.OK);
    }
}
