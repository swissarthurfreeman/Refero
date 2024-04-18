package ch.refero.domain.repository;

import ch.refero.domain.model.Referential;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;


public interface ReferentialRepository extends CrudRepository<Referential, String> {
    List<Referential> findAll();
    Optional<Referential> findById(String id); 
    Referential save(Referential ref);
}
