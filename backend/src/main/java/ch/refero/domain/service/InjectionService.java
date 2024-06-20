package ch.refero.domain.service;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ch.refero.domain.model.Injection;
import ch.refero.domain.repository.InjectionRepository;
import ch.refero.domain.repository.specifications.FilterByrefidSpecification;

@Service
public class InjectionService {
    Logger logger = LoggerFactory.getLogger(InjectionService.class);

    @Autowired
    private InjectionRepository injecRepo;

    public List<Injection> findAll(Optional<String> refid) {
        if(refid.isPresent()) {
            var spec = new FilterByrefidSpecification<Injection>().filterColfig(refid.get());
            var injections = injecRepo.findAll(spec);
            return injections;
        }
        return injecRepo.findAll();
    }
    
    public Injection create(Injection injection) {
        return this.injecRepo.save(injection);  // TODO : check columns ids are all valid, etc. 
    }
}
