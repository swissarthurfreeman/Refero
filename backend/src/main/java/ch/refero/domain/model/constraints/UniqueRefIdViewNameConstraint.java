package ch.refero.domain.model.constraints;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueRefIdViewNameConstraintValidator.class)
public @interface UniqueRefIdViewNameConstraint {
    String message() default "Referential already has a view with that name.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
