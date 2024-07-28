package ch.refero.domain.service;

import ch.refero.domain.service.business.EntryUpdateConstraintViolationException;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import java.util.Optional;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import ch.refero.domain.model.Entry;
import ch.refero.domain.repository.EntryRepository;
import ch.refero.domain.service.utils.ConstraintUtils;
import ch.refero.domain.service.business.EntryDoesNotExistException;

@Service
public class EntryService {
    @Autowired
    private EntryRepository entryRepo;

    Logger logger = LoggerFactory.getLogger(EntryService.class);

    public List<Entry> findAll(Optional<String> refid) {
        if(refid.isPresent())
            return entryRepo.findByRefid(refid.get());
        
        return entryRepo.findAll();
    }

    public Entry findById(String entryId) {
        var entry = entryRepo.findById(entryId);
        if(entry.isPresent()) return entry.get();
        
        throw new EntryDoesNotExistException();
    }

    @Autowired
    private ConstraintUtils cUtils;
   
    /**
     * Upon updating or creating an Entry, we check the following :
     * 1. Check entry's BK constraint.
     * 2. Check required fields. 
     * @param entry the entry to create or update. 
     */
    public void ValidateItemSpecificRules(Entry entry) {
        var errorMap = new HashMap<String, String>();
        cUtils.CheckBkUnicityWhenUpdatingOrAddingAn(entry, errorMap);
        cUtils.CheckDateFormatConstraintOn(entry, errorMap);
        cUtils.CheckRequiredConstraintOn(entry, errorMap);
        // TODO : check foreign key constraint
        if(!errorMap.isEmpty()) throw new EntryUpdateConstraintViolationException(errorMap);
    }

    public Entry save(Entry entry) {
        ValidateItemSpecificRules(entry);
        return entryRepo.save(entry);     // TODO : make sure all columns of ref appear in map. 
    }

    public Entry update(String id, Entry entry) {
        findById(id);
        entry.setId(id);
        return save(entry);
    }

    /**
     * Controller already checked every column id, they should all exist and be valid.
     * This is unless, the column was deleted between the first validation and the lookup.
     * We need to investigate marking things as @Transactional to make sure such situations
     * don't happen. 
     * @param entry @Valid marked entry
     * @return
     */
    public Entry create(Entry entry) {
        entry.id = UUID.randomUUID().toString();    // TODO : force if BK for value to be required
        return save(entry);
    }
    
    public void delete(String id) {
        entryRepo.deleteById(id);
    }
}
