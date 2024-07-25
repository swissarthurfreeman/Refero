package ch.refero.domain.service.business;

public class ReferentialDoesNotExistException extends RuntimeException {

    public ReferentialDoesNotExistException() {
      super("Referential does not exist.");
    }
}
