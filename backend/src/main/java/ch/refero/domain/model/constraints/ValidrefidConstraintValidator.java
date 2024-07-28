package ch.refero.domain.model.constraints;


import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ch.refero.domain.repository.ReferentialRepository;
import org.springframework.beans.factory.annotation.Autowired;


public class ValidrefidConstraintValidator implements ConstraintValidator<ValidrefidConstraint, String> {

    @Autowired
    ReferentialRepository refRepo;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if(value == null) 
            return false;   // this makes me angry, not caught by @NotBlank first

      return refRepo.findById(value).isPresent();
    }
}
