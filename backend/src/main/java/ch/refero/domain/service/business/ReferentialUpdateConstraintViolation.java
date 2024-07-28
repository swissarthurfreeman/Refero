package ch.refero.domain.service.business;

import ch.refero.domain.error.ReferoRuntimeException;
import java.util.Map;

public class ReferentialUpdateConstraintViolation extends ReferoRuntimeException {

  public ReferentialUpdateConstraintViolation(Map<String, String> fieldsErrorMap) {
    super(fieldsErrorMap);
  }
}
