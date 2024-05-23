package ch.refero.domain.model.constraints;


import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ch.refero.domain.repository.ReferentialRepository;
import org.springframework.beans.factory.annotation.Autowired;


public class ValidRefIdConstraintValidator implements ConstraintValidator<ValidRefIdConstraint, String> {

    @Autowired
    ReferentialRepository refRepo;
    

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if(value == null) 
            return false;   // this makes me angry

        if(refRepo.findById(value).isPresent())
            return true;
        return false;
    }
}
