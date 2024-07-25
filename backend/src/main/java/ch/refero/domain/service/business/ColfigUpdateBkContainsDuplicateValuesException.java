package ch.refero.domain.service.business;

public class ColfigUpdateBkContainsDuplicateValuesException extends RuntimeException {
    public ColfigUpdateBkContainsDuplicateValuesException() {
        super("Colfig cannot be marked as BK ref contains entries with duplicate values at that column.");
    }
}
