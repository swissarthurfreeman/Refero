package ch.refero.domain.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ch.refero.domain.model.RefView;
import ch.refero.domain.repository.ColfigRepository;
import ch.refero.domain.repository.ViewRepository;
import ch.refero.domain.repository.specifications.FilterByRefIdSpecification;

@Service
public class ViewService {
    @Autowired
    ViewRepository viewRepo;

    @Autowired
    ColfigRepository colRepo;

    Logger logger = LoggerFactory.getLogger(ReferentialService.class);

    public List<RefView> findAll(Optional<String> ref_id) {
        if(ref_id.isPresent()) {
            var spec = new FilterByRefIdSpecification<RefView>().filterColfig(ref_id.get());
            return viewRepo.findAll(spec);
        }
        return viewRepo.findAll();
    }

    public Optional<RefView> findById(String id) {
        return viewRepo.findById(id);
    }

    public Optional<RefView> create(RefView RefView) {
        for(String dispColId : RefView.dispColIds)          // check all columns are valid
            if(colRepo.findById(dispColId).isEmpty())
                return Optional.empty();

        for(String searchColId : RefView.searchColIds)
            if(colRepo.findById(searchColId).isEmpty())
                return Optional.empty();
        
        return Optional.of(viewRepo.save(RefView));
    }

    public Optional<RefView> update(String id, RefView RefView) {
        return null;
    }
}
