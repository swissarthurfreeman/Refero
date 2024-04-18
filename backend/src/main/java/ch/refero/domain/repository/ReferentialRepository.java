package ch.refero.domain.repository;

import ch.refero.domain.model.Referential;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.lang.NonNull;


public interface ReferentialRepository extends JpaRepository<Referential, String>, JpaSpecificationExecutor<Referential>  {
    @NonNull List<Referential> findAll();
    @NonNull Optional<Referential> findById(@NonNull String id);
}
