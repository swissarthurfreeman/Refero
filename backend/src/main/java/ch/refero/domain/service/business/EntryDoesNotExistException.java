package ch.refero.domain.service.business;

public class EntryDoesNotExistException extends RuntimeException {

    public EntryDoesNotExistException() {
      super("Entry does not exist.");
    }
}
