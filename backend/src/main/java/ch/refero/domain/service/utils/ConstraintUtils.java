package ch.refero.domain.service.utils;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ch.refero.domain.model.ColType;
import ch.refero.domain.model.Colfig;
import ch.refero.domain.model.Entry;
import ch.refero.domain.repository.ColfigRepository;
import ch.refero.domain.repository.EntryRepository;
import ch.refero.domain.service.business.ColfigUpdateBkContainsDuplicateValuesException;
import ch.refero.domain.service.business.ColfigUpdateRequiredMissingValuesInRefEntriesException;
import ch.refero.domain.service.business.EntryContainsDuplicateBkValuesException;
import ch.refero.domain.service.business.EntryHasMissingRequiredValuesException;

@Service
public class ConstraintUtils {
    Logger logger = LoggerFactory.getLogger(ConstraintUtils.class);

    @Autowired
    private EntryRepository entryRepo;

    @Autowired
    private ColfigRepository colfigRepo;

    /**
     * Check composed BK Unicity constraint is valid after adding an
     * Entry to the referential. 
     * @param entry the entry to be added to the referential. 
     */
    public void CheckBkUnicityWhenUpdatingOrAddingAn(Entry entry) {
        var entries = entryRepo.findByRefid(entry.refid);
        var colfigs = colfigRepo.findByRefidAndColtype(entry.refid, ColType.BK);
        logger.info("Found # of BK colfigs for ref :" + String.valueOf(colfigs.size()));

        String entryBkSlice = getBkSliceOf(entry, colfigs); 
        Set<String> bkSlices = new HashSet<>(); 

        for(var e: entries)
            if(!e.id.equals(entry.id))
                bkSlices.add(getBkSliceOf(e, colfigs));

        logger.info(bkSlices.toString());
        if(bkSlices.contains(entryBkSlice))
            throw new EntryContainsDuplicateBkValuesException();
    }

    /**
     * Check composed BK unicity constraint is valid after adding or
     * updating a column to the referential.
     * @param colfig the column to update or add to the referential. 
     */
    public void CheckBkUnicityWhenUpdatingOrAddingA(Colfig colfig) {
        var entries = entryRepo.findByRefid(colfig.refid);
        // get all colfigs which are BKs, belong to the ref but are not the parameter colfig.
        var colfigs = colfigRepo.findByRefidAndColtypeAndIdNot(colfig.refid, ColType.BK, colfig.id);
        colfigs.add(colfig);

        Set<String> bkSlices = new HashSet<>();
        for(var e: entries) {
            String bkSlice = getBkSliceOf(e, colfigs);
            if(bkSlices.contains(bkSlice))
                throw new ColfigUpdateBkContainsDuplicateValuesException();
            bkSlices.add(bkSlice);
        }
    }

    /**
     * Check entry's date field is valid with respect to colfig's dateFormat 
     * property. 
     * @param entry the entry to test. 
     * @throws DateTimeParseException if entry's date field syntax is invalid. 
     */
    public void CheckDateFormatConstraintOn(Entry entry) {
        List<Colfig> colfigs = colfigRepo.findByRefidAndDateformatNotNull(entry.refid);

        for(var col: colfigs) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(col.dateformat);
            LocalDate.parse(entry.fields.get(col.id), formatter);
        }
    }

    /**
     * Check if Colfig's dateFormat is respected by entries of referential.
     * @param colfig the colfig with a non null dateFormat. 
     * @throws IllegalArgumentException if colfig dateFormat syntax is invalid
     * @throws DateTimeParseException if an entry's date field syntax is invalid.
     */
    public void CheckDateFormatConstraintOf(Colfig colfig) {
        var entries = entryRepo.findByRefid(colfig.refid);
        
        for(var e: entries) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(colfig.dateformat);
            if(e.fields.get(colfig.id) != null)                             // TODO : validate this is correct behavior
                LocalDate.parse(e.fields.get(colfig.id), formatter);    // if non required, this will not throw if value is null.
        }
    }

    /**
     * Check if colfig marked as required has a non blank value in entry.
     * @param entry the entry with said colfig in it's fields map. 
     */
    public void CheckRequiredConstraintOn(Entry entry) {
        var colfigs = colfigRepo.findByRefidAndRequired(entry.refid, true);
        logger.info("Found # of required columns : " + String.valueOf(colfigs.size()));
        for(var col: colfigs)
            if(entry.fields.get(col.id) == null || entry.fields.get(col.id).isBlank())
                throw new EntryHasMissingRequiredValuesException();
    }

    /**
     * Check if all entries of referential have a value for colfig.
     * @param colfig marked as required. 
     */
    public void CheckRequiredConstraintOf(Colfig colfig) {
        var entries = entryRepo.findByRefid(colfig.refid);

        for(var e: entries) // java lazy checks, first check prevents error
            if(e.fields.get(colfig.id) == null || e.fields.get(colfig.id).isBlank())
                throw new ColfigUpdateRequiredMissingValuesInRefEntriesException();
    }

    /**
     * Given an entry with columns (c1 c2 c3 c4) and values (a  b  c  d)
     * if c1 and c4 form a composed BK, return the string 'ad'.
     */
    public String getBkSliceOf(Entry entry, List<Colfig> bkColfigs) {
        var newEntryBkSlice = "";
        for(var bkColfig: bkColfigs) newEntryBkSlice += entry.fields.get(bkColfig.id);
        return newEntryBkSlice;
    }
}
