package ch.refero.rest;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import ch.refero.domain.model.Colfig;
import ch.refero.domain.service.ColfigService;
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
@RequestMapping("/cols")
public class ColfigController {

    Logger logger = LoggerFactory.getLogger(ReferentialController.class);
    
    @Autowired
    public ColfigService colfigService;

    @GetMapping("")
    @CrossOrigin
    public HttpEntity<List<Colfig>> list(@RequestParam(required = false) String refid) {
        var colfigs = colfigService.findAll(Optional.ofNullable(refid));
        return new ResponseEntity<>(colfigs, HttpStatus.OK);
    }

    @GetMapping("{id}")
    @CrossOrigin
    public HttpEntity<Optional<Colfig>> get(@PathVariable String id) {
        var colfig = colfigService.findById(id);
        if(colfig.isPresent())
            return new ResponseEntity<>(colfig, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("")
    @CrossOrigin
    public ResponseEntity<Colfig> post(@RequestBody @Valid Colfig col) {
        return new ResponseEntity<Colfig>(colfigService.save(col).get(), HttpStatus.CREATED);
    }

    // TODO : make sure a column that's a FK doesn't have a date format, etc. 
    // TODO : Add PUT mapping for updating columns. 
}
