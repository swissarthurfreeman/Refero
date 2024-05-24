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
import ch.refero.domain.repository.specifications.FilterByRefIdSpecification;
import ch.refero.domain.service.ReferentialService;
import ch.refero.domain.service.ViewService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;


public class UniqueRefIdViewNameConstraintValidator implements ConstraintValidator<UniqueRefIdViewNameConstraint, RefView> {
    @Autowired
    ReferentialRepository refRepository;

    Logger logger = LoggerFactory.getLogger(UniqueRefIdViewNameConstraintValidator.class);
	
    @Override // value is (ref_id, view_name) pair
	public boolean isValid(RefView value, ConstraintValidatorContext context) {
        var ref = this.refRepository.findById(value.ref_id).get();
        for(var view: ref.views)
            if(view.name.equals(value.name))
                return false;
        return true;
        
	}
}
