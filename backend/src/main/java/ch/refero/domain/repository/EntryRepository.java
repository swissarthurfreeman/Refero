package ch.refero.domain.repository;

import java.util.List;
import java.util.Optional;
import ch.refero.domain.model.Entry;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface EntryRepository extends JpaRepository<Entry, String>, JpaSpecificationExecutor<Entry> {
    List<Entry> findAll(Specification<Entry> spec);
    Optional<Entry> findById(String id);
}
