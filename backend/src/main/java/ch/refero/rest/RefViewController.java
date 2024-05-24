package ch.refero.rest;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ch.refero.domain.model.RefView;
import ch.refero.domain.service.ViewService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/views")
public class RefViewController {

    @Autowired
    private ViewService viewService;
    
    @GetMapping("")
    @CrossOrigin
    public HttpEntity<List<RefView>> list(@RequestParam(required = false) String ref_id) {
        var views = viewService.findAll(Optional.ofNullable(ref_id));
        return new ResponseEntity<>(views, HttpStatus.OK);
    }

    @GetMapping("{id}")
    @CrossOrigin
    public HttpEntity<Optional<RefView>> get(@PathVariable String id) {
        var col = viewService.findById(id);
        if(col.isPresent())
            return new ResponseEntity<>(col, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("")
    @CrossOrigin
    public HttpEntity<RefView> post(@RequestBody @Valid RefView view) {
        return new ResponseEntity<RefView>(viewService.create(view).get(), HttpStatus.OK); 
    }
}
