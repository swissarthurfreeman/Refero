package ch.refero.domain.model.constraints;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;

import ch.refero.domain.repository.ColfigRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

// used in Entry to validate refId, list<colId> pairs...
// TODO : move this to EntryService validation method instead.
public class ValidColfigIdConstraintValidator implements ConstraintValidator<ValidColfigIdConstraint, Pair<String, List<String>>> {
    @Autowired
    ColfigRepository colfigRepo;
    
    @Override
    public boolean isValid(Pair<String, List<String>> refidFieldsPair, ConstraintValidatorContext context) {
        if(refidFieldsPair.getFirst() == null || refidFieldsPair.getSecond() == null) 
            return false;   // this makes me angry, not caught by @NotBlank first

        for(var colfigId: refidFieldsPair.getSecond()) {
            var colfig = colfigRepo.findById(colfigId);
            if(colfig.isEmpty()) {                              // if colfig doesn't exist
                context.disableDefaultConstraintViolation();    
                context
                    .buildConstraintViolationWithTemplate("Invalid colfigId " + colfigId)
                    .addConstraintViolation();
                return false;
            }  else {                                                // if colfig exists, but belongs to another refid
                if(!colfig.get().refid.equals(refidFieldsPair.getFirst())) {
                    context.disableDefaultConstraintViolation();   
                    context
                        .buildConstraintViolationWithTemplate("Column with id '" + colfig.get().id + "' belongs to another referential")
                        .addConstraintViolation();
                    return false;
                }
            }
        }
        return true;
    }
}