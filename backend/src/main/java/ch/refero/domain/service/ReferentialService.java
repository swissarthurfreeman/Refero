package ch.refero.domain.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ch.refero.domain.model.Referential;
import ch.refero.domain.repository.ReferentialRepository;

@Service
public class ReferentialService {

    @Autowired
    private ReferentialRepository refRepository;
    
    Logger logger = LoggerFactory.getLogger(ReferentialService.class);

    public List<Referential> findAll() {
        var refs = refRepository.findAll();
        return refs;
    }

    public Optional<Referential> findById(String refId) {
        var ref = refRepository.findById(refId);
        return ref;
    }

    public Referential create(Referential ref) {
        return refRepository.save(ref);
    }

    public Referential update(String id, Referential ref) {       
        var savedRefOpt = refRepository.findById(id);   
        if(savedRefOpt.isPresent()) {
            var savedRef = savedRefOpt.get();                   // simply calling save yields a constraint violation...
            savedRef.setName(ref.name);                        // PUT replaces the resource at that URI, necesarily a valid Referential. 
            savedRef.setDescription(ref.description);  
            return refRepository.save(savedRef);               // don't forget to resave
        }                                                      // PUT of non existent creates the resource
        var newRef = this.create(ref);
        return newRef; 
    }
}
