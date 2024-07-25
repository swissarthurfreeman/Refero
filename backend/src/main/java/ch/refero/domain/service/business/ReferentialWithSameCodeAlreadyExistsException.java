package ch.refero.domain.service.business;

public class ReferentialWithSameCodeAlreadyExistsException extends RuntimeException {
    public ReferentialWithSameCodeAlreadyExistsException() {
        super("Referential with same code already exists.");
    }
}
