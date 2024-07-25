package ch.refero.domain.service.business;

public class ColfigUpdateRequiredMissingValuesInRefEntriesException extends RuntimeException {
    public ColfigUpdateRequiredMissingValuesInRefEntriesException() {
        super("Setting colfig to required is impossible as referential contains entries with missing values.");
    }
}

