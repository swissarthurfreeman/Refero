package ch.refero.domain.service.business;

public class RequiredColfigRefHasMissingValuesException extends RuntimeException {
    public RequiredColfigRefHasMissingValuesException() {
        super("Required column has missing values in entries of ref.");
    }
}
