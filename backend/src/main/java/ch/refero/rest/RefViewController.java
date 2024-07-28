package ch.refero.rest;

import ch.refero.domain.error.ReferoRuntimeException;
import ch.refero.domain.service.business.InjectionDoesNotExistException;
import ch.refero.domain.service.business.InjectionUpdateConstraintViolationException;
import ch.refero.domain.service.business.ViewDoesNotExistException;
import ch.refero.domain.service.business.ViewUpdateConstraintViolation;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ch.refero.domain.model.RefView;
import ch.refero.domain.service.ViewService;
import jakarta.validation.Valid;

@CrossOrigin
@RestController
@RequestMapping("/views")
public class RefViewController {

    @Autowired
    private ViewService viewService;
    
    @GetMapping
    public HttpEntity<List<RefView>> list(@RequestParam(required = false) String refid) {
        var views = viewService.findAll(Optional.ofNullable(refid));
        return new ResponseEntity<>(views, HttpStatus.OK);
    }

    @PostMapping
    public HttpEntity<RefView> post(@RequestBody @Valid RefView view) {
        return new ResponseEntity<>(viewService.create(view), HttpStatus.OK);
    }

    @GetMapping("{id}")
    public HttpEntity<RefView> get(@PathVariable String id) {
        return new ResponseEntity<>(viewService.findById(id), HttpStatus.OK);
    }

    @PutMapping("{id}")
    public HttpEntity<RefView> put(@PathVariable String id, @RequestBody @Valid RefView view) {
        return new ResponseEntity<>(viewService.update(id, view), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public HttpEntity<Object> delete(@PathVariable String id) {
        viewService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @ExceptionHandler({
        ViewUpdateConstraintViolation.class
    })
    @ResponseBody
    public HttpEntity<Object> handleBusinessRuntimeException(ReferoRuntimeException exception) {
        return new ResponseEntity<>(
            exception.fieldsErrorMap,
            HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({
        ViewDoesNotExistException.class
    })
    @ResponseBody
    public HttpEntity<Object> handleNotFoundRuntimeException(RuntimeException exception) {
        return new ResponseEntity<>(
            exception.getMessage(),
            HttpStatus.NOT_FOUND);
    }
}
