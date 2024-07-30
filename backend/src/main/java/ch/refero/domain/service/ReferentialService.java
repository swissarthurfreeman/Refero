package ch.refero.domain.service;

import ch.refero.domain.service.business.ReferentialUpdateConstraintViolation;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ch.refero.domain.model.Referential;
import ch.refero.domain.repository.ColfigRepository;
import ch.refero.domain.repository.EntryRepository;
import ch.refero.domain.repository.ReferentialRepository;
import ch.refero.domain.service.business.ReferentialDoesNotExistException;

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

    /**
     * Find a referential by refId, if refId is null, this throws a 
     * NullPointerException, if refId does not refer to anything, it 
     * throws ReferentialDoesNotExistException.
     */
    public Referential findById(String refid) {
        var ref = refRepository.findById(refid);
        
        if(ref.isPresent())
          return ref.get();
        
        throw new ReferentialDoesNotExistException();
    }

    private void CheckRefNameUnicity(Referential ref, Map<String, String> errorMap) {
        var sRef = refRepository.findByName(ref.name);
        if(!sRef.isEmpty())
            if(!sRef.get(0).id.equals(ref.id))
                errorMap.put("name", "A referential with that name already exists.");
    }

    private void CheckRefCodeUnicity(Referential ref, Map<String, String> errorMap) {
        var sRef = refRepository.findByCode(ref.code);
        if(!sRef.isEmpty())
            if(!sRef.get(0).id.equals(ref.id))
                errorMap.put("code", "A referential with that code already exists.");
    }

    public void ValidateItemSpecificRules(Referential ref) {
        var errorMap = new HashMap<String, String>();
        CheckRefNameUnicity(ref, errorMap);
        CheckRefCodeUnicity(ref, errorMap);

        if(!errorMap.isEmpty())
            throw new ReferentialUpdateConstraintViolation(errorMap);
    }

    public Referential save(Referential ref) {
        ValidateItemSpecificRules(ref);
        return refRepository.save(ref);
    }

    public Referential create(Referential ref) {
        ref.id = UUID.randomUUID().toString();
        return save(ref);
    }

    public Referential update(String id, Referential ref) {       
        try {
            var sRef = findById(id);
            sRef.setName(ref.getName());        // to avoid cascading operations hell with associations.
            sRef.setCode(ref.getCode());
            sRef.setDescription(ref.getDescription());
            return save(sRef);
        } catch(ReferentialDoesNotExistException e) {
            ref.setId(id);
            return save(ref);
        }
    }

    public void delete(String refId) {
        findById(refId);   
        
        var entries = this.entryRepository.findByRefid(refId);
        for(var entry: entries) this.entryRepository.deleteById(entry.id);
        
        var columns = this.colRepository.findByRefid(refId);
        for(var col: columns) colRepository.deleteById(col.id);

        this.refRepository.deleteById(refId);
    }
}
