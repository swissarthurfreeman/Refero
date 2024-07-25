package ch.refero.domain.service.business;

public class EntryContainsDuplicateBkValuesException extends RuntimeException {
    public EntryContainsDuplicateBkValuesException() {
        super("Entry contains duplicate BK values exception.");
    }
}
