package ch.refero.domain.service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import ch.refero.domain.model.Colfig;
import ch.refero.domain.model.Entry;
import ch.refero.domain.repository.EntryRepository;
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

        List<Colfig> bkColfigs = new ArrayList<>();
        List<Colfig> reqColfigs = new ArrayList<>();

        for(var colId: entry.fields.keySet()) {
            var colfig = this.colfigService.findById(colId).get();  // Entry has been validated before
            if(colfig.colType.equals("BK"))
                bkColfigs.add(colfig);
            
            if(colfig.required)
                reqColfigs.add(colfig);   // TODO : check foreign key validity if required
        }

        var reqFieldsErrors = this.validateRequiredFields(entry, reqColfigs);
        var errMap = this.validateBusinessKeys(entry, bkColfigs);
        
        errMap.putAll(reqFieldsErrors);

        for(var key: errMap.keySet()) {
            logger.info("key: " + key + " object: " + errMap.get(key).toString());
        }

        if(errMap.size() > 0) {
            Gson gson = new Gson();
            String gsonData = gson.toJson(errMap);
            logger.info("\n\nHEREEEEEEEEEEEEE\n\n");
            throw new DataIntegrityViolationException(gsonData);
        }
        return entryRepo.save(entry);
    }
    
    /**
     * Check if business key of entry (composed or not) is unique within the already existing 
     * entries in the referential. Throws a DuplicateKeyException if it's not the case. 
     */
    private Map<String, Object> validateBusinessKeys(Entry entry, List<Colfig> bkColfigs) {
        var bkFieldsError = new HashMap<String, Object>();
        
        if(bkColfigs.size() > 0) {                              // we build a list of strings of bk1 bk2 ... bkn strings present in the ref 
            var newEntryBkSlice = "";                           

            for(var bkColfig: bkColfigs)
                newEntryBkSlice += entry.fields.get(bkColfig.id);

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
                    for(var bkColfig: bkColfigs) {
                        bkFieldsError.put(bkColfig.id, "Entry with BK (" + newEntryBkSlice + ") already exists.");
                        
                        Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
                        logger.info("\n\nENTRY TO JSON\n\n");
                        logger.info("\n\n"+entries.get(idx).toString()+"\n\n");
                        bkFieldsError.put("dupEntry", gson.toJson(entries.get(idx)));
                    }
                    return bkFieldsError;
                }
            }
        }
        return bkFieldsError;
    }

    private Map<String, String> validateRequiredFields(Entry entry, List<Colfig> reqColfigs) {
        var reqFieldErrors = new HashMap<String, String>();
        if(reqColfigs.size() > 0) {
            for(var reqColfig: reqColfigs) {
                
                if(entry.fields.get(reqColfig.id).isBlank()) {
                    reqFieldErrors.put(reqColfig.id, "field is required");
                    // throw new DataIntegrityViolationException("Missing Required field '" + reqColfig.name + "' is blank.");
                }
            }
        }
        return reqFieldErrors;
    }
}
