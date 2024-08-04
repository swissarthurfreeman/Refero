package ch.refero.domain.error;

import java.util.Map;

public class ReferoRuntimeException extends RuntimeException {
    public Map<String, Object> fieldsErrorMap;

    public ReferoRuntimeException(Map<String, Object> fieldsErrorMap) {
        super();
        this.fieldsErrorMap = fieldsErrorMap;
    }
}
