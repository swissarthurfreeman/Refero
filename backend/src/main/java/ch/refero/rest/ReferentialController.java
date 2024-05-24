package ch.refero.rest;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ch.refero.domain.model.Referential;
import ch.refero.domain.service.ReferentialService;
import jakarta.validation.Valid;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/refs")
public class ReferentialController {
    
    Logger logger = LoggerFactory.getLogger(ReferentialController.class);
    
    @Autowired
    private ReferentialService refService;
    
    @GetMapping("")
    @CrossOrigin
    public HttpEntity<List<Referential>> list() {
        return new ResponseEntity<>(refService.findAll(), HttpStatus.OK);
    }


    @GetMapping("{id}")
    @CrossOrigin
    public HttpEntity<Referential> get(@PathVariable String id) {
        var ref = refService.findById(id);
        if(ref.isPresent())
            return new ResponseEntity<>(ref.get(), HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("{id}")
    @CrossOrigin
    public HttpEntity<Referential> put(@PathVariable String id, @RequestBody @Valid Referential ref) {
        logger.info("update ref with id: " + id);
        return new ResponseEntity<>(refService.update(id, ref), HttpStatus.OK); // PUT of new id creates the resource...
    }

    
    @PostMapping("")
    @CrossOrigin
    public HttpEntity<Referential> post(@Valid @RequestBody Referential ref) {
        return new ResponseEntity<>(refService.create(ref), HttpStatus.CREATED);
    }
}
