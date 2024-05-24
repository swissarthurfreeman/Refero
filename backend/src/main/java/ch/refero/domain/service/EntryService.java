package ch.refero.domain.service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import ch.refero.domain.model.Colfig;
import ch.refero.domain.model.Entry;
import ch.refero.domain.model.Referential;
import ch.refero.domain.repository.EntryRepository;
//import ch.refero.domain.repository.ReferentialRepository;
import ch.refero.domain.repository.specifications.FilterByRefIdSpecification;

@Service
public class EntryService {
    @Autowired
    private EntryRepository entryRepo;

    @Autowired
    private ColfigService colfigService;

    Logger logger = LoggerFactory.getLogger(ReferentialService.class);

    public List<Entry> findAll(Optional<String> ref_id) {
        if(ref_id.isPresent()) {
            var spec = new FilterByRefIdSpecification<Entry>().filterColfig(ref_id.get());
            var entries = entryRepo.findAll(spec);
            return entries;
        }
        return entryRepo.findAll();
    }

    public Optional<Entry> findById(String entryId) {
        var entry = entryRepo.findById(entryId);
        return entry;
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
        this.validateBusinessKeys(entry);
        return entryRepo.save(entry);
    }
    
    /**
     * Check if business key of entry (composed or not) is unique within the already existing 
     * entries in the referential. Throws a DuplicateKeyException if it's not the case. 
     */
    private void validateBusinessKeys(Entry entry) {
        List<Colfig> bkColfigs = new ArrayList<>();             // if column is BK, check it's unique.
        var newEntryBkSlice = "";                           

        for(var colId: entry.fields.keySet()) {
            var colfig = this.colfigService.findById(colId).get();
            if(colfig.colType.equals("BK")) {
                bkColfigs.add(colfig);
                newEntryBkSlice += entry.fields.get(colfig.id);
            }
        }

        if(bkColfigs.size() > 0) {                              // we build a list of strings of bk1 bk2 ... bkn strings present in the ref 
            List<Entry> entries = this.findAll(Optional.of(entry.ref_id));
            List<String> bkStringSlices = new ArrayList<>();

            for(var existingEntry: entries) {
                var bkStringSlice = "";
                for(var bkColfig: bkColfigs) {
                    bkStringSlice += existingEntry.fields.get(bkColfig.id);
                }
                bkStringSlices.add(bkStringSlice);
            }

            var idx = bkStringSlices.indexOf(newEntryBkSlice);  // we check if the bk1 bk2 ... bkn string of the entry to create is already there
            if(idx != -1) {
                logger.info("\n\nDUP KEY\n\n");
                // TODO : This could mean we're updating an already existing record, hence the check here.
                if(!entries.get(idx).id.equals(entry.id)) {
                    throw new DuplicateKeyException("Duplicate Business Key error, BK value (" + newEntryBkSlice + ") already exists.");
                }
            }
        }
    }
}
