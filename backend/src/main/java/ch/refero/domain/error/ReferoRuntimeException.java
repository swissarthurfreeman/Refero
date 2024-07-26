package ch.refero.domain.error;

import java.util.Map;

public class ReferoRuntimeException extends RuntimeException {
    public Map<String, String> fieldsErrorMap;

    public ReferoRuntimeException(Map<String, String> fieldsErrorMap) {
        super();
        this.fieldsErrorMap = fieldsErrorMap;
    }
}
