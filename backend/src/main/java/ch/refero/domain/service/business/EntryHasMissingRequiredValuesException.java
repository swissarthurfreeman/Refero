package ch.refero.domain.service.business;

public class EntryHasMissingRequiredValuesException extends RuntimeException {
    public EntryHasMissingRequiredValuesException() {
        super("Entry has missing required values.");
    }
}
