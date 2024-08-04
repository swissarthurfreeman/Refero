package ch.refero.domain.service.business;

import ch.refero.domain.error.ReferoRuntimeException;
import java.util.Map;

public class ViewUpdateConstraintViolation extends ReferoRuntimeException {
  public ViewUpdateConstraintViolation(Map<String, Object> fieldsErrorMap) {
    super(fieldsErrorMap);
  }
}
