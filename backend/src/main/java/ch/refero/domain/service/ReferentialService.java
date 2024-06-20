package ch.refero.domain.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ch.refero.domain.model.Referential;
import ch.refero.domain.repository.ColfigRepository;
import ch.refero.domain.repository.EntryRepository;
import ch.refero.domain.repository.ReferentialRepository;

@Service
public class ReferentialService {
    @Autowired
    private ReferentialRepository refRepository;
    
    @Autowired
    private EntryRepository entryRepository;
    
    @Autowired
    private ColfigRepository colRepository;
    
    Logger logger = LoggerFactory.getLogger(ReferentialService.class);

    public List<Referential> findAll() {
        var refs = refRepository.findAll();
        return refs;
    }

    public Optional<Referential> findById(String refid) {
        var ref = refRepository.findById(refid);
        return ref;
    }

    public Referential create(Referential ref) {
        return refRepository.save(ref);
    }

    public Referential update(String id, Referential ref) {       
        var savedRefOpt = refRepository.findById(id);   
        if(savedRefOpt.isPresent()) {
            var savedRef = savedRefOpt.get();                   // simply calling save yields a constraint violation...
            savedRef.name = ref.name;                        // PUT replaces the resource at that URI, necesarily a valid Referential. 
            savedRef.description = ref.description;  
            return refRepository.save(savedRef);               // don't forget to resave
        }                                                      // PUT of non existent creates the resource
        var newRef = this.create(ref);
        return newRef; 
    }

    public void delete(String refId) {
        logger.warn("HELLOOO");
        var savedRefOpt = refRepository.findById(refId);   
        if(savedRefOpt.isPresent()) {
            logger.warn("Trying to delete entries and columns...");
            var entries = this.entryRepository.findByRefid(refId);
            logger.warn("Entries found :" + entries.size());
            for(var entry: entries) {
                logger.warn("Deleting : " + entry.id);
                this.entryRepository.deleteById(entry.id);
            }
            
            var columns = this.colRepository.findByRefid(refId);
            for(var col: columns) {
                logger.warn("Deleting : " + col.id);
                colRepository.deleteById(col.id);
            }

            this.refRepository.deleteById(refId);
        }
    }
}
