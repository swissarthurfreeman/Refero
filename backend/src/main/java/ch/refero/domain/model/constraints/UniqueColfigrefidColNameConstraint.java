package ch.refero.domain.model.constraints;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueColfigrefidColNameConstraintValidator.class)
public @interface UniqueColfigrefidColNameConstraint {

    String message() default "Referential already has a column with that name.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
