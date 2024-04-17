package ch.refero.domain.repository;

import java.util.List;
import java.util.Optional;
import ch.refero.domain.model.Referential;
import org.springframework.data.repository.CrudRepository;


public interface ReferentialRepository extends CrudRepository<Referential, String> {
    List<Referential> findAll();
    Optional<Referential> findById(String id);

}
