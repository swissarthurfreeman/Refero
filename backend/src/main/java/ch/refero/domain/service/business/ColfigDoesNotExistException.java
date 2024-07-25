package ch.refero.domain.service.business;

public class ColfigDoesNotExistException extends RuntimeException {

    public ColfigDoesNotExistException() {
      super("Colfig does not exist.");
    }
}
