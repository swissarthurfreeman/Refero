package ch.refero.domain.service.business;

import ch.refero.domain.error.ReferoRuntimeException;
import java.util.Map;

public class EntryUpdateConstraintViolationException extends ReferoRuntimeException {
  public EntryUpdateConstraintViolationException(Map<String, String> fieldsErrorMap) {
    super(fieldsErrorMap);
  }
}
