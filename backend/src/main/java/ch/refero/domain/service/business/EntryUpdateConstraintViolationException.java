package ch.refero.domain.service.business;

import ch.refero.domain.error.ReferoRuntimeException;
import ch.refero.domain.model.Entry;
import java.util.Map;
import java.util.Optional;

public class EntryUpdateConstraintViolationException extends ReferoRuntimeException {
  public Entry incomingEntry;
  public Optional<Entry> dupEntry;

  public EntryUpdateConstraintViolationException(Map<String, Object> fieldsErrorMap, Entry incomingEntry, Optional<Entry> dupEntry) {
    super(fieldsErrorMap);
    this.incomingEntry = incomingEntry;
    this.dupEntry = dupEntry;
  }
}
