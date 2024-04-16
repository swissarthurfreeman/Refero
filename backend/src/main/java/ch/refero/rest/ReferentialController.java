package ch.refero.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.refero.domain.model.Referential;
import ch.refero.domain.repository.ReferentialRepository;

import java.util.ArrayList;
import java.util.List;

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
        /*
        var r1 = new Referential();
        r1.name = "REF_OFS_REE";
        r1.id = "aksjalkssasdgsd";

        var r2 = new Referential();
        r2.name = "REF_UNIGE_BAT";
        r2.id = "ewurwer894";

        List<Referential> refs = new ArrayList<Referential>();
        refs.add(r1);
        refs.add(r2);
        */

        var refs = refRepository.findAll();
        return new ResponseEntity<>(refs, HttpStatus.OK);
    }
}
