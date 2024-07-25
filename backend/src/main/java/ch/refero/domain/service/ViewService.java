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

@Service
public class ViewService {
    @Autowired
    ViewRepository viewRepo;

    @Autowired
    ColfigRepository colRepo;

    Logger logger = LoggerFactory.getLogger(ReferentialService.class);

    public List<RefView> findAll(Optional<String> refid) {
        if(refid.isPresent()) {
            return viewRepo.findByRefid(refid.get());
        }
        return viewRepo.findAll();
    }

    public Optional<RefView> findById(String id) {
        return viewRepo.findById(id);
    }

    public Optional<RefView> create(RefView RefView) {      // TODO : this and view controller needs revamping
        for(String dispColId : RefView.dispcolids)          // check all columns are valid
            if(colRepo.findById(dispColId).isEmpty())
                return Optional.empty();

        for(String searchColId : RefView.searchcolids)
            if(colRepo.findById(searchColId).isEmpty())
                return Optional.empty();
        
        return Optional.of(viewRepo.save(RefView));
    }

    public Optional<RefView> update(String id, RefView RefView) {
        return null;
    }
}
