package ch.refero.domain.service;

import ch.refero.domain.model.ColType;
import ch.refero.domain.model.Colfig;
import ch.refero.domain.repository.ColfigRepository;
import ch.refero.domain.repository.ReferentialRepository;
import ch.refero.domain.service.business.EntryIsPointedToByOtherRefFkException;
import ch.refero.domain.service.business.EntryUpdateConstraintViolationException;
import java.util.*;
import org.slf4j.Logger;
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
        var errorMap = new HashMap<String, Object>();
        cUtils.CheckDateFormatConstraintOn(entry, errorMap);
        cUtils.CheckRequiredConstraintOn(entry, errorMap);
        cUtils.CheckFkValueValidityWhenAddingA(entry, errorMap);
        // error type priority for Duplicate conflicts
        var dupEntry = cUtils.CheckBkUnicityWhenUpdatingOrAddingAn(entry, errorMap);

        if(!errorMap.isEmpty()) throw new EntryUpdateConstraintViolationException(errorMap, entry, dupEntry);
    }

    public Entry save(Entry entry) {
        ValidateItemSpecificRules(entry);
        return entryRepo.save(entry);     // TODO : make sure all columns of ref appear in map. 
    }

    public Entry update(String id, Entry entry) {
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


    @Autowired
    private ColfigRepository colfigRepo;

    @Autowired
    private ReferentialRepository refRepo;

    public void delete(String id) {
        Entry entryToDelete;
        try {
            entryToDelete = findById(id);
        } catch(EntryDoesNotExistException e) {
            return;
        }

        // get all foreign columns which point towards the referential that contains the line to delete
        List<Colfig> fkColfigs = this.colfigRepo.findByColtypeAndPointedrefid(ColType.FK, entryToDelete.refid);

        Set<String> fkValues = new HashSet<>();
        for(var fkColfig : fkColfigs) {
            List<Entry> entries = this.entryRepo.findByRefid(fkColfig.refid);
            for(Entry e : entries) {
                fkValues.add(e.fields.get(fkColfig.id));
            }
            if(fkColfig.pointedrefcolid.equals("PK")) {
                if(fkValues.contains(entryToDelete.id)) {
                    var RefWithFk = refRepo.findById(fkColfig.refid).get();
                    throw new EntryIsPointedToByOtherRefFkException("Entry is pointed to by an Fk in " + RefWithFk.code);
                }
            } else {
                if(fkValues.contains(entryToDelete.fields.get(fkColfig.pointedrefcolid))) {
                    var RefWithFk = refRepo.findById(fkColfig.refid).get();
                    logger.warn("Entry is pointed to by an Fk in " + RefWithFk.code);
                    throw new EntryIsPointedToByOtherRefFkException("Entry is pointed to by an Fk in " + RefWithFk.code);
                }
            }
            fkValues = new HashSet<>();
        }

        // TODO : check that no ref has a foreign key that points towards this ref and an entryToDelete
        // pointing towards the entryToDelete being deleted.
        // get all FK colfigs with a pointedrefid == entryToDelete.refid
        // for every set of entries of every referential who'se these foreign columns belong to
        // for every entryToDelete if an entryToDelete has a FK value that's equal to the BK or PK of this record
        // do not delete the entryToDelete, notify user that entryToDelete is pointed to by that ref.
        entryRepo.deleteById(id);
    }

    public boolean exists(String id) {
        return entryRepo.existsById(id);
    }
}
