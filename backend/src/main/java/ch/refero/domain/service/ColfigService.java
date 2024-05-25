package ch.refero.domain.service;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ch.refero.domain.model.Colfig;
import ch.refero.domain.repository.ColfigRepository;
import ch.refero.domain.repository.specifications.FilterByRefIdSpecification;

@Service
public class ColfigService {
    @Autowired
    private ColfigRepository colRepo;

    public List<Colfig> findAll(Optional<String> ref_id) {
        if(ref_id.isPresent()) {
            
            var spec = new FilterByRefIdSpecification<Colfig>().filterColfig(ref_id.get());
            var cols = colRepo.findAll(spec);
            return cols;
        }
        return colRepo.findAll();
    }

    public Optional<Colfig> findById(String id) {
        return colRepo.findById(id);
    }

    @Autowired
    ReferentialService refService;

    Logger logger = LoggerFactory.getLogger(ColfigService.class);

    /**
     * Save the Colfig object to the database. If the ref_id
     * does not reference a valid referential, nothing is saved
     * and return optional is null.
     * @param col the correctly formatted Colfig object to save.
     * @return The newly  saved Colfig, with the server assigned id. 
     */
    public Optional<Colfig> save(Colfig col) {
        return Optional.of(colRepo.save(col));
    }
}
