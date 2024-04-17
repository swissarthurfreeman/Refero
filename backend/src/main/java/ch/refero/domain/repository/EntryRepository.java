package ch.refero.domain.repository;

import java.util.List;
import java.util.Optional;
import ch.refero.domain.model.Entry;
import org.springframework.data.repository.CrudRepository;

public interface EntryRepository extends CrudRepository<Entry, String> {
    List<Entry> findAll();
    Optional<Entry> findById(String id);
}
