package ch.refero.domain.service.business;

public class ReferentialWithSameNameAlreadyExistsException extends RuntimeException {
    public ReferentialWithSameNameAlreadyExistsException() {
      super("Referential with same name already exists.");
    }
}
