package ch.refero.domain.service.business;

import ch.refero.domain.error.ReferoRuntimeException;
import java.util.Map;

public class InjectionDoesNotExistException extends RuntimeException {
  public InjectionDoesNotExistException() {
    super("injection does not exist");
  }
}
