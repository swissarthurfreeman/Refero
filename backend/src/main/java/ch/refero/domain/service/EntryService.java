package ch.refero.domain.service;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ch.refero.domain.model.Entry;
import ch.refero.domain.repository.EntryRepository;
import ch.refero.domain.repository.specifications.FilterByRefIdSpecification;

@Service
public class EntryService {

    @Autowired
    private EntryRepository entryRepo;
    Logger logger = LoggerFactory.getLogger(ReferentialService.class);

    public List<Entry> findAll(Optional<String> ref_id) {
        if(ref_id.isPresent()) {
            var spec = new FilterByRefIdSpecification<Entry>().filterColfig(ref_id.get());
            var entries = entryRepo.findAll(spec);
            return entries;
        }
        return entryRepo.findAll();
    }

    public Optional<Entry> findById(String entryId) {
        var entry = entryRepo.findById(entryId);
        return entry;
    }

    public Entry create(Entry entry) {
        // TODO : check every column id in entry is valid
        // if column is BK, check it's unique. 
        return entryRepo.save(entry);
    }

    public Entry update(String id, Entry entry) {
        return this.entryRepo.save(entry);
    }
}
