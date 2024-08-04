package ch.refero.domain.service;

import ch.refero.domain.model.RefView;
import ch.refero.domain.repository.ColfigRepository;
import ch.refero.domain.repository.ViewRepository;
import ch.refero.domain.service.business.ViewDoesNotExistException;
import ch.refero.domain.service.business.ViewUpdateConstraintViolation;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ViewService {

  @Autowired
  ViewRepository viewRepo;

  @Autowired
  ColfigRepository colRepo;

  Logger logger = LoggerFactory.getLogger(ReferentialService.class);

  public List<RefView> findAll(Optional<String> refid) {
    if (refid.isPresent()) {
      return viewRepo.findByRefid(refid.get());
    }
    return viewRepo.findAll();
  }

  public RefView findById(String id) {
    var view = viewRepo.findById(id);
    if (view.isPresent()) {
      return view.get();
    }
    throw new ViewDoesNotExistException();
  }

  private void CheckRefViewNameUnicityOf(RefView refView, Map<String, String> errorMap) {
    var views = viewRepo.findByRefidAndName(refView.getRefid(), refView.getName());
    if (!views.isEmpty() && !views.get(0).getId().equals(refView.getId())) {
      errorMap.put("name", "Referential already has a view with that name.");
    }
  }

  private void CheckSearchDispColIdsValidityOf(RefView refView, Map<String, String> errorMap) {
    for (String searchColId : refView.searchcolids) {
      // if null, or doesn't refer to existing column, or refers to column that doesn't belong to the referential...
      if (searchColId == null || colRepo.findById(searchColId).isEmpty() || !colRepo.findById(
          searchColId).get().getRefid().equals(refView.refid)) {
        errorMap.put("searchcolids", "List contains invalid column ids.");
      }
    }

    for (String dispColId : refView.dispcolids) {
      if (dispColId == null || colRepo.findById(dispColId).isEmpty() || !colRepo.findById(
          dispColId).get().getRefid().equals(refView.refid)) {
        errorMap.put("dispcolids", "List contains invalid column ids.");
      }
    }
  }

  /**
   * Check all dispColIds and searchColIds columns are valid and belong to the referential. (done
   * with @ValidColfigIdConstraintValidator on pairs no ?)
   *
   * @param refView TODO : move validation here for the sake of uniformity and maintenance.
   */
  public void ValidateItemSpecificRules(RefView refView) {
    var errorMap = new HashMap<String, String>();
    CheckRefViewNameUnicityOf(refView, errorMap);
    CheckSearchDispColIdsValidityOf(refView, errorMap);

    if (!errorMap.isEmpty()) {
      throw new ViewUpdateConstraintViolation(errorMap);
    }
  }

  public RefView save(RefView refView) {
    ValidateItemSpecificRules(refView);
    return viewRepo.save(refView);
  }

  public RefView create(RefView refView) {
    refView.setId(UUID.randomUUID().toString());
    return save(refView);
  }

  public RefView update(String id, RefView refView) {
    refView.setId(id);
    return save(refView);
  }

  public void delete(String id) {
    viewRepo.deleteById(id);
  }
}
