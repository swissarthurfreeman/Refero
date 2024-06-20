package ch.refero.domain.model.constraints;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;

import ch.refero.domain.model.RefView;
import ch.refero.domain.repository.ReferentialRepository;
import ch.refero.domain.repository.ViewRepository;
import ch.refero.domain.repository.specifications.FilterByrefidSpecification;
import ch.refero.domain.service.ReferentialService;
import ch.refero.domain.service.ViewService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;


public class UniquerefidViewNameConstraintValidator implements ConstraintValidator<UniquerefidViewNameConstraint, RefView> {
    @Autowired
    ReferentialRepository refRepository;

    Logger logger = LoggerFactory.getLogger(UniquerefidViewNameConstraintValidator.class);
	
    @Override // value is (refid, view_name) pair
	public boolean isValid(RefView value, ConstraintValidatorContext context) {
        var ref = this.refRepository.findById(value.refid).get();
        for(var view: ref.views)
            if(view.name.equals(value.name))
                return false;
        return true;
        
	}
}
