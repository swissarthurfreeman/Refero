package ch.refero.domain.service;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ch.refero.domain.model.Colfig;
import ch.refero.domain.repository.ColfigRepository;
import ch.refero.domain.repository.specifications.ColfigSpecification;

@Service
public class ColfigService {
    @Autowired
    private ColfigRepository colRepo;

    public List<Colfig> findAll(Optional<String> ref_id) {
        if(ref_id.isPresent()) {
            var spec = ColfigSpecification.filterColfig(ref_id.get());
            var cols = colRepo.findAll(spec);
            return cols;
        }
        return colRepo.findAll();
    }

    public Optional<Colfig> findById(String id) {
        return colRepo.findById(id);
    }

    public Colfig save(Colfig col) {
        return colRepo.save(col);
    }
}
