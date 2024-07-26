package ch.refero.domain.service.business;

import ch.refero.domain.error.ReferoRuntimeException;
import java.util.Map;

public class ColfigUpdateConstraintViolationException extends ReferoRuntimeException {
  public ColfigUpdateConstraintViolationException(Map<String, String> errorMap) {
    super(errorMap);
  }
}
