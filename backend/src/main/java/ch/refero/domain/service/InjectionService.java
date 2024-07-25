package ch.refero.domain.service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ch.refero.domain.model.Injection;
import ch.refero.domain.repository.InjectionRepository;

@Service
public class InjectionService {
    Logger logger = LoggerFactory.getLogger(InjectionService.class);

    @Autowired
    private InjectionRepository injecRepo;

    public List<Injection> findAll(Optional<String> refid) {
        if(refid.isPresent())
            return injecRepo.findByRefid(refid.get());
        
        return injecRepo.findAll();
    }

    private void ValidateItemSpecificRules(Injection inj) {     // TODO : check columns ids are all valid, etc and other constraints.

    }

    private Injection save(Injection inj) {
        ValidateItemSpecificRules(inj);
        return injecRepo.save(inj);
    }
    
    public Injection create(Injection injection) {
        injection.id = UUID.randomUUID().toString();
        return save(injection);  
    }
}
