package ch.refero.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.lang.NonNull;

import ch.refero.domain.model.RefView;


public interface ViewRepository extends JpaRepository<RefView, String>, JpaSpecificationExecutor<RefView> {
    @NonNull List<RefView> findAll(@NonNull Specification<RefView> spec);
    @NonNull Optional<RefView> findById(@NonNull String id);
}
