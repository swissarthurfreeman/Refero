package ch.refero.rest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import ch.refero.domain.model.RefView;
import ch.refero.domain.service.ViewService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/views")
public class RefViewController {

    @Autowired
    private ViewService viewService;

    
    @GetMapping("")
    public HttpEntity<List<RefView>> list(@RequestParam(required = false) String ref_id) {
        var views = viewService.findAll(Optional.ofNullable(ref_id));
        return new ResponseEntity<>(views, HttpStatus.OK);
    }

    @GetMapping("{id}")
    public HttpEntity<Optional<RefView>> get(@PathVariable String id) {
        var col = viewService.findById(id);
        if(col.isPresent())
            return new ResponseEntity<>(col, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("")
    public HttpEntity<RefView> post(@RequestBody @Valid RefView view) {
        var viewOpt = viewService.create(view);
        if(viewOpt.isPresent())
            return new ResponseEntity<RefView>(viewOpt.get(), HttpStatus.OK);
        
        // TODO : refactor service to throw an error object and catch then.
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "View has an invalid column id in it."); 
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public Map<String, String> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("message", "View ref_id is invalid.");
        return errors;
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(ResponseStatusException.class)
    public Map<String, String> handleResponseStatusException(ResponseStatusException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("message", ex.getReason());
        return errors;
    }
}
