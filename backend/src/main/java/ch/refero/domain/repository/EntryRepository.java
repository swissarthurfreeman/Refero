package ch.refero.domain.repository;

import java.util.List;
import java.util.Optional;
import ch.refero.domain.model.Entry;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.lang.NonNull;

public interface EntryRepository extends JpaRepository<Entry, String>, JpaSpecificationExecutor<Entry> {
    @NonNull List<Entry> findAll(@NonNull Specification<Entry> spec);
    @NonNull Optional<Entry> findById(@NonNull String id);
    @NonNull List<Entry> findByRefid(@NonNull String refid);
}
