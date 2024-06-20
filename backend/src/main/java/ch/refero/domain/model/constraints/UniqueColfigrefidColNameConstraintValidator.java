package ch.refero.domain.model.constraints;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;

import ch.refero.domain.model.Colfig;
import ch.refero.domain.service.ColfigService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;


public class UniqueColfigrefidColNameConstraintValidator implements ConstraintValidator<UniqueColfigrefidColNameConstraint, Pair<String, String>> {
    @Autowired
    ColfigService colfigService;

	@Override // value is (refid, colfig_name) pair
	public boolean isValid(Pair<String, String> value, ConstraintValidatorContext context) {
        List<Colfig> colfigs = colfigService.findAll(Optional.of(value.getFirst()));
        for(var colfig: colfigs)
            if(colfig.name.equals(value.getSecond()))
                return false;
		return true;
	}
    
}
