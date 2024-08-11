package ch.refero.domain.service;


import ch.refero.domain.model.ColType;
import ch.refero.domain.model.Colfig;
import ch.refero.domain.repository.ColfigRepository;
import ch.refero.domain.repository.EntryRepository;
import ch.refero.domain.repository.InjectionRepository;
import ch.refero.domain.repository.ViewRepository;
import ch.refero.domain.service.business.ColfigDoesNotExistException;
import ch.refero.domain.service.business.ColfigUpdateConstraintViolationException;
import ch.refero.domain.service.utils.ConstraintUtils;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ColfigService {

  Logger logger = LoggerFactory.getLogger(ColfigService.class);

  @Autowired
  private ColfigRepository colRepo;
  @Autowired
  private ColfigRepository colfigRepository;

  public List<Colfig> findAll(Optional<String> refid) {
    if (refid.isPresent()) {
      return colRepo.findByRefid(refid.get());
    }

    return colRepo.findAll();
  }

  public Colfig findById(String id) {
    var col = colRepo.findById(id);

    if (col.isPresent()) {
      return col.get();
    }

    throw new ColfigDoesNotExistException();
  }

  private void CheckColfigNameIsUnique(Colfig colfig, Map<String, Object> errorMap) {
    var cols = colRepo.findByRefid(colfig.refid);

    for (var col : cols) // 1. if another column with a different name exists, error.
    {
      if (col.name.equals(colfig.name) && !colfig.id.equals(col.id)) {
        errorMap.put("name", "Column with same name already exists for this referential.");
      }
    }
  }

  @Autowired
  private ConstraintUtils cUtils;

  /**
   * Upon updating or creating a column for a ref, we check the following : 1. check column name
   * doesn't already exist 2. if column becomes a BK, check unicity 3. if date format is provided,
   * check all values for coherence. 4. if column becomes an FK, check pointedRefId,
   * pointedRefColId, pointedRefColLabel are all valid.
   *
   * @param colfig the colfig to create or update, will have an already assigned id.
   */
  public void ValidateItemSpecificRules(Colfig colfig) {
    var errorMap = new HashMap<String, Object>();
    CheckColfigNameIsUnique(colfig,
        errorMap);                                                                // 1. check column name unicity
    if (colfig.required) {
      cUtils.CheckRequiredConstraintOf(colfig,
          errorMap);                                   // 2. check required constraint
    }
    logger.warn("DATE FORMAT : ");
    logger.warn(colfig.dateformat);
    if (colfig.dateformat != null && !colfig.dateformat.isBlank()) {
      cUtils.CheckDateFormatConstraintOf(colfig,
          errorMap);                       // 3. check date format
    }
    if (colfig.coltype.equals(ColType.BK)) {
      cUtils.CheckBkUnicityWhenUpdatingOrAddingA(colfig, errorMap);       // 4. check Bk unicity
    }
    if (colfig.coltype.equals(ColType.FK)) {
      cUtils.CheckFkValidityOf(colfig, errorMap);                         // 5. check FK validity
    }

    if (!errorMap.isEmpty()) {
      throw new ColfigUpdateConstraintViolationException(errorMap);
    }
  }

  /**
   * Save the Colfig object to the database. If the refid does not reference a valid referential,
   * nothing is saved and return optional is null.
   *
   * @param col the correctly formatted Colfig object to save.
   * @return The newly  saved Colfig, with the server assigned id.
   */
  public Colfig save(Colfig col) {
    ValidateItemSpecificRules(col);
    return colRepo.save(col);
  }

  /**
   * Create a NEW Colfig Object.
   *
   * @param col
   * @return
   */
  public Colfig create(Colfig col) {
    col.id = UUID.randomUUID().toString();
    return save(col);
  }

  /**
   * Create or update a colfig.
   *
   * @param colfigId the id of the colfig, if this id doesn't exist, a new colfig is created with
   *                 colfigId.
   * @param col      the colfig to create.
   * @return the created or updated colfig.
   */
  public Colfig update(String colfigId, Colfig col) {
    col.setId(colfigId);
    return save(col);
  }


  @Autowired
  private ViewRepository viewRepository;

  @Autowired
  private InjectionRepository injectionRepository;

  @Autowired
  private EntryRepository entryRepository;
  /**
   * Delete a colfig.
   * Will be deleted from every view, injection and entry before being deleted from the
   * referential itself.
   * */
  public void delete(String colfigId) {
    // TODO : implement column deletion. Delete from all entries, injections and views.
    // TODO : if column is a BK, make sure that no foreign keys are pointing at it.
    var colfig = findById(colfigId);

    // remove from views
    for(var view: viewRepository.findByRefid(colfig.refid)) {
      view.getDispcolids().remove(colfigId);
      view.getSearchcolids().remove(colfigId);
      viewRepository.save(view);
    }

    // remove from injections
    for(var injection: injectionRepository.findAll()) {
      if(injection.refid.equals(colfig.refid) || injection.srcid.equals(colfig.refid)) {
        injection.getMappings().remove(colfigId);
        for(var key: injection.getMappings().keySet()) {
          if(injection.getMappings().get(key).equals(colfigId)) {
            injection.getMappings().remove(key);
          }
        }
      }
      injectionRepository.save(injection);
    }

    // remove from entries
    for(var entry: entryRepository.findByRefid(colfig.refid)) {
      entry.fields.remove(colfigId);
      entryRepository.save(entry);
    }

    colfigRepository.delete(colfig);
  }
}
