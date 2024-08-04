package ch.refero.domain.service.business;

import ch.refero.domain.error.ReferoRuntimeException;
import java.util.Map;

public class InjectionUpdateConstraintViolationException extends ReferoRuntimeException {
  public InjectionUpdateConstraintViolationException(Map<String, Object> fieldsErrorMap) {
    super(fieldsErrorMap);
  }
}
