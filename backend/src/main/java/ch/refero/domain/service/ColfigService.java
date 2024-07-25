package ch.refero.domain.service;


import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import java.util.Optional;
import org.slf4j.LoggerFactory;

import ch.refero.domain.model.ColType;
import ch.refero.domain.model.Colfig;
import org.springframework.stereotype.Service;
import ch.refero.domain.repository.ColfigRepository;
import ch.refero.domain.service.business.ColfigDoesNotExistException;
import ch.refero.domain.service.business.ColfigWithSameNameAlreadyExistsException;
import ch.refero.domain.service.utils.ConstraintUtils;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class ColfigService {
    Logger logger = LoggerFactory.getLogger(ColfigService.class);

    @Autowired
    private ColfigRepository colRepo;

    public List<Colfig> findAll(Optional<String> refid) {
        if(refid.isPresent())
            colRepo.findByRefid(refid.get());

        return colRepo.findAll();
    }

    public Colfig findById(String id) {
        var col = colRepo.findById(id);
        
        if(col.isPresent())
            return col.get();

        throw new ColfigDoesNotExistException();
    }
    
    private void CheckColfigNameIsUnique(Colfig colfig) {
        var cols = colRepo.findByRefid(colfig.refid);
        
        for(var col: cols) // 1. if another column with a different name exists, error. 
            if(col.name.equals(colfig.name) && !colfig.id.equals(col.id))
                throw new ColfigWithSameNameAlreadyExistsException();
    }

    @Autowired
    private ConstraintUtils cUtils;
    /**
     * Upon updating or creating a column for a ref, we check the following :
     * 1. check column name doesn't already exist
     * 2. if column becomes a BK, check unicity
     * 3. if date format is provided, check all values for coherence. 
     * 4. if column becomes an FK, check pointedRefId, pointedRefColId, pointedRefColLabel
     *    are all valid. 
     * @param col the colfig to create or update, will have an already assigned id. 
     */
    public void ValidateItemSpecificRules(Colfig colfig) {
        CheckColfigNameIsUnique(colfig);                                                                // 1. check column name unicity
        if(colfig.coltype.equals(ColType.BK)) cUtils.CheckBkUnicityWhenUpdatingOrAddingA(colfig);       // 2. check Bk unicity   
        if(colfig.dateformat != null) cUtils.CheckDateFormatConstraintOf(colfig);                       // 3. check date format
        if(colfig.required) cUtils.CheckRequiredConstraintOf(colfig);                                   // 4. check required constraint
        if(colfig.coltype.equals(ColType.FK)) {}                                                        // 5. TODO check FK validity
    }      
    
    /**
     * Save the Colfig object to the database. If the refid
     * does not reference a valid referential, nothing is saved
     * and return optional is null.
     * @param col the correctly formatted Colfig object to save.
     * @return The newly  saved Colfig, with the server assigned id. 
     */
    public Colfig save(Colfig col) {
        ValidateItemSpecificRules(col);
        return colRepo.save(col);
    }

    /**
     * Create a NEW Colfig Object. 
     * @param col
     * @return
     */
    public Colfig create(Colfig col) {
        col.id = UUID.randomUUID().toString();
        return save(col);
    }


    /**
     * Update of a new colfigId creates a new Colfig. 
     * @param colfigId
     * @param col
     * @return
     */
    public Colfig update(String colfigId, Colfig col) {  // in this case, we update, transfer all fields over
        findById(colfigId);
        return save(col);
    }
}
