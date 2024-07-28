package ch.refero.domain.service;

import ch.refero.domain.model.Colfig;
import ch.refero.domain.model.Injection;
import ch.refero.domain.repository.ColfigRepository;
import ch.refero.domain.repository.InjectionRepository;
import ch.refero.domain.service.business.InjectionUpdateConstraintViolationException;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.View;

@Service
public class InjectionService {

  Logger logger = LoggerFactory.getLogger(InjectionService.class);

  @Autowired
  private InjectionRepository injecRepo;

  @Autowired
  private ColfigRepository colRepo;

  @Autowired
  private View error;

  public List<Injection> findAll(Optional<String> refid) {
    if (refid.isPresent()) {
      return injecRepo.findByRefid(refid.get());
    }

    return injecRepo.findAll();
  }

  /**
   * Upon updating or creating an injection, validate the following constraints : 1. A target column
   * can only appear once in the injection. 2. Every target column must be valid and part of target
   * referential. 3. Every source column must be valid and part of source referential.
   *
   * @param inj injection to create or update.
   */
  private void ValidateItemSpecificRules(
      Injection inj) {     // TODO : check columns ids are all valid, etc and other constraints.
    var errorMap = new HashMap<String, String>();
    CheckTargetColumnsUnicity(inj, errorMap);
    CheckTargetColumnsValidity(inj, errorMap);
    CheckSourceColumnsValidity(inj, errorMap);
    if (!errorMap.isEmpty()) {
      throw new InjectionUpdateConstraintViolationException(errorMap);
    }
  }

  private void CheckSourceColumnsValidity(Injection inj, HashMap<String, String> errorMap) {
    var srcColIds = inj.mappings.keySet();
    for (String srcColId : srcColIds) {
      Optional<Colfig> optCol = colRepo.findById(srcColId);
      if (optCol.isEmpty()) {
        errorMap.put(srcColId, "Source column does not exist.");
        continue;
      }
      if (!optCol.get().refid.equals(inj.srcid)) {
        errorMap.put(srcColId, "Source column does not belong to source referential.");
      }
    }
  }

  private void CheckTargetColumnsValidity(Injection inj, HashMap<String, String> errorMap) {
    var targetColIds = inj.mappings.values();
    for (String targetColId : targetColIds) {
      Optional<Colfig> optCol = colRepo.findById(targetColId);
      if (optCol.isEmpty()) {
        errorMap.put(targetColId, "Target column does not exist");
        continue;
      }
      if (!optCol.get().refid.equals(inj.refid)) {
        errorMap.put(targetColId, "Target column does not belong to target referential.");
        continue;
      }
    }
  }

  private void CheckTargetColumnsUnicity(Injection inj, HashMap<String, String> errorMap) {
    Set<String> destColIds = new HashSet<>(inj.getMappings().values());
    if (inj.getMappings().values().size() != destColIds.size()) {
      errorMap.put("mappings", "duplicate destination column ids provided in map");
    }
  }

  private Injection save(Injection inj) {
    ValidateItemSpecificRules(inj);
    return injecRepo.save(inj);
  }

  public Injection create(Injection injection) {
    injection.id = UUID.randomUUID().toString();
    return save(injection);
  }
}
