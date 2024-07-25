package ch.refero.domain.service.business;

public class ColfigWithSameNameAlreadyExistsException extends RuntimeException {
    public ColfigWithSameNameAlreadyExistsException() {
        super("Column with same name already exists for this ref.");
    }
}
