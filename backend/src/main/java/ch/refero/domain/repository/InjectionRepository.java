package ch.refero.domain.repository;

import ch.refero.domain.model.Injection;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.lang.NonNull;


public interface InjectionRepository extends JpaRepository<Injection, String>, JpaSpecificationExecutor<Injection>  {
    @NonNull List<Injection> findAll();
    @NonNull Optional<Injection> findById(@NonNull String id);
}
