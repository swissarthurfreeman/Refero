package ch.refero.domain.model.constraints;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ValidRefIdConstraintValidator.class)
public @interface ValidRefIdConstraint {
    String message() default "ref_id is not valid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
